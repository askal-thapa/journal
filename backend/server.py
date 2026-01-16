#!/usr/bin/env python3
import http.server
import socketserver
import json
import os
from datetime import datetime

PORT = 8000
DATA_FILE = os.path.join(os.path.dirname(__file__), 'reflections.json')

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        print(f"Received POST request: {self.path}")
        # Normalize path by removing trailing slash/query params for simple matching
        clean_path = self.path.split('?')[0].rstrip('/')
        
        if clean_path == '/api/reflections':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                new_entry = json.loads(post_data.decode('utf-8'))
                
                # Add server-side timestamp if not present
                if 'date' not in new_entry:
                    new_entry['date'] = datetime.now().isoformat()
                if 'id' not in new_entry:
                    new_entry['id'] = int(datetime.now().timestamp() * 1000)
                
                # Load existing data
                data = []
                if os.path.exists(DATA_FILE):
                    try:
                        with open(DATA_FILE, 'r', encoding='utf-8') as f:
                            data = json.load(f)
                    except json.JSONDecodeError:
                        data = []
                
                # Append new entry
                data.append(new_entry)
                
                # Save back to file
                with open(DATA_FILE, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                
                # Send response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {"status": "success", "message": "Reflection saved successfully"}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                print("Reflection saved successfully.")
                
            except Exception as e:
                print(f"Error saving reflection: {e}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {"status": "error", "message": str(e)}
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            print(f"404: Endpoint not found for {self.path}")
            self.send_error(404, "Endpoint not found")

    def end_headers(self):
        # Add CORS headers for local development if needed
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

print(f"Serving at http://localhost:{PORT}")
print(f"API Endpoint: http://localhost:{PORT}/api/reflections")

# Ensure we are serving from the project root, not backend/
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(project_root)

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
