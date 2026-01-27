#!/usr/bin/env python3
"""
Teste da API de autenticação
"""

import requests
import json

BASE_URL = "http://localhost:8000"

print("="*60)
print("TESTANDO API - ESTETICA SALES SYSTEM")
print("="*60)

# 1. Test Health
print("\n1. Testando /health...")
response = requests.get(f"{BASE_URL}/health")
print(f"   Status: {response.status_code}")
print(f"   Response: {response.json()}")

# 2. Test Root
print("\n2. Testando / (root)...")
response = requests.get(f"{BASE_URL}/")
print(f"   Status: {response.status_code}")
print(f"   Response: {response.json()}")

# 3. Test Login (JSON)
print("\n3. Testando /api/auth/login/json...")
login_data = {
    "email": "admin@clinica.com",
    "password": "admin123"
}
response = requests.post(
    f"{BASE_URL}/api/auth/login/json",
    json=login_data
)
print(f"   Status: {response.status_code}")
print(f"   Response: {response.json()}")

if response.status_code == 200:
    token_data = response.json()
    access_token = token_data["access_token"]
    print(f"\n   TOKEN OBTIDO COM SUCESSO!")
    print(f"   Token: {access_token[:50]}...")

    # 4. Test /auth/me
    print("\n4. Testando /api/auth/me (com token)...")
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")

    print("\n" + "="*60)
    print("LOGIN FUNCIONANDO! SISTEMA PRONTO!")
    print("="*60)
else:
    print("\n   ERRO NO LOGIN!")
    print("="*60)
