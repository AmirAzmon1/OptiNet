from flask import Flask, jsonify, request
from flask_cors import CORS
import random
from datetime import datetime, timedelta
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Store families in memory instead of file
FAMILIES = []

def generate_random_neighbor():
    # Generate random values within realistic ranges
    return {
        "name": f"Router-{random.randint(1, 100)}",
        "ip_address": f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}",
        "latency": round(random.uniform(1, 100), 2),  # ms
        "speed": random.randint(10, 1000),  # Mbps
        "load": round(random.uniform(0, 100), 2),  # percentage
        "status": random.choice(["active", "inactive", "maintenance"]),
        "packet_loss": round(random.uniform(0, 5), 2),  # percentage
        "uptime": random.randint(1, 365),  # days
        "last_checked": (datetime.now() - timedelta(minutes=random.randint(1, 60))).isoformat(),
        "rating": round(random.uniform(1, 5), 1),  # 1-5 stars
        "is_current_route": random.choice([True, False]),
        "avg_response_time": round(random.uniform(10, 200), 2)  # ms
    }

@app.route('/api/neighbors', methods=['GET'])
def get_neighbors():
    # Generate 3 random neighbors
    neighbors = [generate_random_neighbor() for _ in range(3)]
    return jsonify(neighbors)

@app.route('/api/families', methods=['GET'])
def get_families():
    try:
        # Return families from memory
        return jsonify(FAMILIES)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/families', methods=['POST'])
def save_families():
    try:
        # Update the global FAMILIES variable
        global FAMILIES
        FAMILIES = request.json
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/families/<family_id>', methods=['DELETE'])
def delete_family(family_id):
    try:
        # Filter out the family with the given ID
        global FAMILIES
        FAMILIES = [family for family in FAMILIES if family.get('id') != family_id]
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)