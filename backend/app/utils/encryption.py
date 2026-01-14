"""
Serviço de Criptografia para Credenciais de Pagamento

Utiliza Fernet (symmetric encryption) da biblioteca cryptography
para criptografar/descriptografar credenciais sensíveis armazenadas no banco.
"""

from cryptography.fernet import Fernet
import os
from typing import Optional


class EncryptionService:
    """
    Serviço de criptografia singleton para credenciais de pagamento.

    Requer a variável de ambiente PAYMENT_ENCRYPTION_KEY.
    Gere uma chave com: Fernet.generate_key().decode()
    """

    def __init__(self):
        key = os.getenv("PAYMENT_ENCRYPTION_KEY")
        if not key:
            raise ValueError(
                "PAYMENT_ENCRYPTION_KEY não está configurada. "
                "Gere uma chave com: from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
            )

        try:
            self.cipher = Fernet(key.encode())
        except Exception as e:
            raise ValueError(f"Chave de criptografia inválida: {str(e)}")

    def encrypt(self, value: Optional[str]) -> str:
        """
        Criptografa uma string.

        Args:
            value: String a ser criptografada (pode ser None)

        Returns:
            String criptografada (vazia se value for None/empty)
        """
        if not value:
            return ""

        try:
            return self.cipher.encrypt(value.encode()).decode()
        except Exception as e:
            raise ValueError(f"Erro ao criptografar: {str(e)}")

    def decrypt(self, encrypted_value: Optional[str]) -> str:
        """
        Descriptografa uma string.

        Args:
            encrypted_value: String criptografada (pode ser None)

        Returns:
            String original (vazia se encrypted_value for None/empty)
        """
        if not encrypted_value:
            return ""

        try:
            return self.cipher.decrypt(encrypted_value.encode()).decode()
        except Exception as e:
            raise ValueError(f"Erro ao descriptografar (chave inválida ou dado corrompido): {str(e)}")


# Singleton instance
# Será inicializado na primeira importação
try:
    encryption_service = EncryptionService()
except ValueError as e:
    # Em desenvolvimento/testes, podemos continuar sem encryption
    # mas logamos o aviso
    print(f"AVISO: {str(e)}")
    encryption_service = None
