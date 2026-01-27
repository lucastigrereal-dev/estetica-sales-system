#!/bin/bash

# Login
echo "=== Testing Login ==="
RESPONSE=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crmtigre.com","password":"admin123"}')

echo "$RESPONSE" | head -5

# Extract token (simplified)
TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "ERROR: No token received"
  exit 1
fi

echo ""
echo "Token received: ${TOKEN:0:50}..."
echo ""

# Test protected endpoint
echo "=== Testing /users endpoint ==="
curl -s http://localhost:3001/users -H "Authorization: Bearer $TOKEN" | head -20

echo ""
echo ""
echo "=== Testing /procedimentos endpoint ==="
curl -s http://localhost:3001/procedimentos -H "Authorization: Bearer $TOKEN"
