#!/bin/sh
echo "window.env = { BACKEND_DIR: '${BACKEND_DIR}' };" > /usr/share/nginx/html/env.js
exec "$@"
