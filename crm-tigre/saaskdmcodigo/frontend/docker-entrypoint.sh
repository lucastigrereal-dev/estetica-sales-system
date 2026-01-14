#!/bin/sh
set -e

# Replace environment variables in JavaScript files
# This allows runtime configuration without rebuilding the image
if [ -d "/usr/share/nginx/html" ]; then
  echo "Replacing environment variables in built files..."

  # Find all .js files and replace placeholders
  find /usr/share/nginx/html -type f -name "*.js" | while read file; do
    if [ -n "$REACT_APP_BACKEND_URL" ]; then
      sed -i "s|REACT_APP_BACKEND_URL_PLACEHOLDER|$REACT_APP_BACKEND_URL|g" "$file" || true
    fi
    if [ -n "$REACT_APP_STRIPE_KEY" ]; then
      sed -i "s|REACT_APP_STRIPE_KEY_PLACEHOLDER|$REACT_APP_STRIPE_KEY|g" "$file" || true
    fi
  done

  echo "Environment variables replaced successfully!"
fi

# Execute the main command
exec "$@"
