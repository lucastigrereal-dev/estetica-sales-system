"""
Lead Scoring Service - Sistema de pontuação e qualificação de leads
"""
from typing import Dict, Tuple
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..models import Lead


class LeadScoringService:
    """
    Serviço para calcular score de leads baseado em engajamento e fit
    """

    # Pesos para cada critério
    WEIGHTS = {
        # Engajamento
        "replied_to_campaign": 20,
        "opened_message_base": 5,       # 5 pontos por mensagem aberta
        "opened_message_max": 30,        # Máximo 30 pontos (6 mensagens)

        # Interesse
        "requested_appointment": 40,
        "status_interessado": 15,
        "status_agendado": 25,
        "status_contatado": 10,

        # Timing (recency)
        "created_last_7_days": 10,
        "created_last_30_days": 5,

        # Dados completos
        "has_email": 5,
        "has_interesse": 5,
    }

    # Thresholds para temperatura
    TEMPERATURE_THRESHOLDS = {
        "hot": 70,      # >= 70 pontos
        "warm": 40,     # >= 40 pontos
        "cold": 0       # < 40 pontos
    }

    def calculate_score(self, lead: Lead) -> Tuple[int, str]:
        """
        Calcula score e temperatura de um lead

        Returns:
            Tuple[int, str]: (score, temperature)
        """
        score = 0

        # 1. ENGAJAMENTO
        if lead.replied_to_campaign:
            score += self.WEIGHTS["replied_to_campaign"]

        # Pontuação por mensagens abertas (max 30)
        if lead.opened_messages:
            opened_score = min(
                lead.opened_messages * self.WEIGHTS["opened_message_base"],
                self.WEIGHTS["opened_message_max"]
            )
            score += opened_score

        # 2. INTERESSE
        if lead.requested_appointment:
            score += self.WEIGHTS["requested_appointment"]

        if lead.status == "interessado":
            score += self.WEIGHTS["status_interessado"]
        elif lead.status == "agendado":
            score += self.WEIGHTS["status_agendado"]
        elif lead.status == "contatado":
            score += self.WEIGHTS["status_contatado"]

        # 3. TIMING (Recency)
        days_since_created = (datetime.utcnow() - lead.created_at).days
        if days_since_created <= 7:
            score += self.WEIGHTS["created_last_7_days"]
        elif days_since_created <= 30:
            score += self.WEIGHTS["created_last_30_days"]

        # 4. DADOS COMPLETOS
        if lead.email:
            score += self.WEIGHTS["has_email"]
        if lead.interesse:
            score += self.WEIGHTS["has_interesse"]

        # Garantir score entre 0-100
        score = max(0, min(100, score))

        # Determinar temperatura
        temperature = self._calculate_temperature(score)

        return score, temperature

    def _calculate_temperature(self, score: int) -> str:
        """Determina temperatura baseado no score"""
        if score >= self.TEMPERATURE_THRESHOLDS["hot"]:
            return "hot"
        elif score >= self.TEMPERATURE_THRESHOLDS["warm"]:
            return "warm"
        else:
            return "cold"

    def update_lead_score(self, lead: Lead, db: Session) -> Lead:
        """
        Atualiza score de um lead e salva no banco
        """
        score, temperature = self.calculate_score(lead)

        lead.score = score
        lead.temperature = temperature
        lead.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(lead)

        return lead

    def bulk_recalculate_scores(
        self,
        db: Session,
        status_filter: str = None,
        limit: int = None
    ) -> Dict[str, int]:
        """
        Recalcula scores de múltiplos leads

        Returns:
            Dict com estatísticas de atualização
        """
        query = db.query(Lead)

        if status_filter:
            query = query.filter(Lead.status == status_filter)

        if limit:
            query = query.limit(limit)

        leads = query.all()

        stats = {
            "total": len(leads),
            "hot": 0,
            "warm": 0,
            "cold": 0
        }

        for lead in leads:
            score, temperature = self.calculate_score(lead)
            lead.score = score
            lead.temperature = temperature
            lead.updated_at = datetime.utcnow()

            stats[temperature] += 1

        db.commit()

        return stats

    def get_scoring_breakdown(self, lead: Lead) -> Dict[str, any]:
        """
        Retorna breakdown detalhado de como o score foi calculado
        """
        breakdown = {
            "total_score": 0,
            "components": []
        }

        # Engajamento
        if lead.replied_to_campaign:
            breakdown["components"].append({
                "category": "Engajamento",
                "criterion": "Respondeu campanha",
                "points": self.WEIGHTS["replied_to_campaign"]
            })
            breakdown["total_score"] += self.WEIGHTS["replied_to_campaign"]

        if lead.opened_messages:
            opened_score = min(
                lead.opened_messages * self.WEIGHTS["opened_message_base"],
                self.WEIGHTS["opened_message_max"]
            )
            breakdown["components"].append({
                "category": "Engajamento",
                "criterion": f"Abriu {lead.opened_messages} mensagens",
                "points": opened_score
            })
            breakdown["total_score"] += opened_score

        # Interesse
        if lead.requested_appointment:
            breakdown["components"].append({
                "category": "Interesse",
                "criterion": "Solicitou agendamento",
                "points": self.WEIGHTS["requested_appointment"]
            })
            breakdown["total_score"] += self.WEIGHTS["requested_appointment"]

        if lead.status in ["interessado", "agendado", "contatado"]:
            points = self.WEIGHTS.get(f"status_{lead.status}", 0)
            breakdown["components"].append({
                "category": "Interesse",
                "criterion": f"Status: {lead.status}",
                "points": points
            })
            breakdown["total_score"] += points

        # Timing
        days_since_created = (datetime.utcnow() - lead.created_at).days
        if days_since_created <= 7:
            breakdown["components"].append({
                "category": "Recência",
                "criterion": "Criado nos últimos 7 dias",
                "points": self.WEIGHTS["created_last_7_days"]
            })
            breakdown["total_score"] += self.WEIGHTS["created_last_7_days"]
        elif days_since_created <= 30:
            breakdown["components"].append({
                "category": "Recência",
                "criterion": "Criado nos últimos 30 dias",
                "points": self.WEIGHTS["created_last_30_days"]
            })
            breakdown["total_score"] += self.WEIGHTS["created_last_30_days"]

        # Dados
        if lead.email:
            breakdown["components"].append({
                "category": "Dados Completos",
                "criterion": "Possui email",
                "points": self.WEIGHTS["has_email"]
            })
            breakdown["total_score"] += self.WEIGHTS["has_email"]

        if lead.interesse:
            breakdown["components"].append({
                "category": "Dados Completos",
                "criterion": "Possui interesse definido",
                "points": self.WEIGHTS["has_interesse"]
            })
            breakdown["total_score"] += self.WEIGHTS["has_interesse"]

        breakdown["temperature"] = self._calculate_temperature(breakdown["total_score"])

        return breakdown

    def get_hot_leads(
        self,
        db: Session,
        limit: int = 50
    ) -> list:
        """Retorna leads quentes (score >= 70)"""
        return db.query(Lead).filter(
            Lead.temperature == "hot"
        ).order_by(
            Lead.score.desc()
        ).limit(limit).all()

    def get_leads_by_temperature(
        self,
        db: Session,
        temperature: str,
        limit: int = 50
    ) -> list:
        """Retorna leads por temperatura"""
        return db.query(Lead).filter(
            Lead.temperature == temperature
        ).order_by(
            Lead.score.desc()
        ).limit(limit).all()


# Instância singleton
lead_scoring_service = LeadScoringService()
