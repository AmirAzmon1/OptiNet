from flask import Flask, jsonify, request
from flask_cors import CORS
import random
from datetime import datetime, timedelta
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def generate_random_neighbor():
    # Generate random values within realistic ranges
    return {
        "name": f"Router-{random.randint(1, 100)}",
        "ip": f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}",
        "interface": random.choice(["eth0", "wlan0", "ppp0"]),
        "latency": round(random.uniform(1, 100), 2),  # ms
        "traffic": random.randint(1000, 1000000),  # bytes
        "score": round(random.uniform(0, 1), 2),  # 0-1 score
        "active_clients": random.randint(1, 50)  # number of active clients
    }

def generate_random_client():
    return {
        "ip": f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}",
        "assigned_to": f"Router-{random.randint(1, 5)}",
        "state": random.choice(["connected", "disconnected", "pending"])
    }

@app.route("/api/test")
def test():
    return jsonify({"msg": "everything works!"})

@app.route("/api/neighbors", methods=["GET"])
def get_neighbors():
    # Generate 3-5 random neighbors
    neighbors = [generate_random_neighbor() for _ in range(random.randint(3, 5))]
    return jsonify(neighbors)

@app.route("/api/clients", methods=["GET"])
def get_clients():
    # Generate 5-10 random clients
    clients = [generate_random_client() for _ in range(random.randint(5, 10))]
    return jsonify(clients)

@app.route("/api/assignments", methods=["GET"])
def get_assignments():
    # Generate random assignments
    assignments = {}
    for _ in range(random.randint(5, 10)):
        ip = f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}"
        assignments[ip] = f"Router-{random.randint(1, 5)}"
    return jsonify(assignments)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)