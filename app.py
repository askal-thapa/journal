"""
Flask backend for the Learning Journal PWA.

It does two jobs:
  1. Serves the front-end (HTML, CSS, JS, icons, manifest, service worker).
  2. Exposes a small JSON API for reading and saving reflections, which are
     stored in backend/reflections.json.

Run locally:      python app.py   ->  http://localhost:8000
On PythonAnywhere: the WSGI file imports `app` from this module (see README).
"""

import json
import os
from datetime import datetime

from flask import Flask, request, jsonify, send_from_directory

# Absolute path to this project so file access works no matter what the current
# working directory is (important on PythonAnywhere, where CWD is not the app).
ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(ROOT, "backend", "reflections.json")

# static_url_path="" lets Flask serve /css/style.css, /js/script.js, /sw.js, etc.
# straight from the project root, so all the existing relative links keep working.
app = Flask(__name__, static_folder=ROOT, static_url_path="")


def read_reflections():
    """Return the list of reflections, or an empty list if the file is missing/bad."""
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return []


def write_reflections(items):
    """Save the whole reflections list back to disk as pretty JSON."""
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)


@app.route("/")
def home():
    return send_from_directory(ROOT, "index.html")


@app.route("/api/reflections", methods=["GET"])
def get_reflections():
    """Frontend fetches this to display all saved reflections."""
    return jsonify(read_reflections())


@app.route("/api/reflections", methods=["POST"])
def add_reflection():
    """Add one reflection sent from the form (or synced from offline storage)."""
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    if not text:
        return jsonify({"status": "error", "message": "Reflection text is required"}), 400

    entry = {
        "date": data.get("date") or datetime.now().isoformat(),
        "text": text,
        "category": data.get("category") or "General",
        "id": data.get("id") or int(datetime.now().timestamp() * 1000),
    }

    items = read_reflections()
    items.append(entry)
    write_reflections(items)

    return jsonify({"status": "success", "message": "Reflection saved", "entry": entry}), 201


@app.route("/sw.js")
def service_worker():
    # Serve the service worker from the site root with no-cache so a new version
    # is picked up on the next visit instead of being stuck in the HTTP cache.
    response = send_from_directory(ROOT, "sw.js")
    response.headers["Cache-Control"] = "no-cache"
    response.headers["Service-Worker-Allowed"] = "/"
    return response


@app.route("/manifest.json")
def manifest():
    response = send_from_directory(ROOT, "manifest.json")
    response.headers["Content-Type"] = "application/manifest+json"
    return response


if __name__ == "__main__":
    # 0.0.0.0 so you can also open it from a phone on the same Wi-Fi to test install.
    app.run(host="0.0.0.0", port=8000, debug=True)
