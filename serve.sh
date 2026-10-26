#!/bin/bash
cd "$(dirname "$0")"
PORT=8080

if lsof -ti:"$PORT" >/dev/null 2>&1; then
  echo "Server already running at http://localhost:$PORT"
else
  echo "Starting server at http://localhost:$PORT"
  python3 serve.py "$PORT" &
  sleep 1
fi

open "http://localhost:$PORT/" 2>/dev/null || echo "Open http://localhost:$PORT/ in your browser"
