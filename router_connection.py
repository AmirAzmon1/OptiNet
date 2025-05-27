import paramiko
import json
import random
import time
from datetime import datetime, timedelta

PASSWORD = "optinet1234"
ROUTER_IP = "192.168.8.1"

def connect_to_router():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(ROUTER_IP, username="root", password=PASSWORD)
        print("✅ Connected to router")
        return ssh
    except Exception as e:
        print("❌ Failed to connect:", e)
        return None

def run_ssh_command(ssh_client, command):
    try:
        stdin, stdout, stderr = ssh_client.exec_command(command)
        return stdout.read().decode()
    except Exception as e:
        print("❌ SSH command failed:", e)
        return ""

def get_gateway_for_interface(ssh_client, interface):
    cmd = f"ip route show dev {interface} | grep default"
    output = run_ssh_command(ssh_client, cmd)
    if output:
        parts = output.split()
        if "via" in parts:
            return parts[parts.index("via") + 1]
    return None

def ping_latency(ssh_client, ip, fallback_ip=None):
    target_ip = ip or fallback_ip
    if not target_ip or target_ip == "Unknown":
        print(f"⚠️ No IP to ping: {target_ip}")
        return None

    output = run_ssh_command(ssh_client, f"ping -c 1 -W 1 {target_ip}")
    print(f"🟡 Ping output for {target_ip}:\n{output}")

    for line in output.splitlines():
        if "time=" in line:
            try:
                # חותך רק את מה שבא אחרי time=
                time_part = line.split("time=")[-1].split()[0]
                return float(time_part)
            except Exception as e:
                print("❌ Parse error:", e)
                return None
    return None



def get_active_interfaces(ssh_client, limit=2):
    output = run_ssh_command(ssh_client, "mwan3 status")
    print("=== SSH MWAN3 OUTPUT ===")
    print(output)
    interfaces = []
    for line in output.splitlines():
        line = line.strip()
        if line.startswith("interface") and "is online" in line and "tracking is active" in line:
            parts = line.split()
            iface = parts[1]
            interfaces.append(iface)
            if len(interfaces) >= limit:
                break
    return interfaces

def get_ip_for_interface(ssh_client, interface):
    output = run_ssh_command(ssh_client, f"ifstatus {interface}")
    try:
        data = json.loads(output)
        ip = data.get("ipv4-address", [{}])[0].get("address", None)
        print(f"🟢 IP for {interface}: {ip}")
        return ip or "Unknown"
    except Exception as e:
        print(f"❌ Failed to parse IP for {interface}:", e)
        return "Unknown"

def ping_stats(ssh_client, ip):
    """
    מריץ ping -c 4 ומחזיר:
    - packet_loss (%) אמיתי
    - avg_response_time (ms) אמיתי
    """
    output = run_ssh_command(ssh_client, f"ping -c 4 -W 1 {ip}")
    print(f"📡 Full ping stats for {ip}:\n{output}")

    packet_loss = None
    avg_response = None

    for line in output.splitlines():
        line = line.strip()

        if "packet loss" in line:
            try:
                # משתמש ב-split לפי רווחים ואז מחפש את אחוז האובדן (X%)
                parts = line.split()
                for part in parts:
                    if "%" in part:
                        packet_loss = float(part.replace("%", "").strip())
                        break
            except Exception as e:
                print("❌ Packet loss parse error:", e)
                packet_loss = None

        if "min/avg/max" in line or "round-trip" in line:
            try:
                stats_part = line.split('=')[-1]
                avg = stats_part.split('/')[1]
                avg_response = float(avg)
            except Exception as e:
                print("❌ Avg parse error:", e)
                avg_response = None

    return packet_loss, avg_response






def generate_real_neighbors(ssh_client):
    interfaces = get_active_interfaces(ssh_client)
    neighbors = []

    for iface in interfaces:
        ip = get_ip_for_interface(ssh_client, iface)
        gateway = get_gateway_for_interface(ssh_client, iface)
        latency = ping_latency(ssh_client, gateway, fallback_ip=ip)
        packet_loss, avg_response = ping_stats(ssh_client, ip)
        speed, load = measure_interface_traffic(ssh_client, iface)


        neighbors.append( {
            "name": f"{iface.upper()}",
            "ip_address": ip,
            "latency": round(latency, 2) if latency is not None else -1,
            "speed": speed,
            "load": load,
            "status": "active",
            "packet_loss": round(packet_loss, 2) if packet_loss is not None else -1,  
            "uptime": get_interface_uptime(ssh_client, iface),
            "last_checked": datetime.now().isoformat(),
            "rating": 5.0,
            "is_current_route": True,
            "avg_response_time": round(avg_response, 2) if avg_response is not None else -1,

        })

    return neighbors

import time

INTERFACE_MAP = {
    "wan": "eth0",
    "wwan": "apcli0"
}

def get_interface_traffic_load(ssh_client, interface, max_speed_mbps=1000):
    """
    מודד את עומס הממשק באחוזים לפי תעבורת נתונים (Rx+Tx) בפרק זמן קצר
    """

    real_iface = INTERFACE_MAP.get(interface.lower(), interface)

    def read_bytes():
        output = run_ssh_command(ssh_client, "cat /proc/net/dev")
        for line in output.splitlines():
            if real_iface in line:
                parts = line.split()
                if ":" in parts[0]:
                    parts = parts[1:]  # מדלג על שם הממשק
                rx = int(parts[0])  # קלט בייטים
                tx = int(parts[8])  # פלט בייטים
                return rx + tx
        return 0

    try:
        b1 = read_bytes()
        time.sleep(1)  # מדידה בפרק זמן של שנייה
        b2 = read_bytes()
        delta_bytes = b2 - b1

        # ממיר לביטים לשנייה => ל־Mbps
        mbps = (delta_bytes * 8) / 1_000_000
        load_percent = min((mbps / max_speed_mbps) * 100, 100.0)

        return round(load_percent, 2)
    except Exception as e:
        print("❌ Failed to measure load:", e)
        return -1
    
def get_interface_uptime(ssh_client, interface):
    """
    מחזיר את משך הזמן (בדקות) שהממשק פעיל לפי ifstatus
    """
    output = run_ssh_command(ssh_client, f"ifstatus {interface}")
    try:
        data = json.loads(output)
        uptime_seconds = data.get("uptime", None)
        if uptime_seconds is not None:
            uptime_days = round(uptime_seconds / 86400)  # ממיר לימים
            return uptime_days
    except Exception as e:
        print(f"❌ Failed to get uptime for {interface}:", e)
    return -1
def measure_interface_traffic(ssh_client, interface, max_speed_mbps=1000):
    real_iface = INTERFACE_MAP.get(interface.lower(), interface)

    def read_bytes():
        output = run_ssh_command(ssh_client, "cat /proc/net/dev")
        for line in output.splitlines():
            if real_iface in line:
                parts = line.split()
                if ":" in parts[0]:
                    parts = parts[1:]
                rx = int(parts[0])
                tx = int(parts[8])
                return rx + tx
        return 0

    try:
        b1 = read_bytes()
        time.sleep(1)
        b2 = read_bytes()
        delta_bytes = b2 - b1
        mbps = (delta_bytes * 8) / 1_000_000
        load = min((mbps / max_speed_mbps) * 100, 100.0)
        return round(mbps, 2), round(load, 2)
    except Exception as e:
        print("❌ Failed to measure traffic:", e)
        return -1, -1

