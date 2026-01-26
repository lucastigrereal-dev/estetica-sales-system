import { Request, Response } from "express";
import CampaignAnalyticsService from "../services/CampaignAnalyticsService";
import Campaign from "../models/Campaign";
import CampaignShipping from "../models/CampaignShipping";

class CampaignAnalyticsController {
  /**
   * GET /campaigns/:id/analytics
   * Obtém métricas completas de uma campanha
   */
  async show(req: Request, res: Response): Promise<Response> {
    const { id: campaignId } = req.params;
    const { companyId } = req.user;

    try {
      const campaign = await Campaign.findOne({
        where: { id: campaignId, companyId }
      });

      if (!campaign) {
        return res.status(404).json({ error: "Campanha não encontrada" });
      }

      const analytics = await CampaignAnalyticsService.calculateCampaignMetrics(
        Number(campaignId)
      );

      return res.json(analytics);
    } catch (error) {
      console.error("Erro ao buscar analytics:", error);
      return res.status(500).json({ error: "Erro ao buscar analytics" });
    }
  }

  /**
   * GET /campaigns/:id/analytics/history
   * Obtém histórico diário de analytics
   */
  async history(req: Request, res: Response): Promise<Response> {
    const { id: campaignId } = req.params;
    const { companyId } = req.user;

    try {
      const campaign = await Campaign.findOne({
        where: { id: campaignId, companyId }
      });

      if (!campaign) {
        return res.status(404).json({ error: "Campanha não encontrada" });
      }

      const history = await CampaignAnalyticsService.getCampaignHistory(
        Number(campaignId)
      );

      return res.json(history);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      return res.status(500).json({ error: "Erro ao buscar histórico" });
    }
  }

  /**
   * GET /campaigns/:id/abtest-results
   * Retorna resultados de A/B test com análise estatística
   */
  async abTestResults(req: Request, res: Response): Promise<Response> {
    const { id: campaignId } = req.params;
    const { companyId } = req.user;

    try {
      const campaign = await Campaign.findOne({
        where: { id: campaignId, companyId }
      });

      if (!campaign) {
        return res.status(404).json({ error: "Campanha não encontrada" });
      }

      if (!campaign.isABTest) {
        return res.status(400).json({
          error: "Esta campanha não é um teste A/B"
        });
      }

      const analytics = await CampaignAnalyticsService.calculateCampaignMetrics(
        Number(campaignId)
      );

      if (!analytics.variantResults) {
        return res.status(404).json({ error: "Resultados de A/B não disponíveis" });
      }

      // Análise estatística
      const { variantResults } = analytics;
      const statisticalAnalysis = CampaignAnalyticsService.determineWinner(
        variantResults.A,
        variantResults.B
      );

      return res.json({
        campaign: {
          id: campaign.id,
          name: campaign.name,
          abVariantA: campaign.abVariantA,
          abVariantB: campaign.abVariantB
        },
        results: {
          variantA: variantResults.A,
          variantB: variantResults.B
        },
        analysis: statisticalAnalysis,
        recommendation: this.getRecommendation(statisticalAnalysis, variantResults)
      });
    } catch (error) {
      console.error("Erro ao buscar resultados A/B:", error);
      return res.status(500).json({ error: "Erro ao buscar resultados" });
    }
  }

  /**
   * POST /campaigns/:id/refresh-analytics
   * Recalcula analytics de uma campanha
   */
  async refresh(req: Request, res: Response): Promise<Response> {
    const { id: campaignId } = req.params;
    const { companyId } = req.user;

    try {
      const campaign = await Campaign.findOne({
        where: { id: campaignId, companyId }
      });

      if (!campaign) {
        return res.status(404).json({ error: "Campanha não encontrada" });
      }

      const analytics = await CampaignAnalyticsService.calculateCampaignMetrics(
        Number(campaignId)
      );

      return res.json({
        message: "Analytics recalculados com sucesso",
        analytics
      });
    } catch (error) {
      console.error("Erro ao recalcular analytics:", error);
      return res.status(500).json({ error: "Erro ao recalcular analytics" });
    }
  }

  /**
   * GET /campaigns/:id/conversion-funnel
   * Retorna funil de conversão detalhado
   */
  async conversionFunnel(req: Request, res: Response): Promise<Response> {
    const { id: campaignId } = req.params;
    const { companyId } = req.user;

    try {
      const campaign = await Campaign.findOne({
        where: { id: campaignId, companyId }
      });

      if (!campaign) {
        return res.status(404).json({ error: "Campanha não encontrada" });
      }

      const shippings = await CampaignShipping.findAll({
        where: { campaignId }
      });

      const funnel = {
        totalContacts: shippings.length,
        sent: shippings.length,
        delivered: shippings.filter(s => s.deliveredAt).length,
        replied: shippings.filter(s => s.replied).length,
        confirmed: shippings.filter(s => s.confirmation === true).length
      };

      const rates = {
        deliveryRate: funnel.sent > 0
          ? parseFloat(((funnel.delivered / funnel.sent) * 100).toFixed(2))
          : 0,
        replyRate: funnel.delivered > 0
          ? parseFloat(((funnel.replied / funnel.delivered) * 100).toFixed(2))
          : 0,
        confirmationRate: funnel.replied > 0
          ? parseFloat(((funnel.confirmed / funnel.replied) * 100).toFixed(2))
          : 0,
        overallConversion: funnel.sent > 0
          ? parseFloat(((funnel.confirmed / funnel.sent) * 100).toFixed(2))
          : 0
      };

      return res.json({
        campaignId: campaign.id,
        campaignName: campaign.name,
        funnel,
        rates,
        dropOffPoints: this.calculateDropOff(funnel)
      });
    } catch (error) {
      console.error("Erro ao buscar funil:", error);
      return res.status(500).json({ error: "Erro ao buscar funil de conversão" });
    }
  }

  /**
   * Gera recomendação baseada em resultados A/B
   */
  private getRecommendation(
    analysis: any,
    results: any
  ): string {
    if (!analysis.significant) {
      return "Os resultados ainda não são estatisticamente significativos. " +
        "Recomendamos continuar o teste com mais contatos antes de tomar uma decisão.";
    }

    const winner = analysis.winner;
    const winnerMetrics = results[`variant${winner}`];

    return `A variante ${winner} é a vencedora com ${winnerMetrics.conversionRate}% de conversão ` +
      `(p-value: ${analysis.pValue}). Recomendamos usar esta mensagem em futuras campanhas.`;
  }

  /**
   * Calcula pontos de drop-off no funil
   */
  private calculateDropOff(funnel: any): any[] {
    const dropOff = [];

    const deliveryDropOff = funnel.sent - funnel.delivered;
    if (deliveryDropOff > 0) {
      dropOff.push({
        stage: "Entrega",
        lost: deliveryDropOff,
        percentage: parseFloat(((deliveryDropOff / funnel.sent) * 100).toFixed(2))
      });
    }

    const replyDropOff = funnel.delivered - funnel.replied;
    if (replyDropOff > 0) {
      dropOff.push({
        stage: "Resposta",
        lost: replyDropOff,
        percentage: parseFloat(((replyDropOff / funnel.delivered) * 100).toFixed(2))
      });
    }

    const confirmDropOff = funnel.replied - funnel.confirmed;
    if (confirmDropOff > 0) {
      dropOff.push({
        stage: "Confirmação",
        lost: confirmDropOff,
        percentage: parseFloat(((confirmDropOff / funnel.replied) * 100).toFixed(2))
      });
    }

    return dropOff;
  }
}

export default new CampaignAnalyticsController();
