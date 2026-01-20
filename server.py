#!/usr/bin/env python3
"""Serveur HTTP simple pour Bible Chantée - Port 8888"""
import http.server
import socketserver
import os
import sys

PORT = 8888
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

if __name__ == '__main__':
    os.chdir(DIRECTORY)

    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print("=" * 70)
        print(f"  SERVEUR BIBLE CHANTEE")
        print("=" * 70)
        print(f"Port: {PORT}")
        print(f"Dossier: {DIRECTORY}")
        print(f"\nOuvrez votre navigateur:")
        print(f"  http://localhost:{PORT}/lecteur.html")
        print(f"\nCtrl+C pour arreter")
        print("=" * 70)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServeur arrete.")
            sys.exit(0)
