import { Op } from "sequelize";
import { addDays, startOfDay, endOfDay, format, differenceInMinutes } from "date-fns";
import Campaign from "../models/Campaign";
import CampaignShipping from "../models/CampaignShipping";
import CampaignAnalytics from "../models/CampaignAnalytics";
import Message from "../models/Message";

interface AnalyticsResult {
  campaignId: number;
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalReplied: number;
  totalConfirmed: number;
  conversionRate: number;
  avgResponseTime: number | null;
  variantResults?: {
    A: VariantMetrics;
    B: VariantMetrics;
  };
}

interface VariantMetrics {
  sent: number;
  delivered: number;
  replied: number;
  confirmed: number;
  conversionRate: number;
  avgResponseTime: number | null;
}

class CampaignAnalyticsService {
  /**
   * Calcula métricas completas de uma campanha
   */
  async calculateCampaignMetrics(campaignId: number): Promise<AnalyticsResult> {
    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      throw new Error("Campanha não encontrada");
    }

    const shippings = await CampaignShipping.findAll({
      where: { campaignId }
    });

    const totalSent = shippings.length;
    const totalDelivered = shippings.filter(s => s.deliveredAt).length;
    const totalReplied = shippings.filter(s => s.replied).length;
    const totalConfirmed = shippings.filter(s => s.confirmation === true).length;

    // Taxa de conversão (confirmações / total)
    const conversionRate = totalSent > 0
      ? parseFloat(((totalConfirmed / totalSent) * 100).toFixed(2))
      : 0;

    // Tempo médio de resposta
    const repliedShippings = shippings.filter(s => s.repliedAt);
    const avgResponseTime = repliedShippings.length > 0
      ? Math.round(
          repliedShippings.reduce((sum, s) => {
            const responseTime = differenceInMinutes(
              new Date(s.repliedAt),
              new Date(s.createdAt)
            );
            return sum + responseTime;
          }, 0) / repliedShippings.length
        )
      : null;

    const result: AnalyticsResult = {
      campaignId,
      totalSent,
      totalDelivered,
      totalRead: 0, // TODO: Implementar tracking de leitura via ACK
      totalReplied,
      totalConfirmed,
      conversionRate,
      avgResponseTime
    };

    // Se for A/B test, calcula métricas por variante
    if (campaign.isABTest) {
      result.variantResults = {
        A: this.calculateVariantMetrics(shippings, "A"),
        B: this.calculateVariantMetrics(shippings, "B")
      };
    }

    // Atualiza campos da campanha
    await campaign.update({
      totalDelivered,
      totalReplied,
      totalConfirmed,
      conversionRate,
      avgResponseTime
    });

    return result;
  }

  /**
   * Calcula métricas de uma variante específica (A ou B)
   */
  private calculateVariantMetrics(
    allShippings: CampaignShipping[],
    variant: string
  ): VariantMetrics {
    const variantShippings = allShippings.filter(s => s.variant === variant);

    const sent = variantShippings.length;
    const delivered = variantShippings.filter(s => s.deliveredAt).length;
    const replied = variantShippings.filter(s => s.replied).length;
    const confirmed = variantShippings.filter(s => s.confirmation === true).length;

    const conversionRate = sent > 0
      ? parseFloat(((confirmed / sent) * 100).toFixed(2))
      : 0;

    const repliedVariant = variantShippings.filter(s => s.repliedAt);
    const avgResponseTime = repliedVariant.length > 0
      ? Math.round(
          repliedVariant.reduce((sum, s) => {
            const responseTime = differenceInMinutes(
              new Date(s.repliedAt),
              new Date(s.createdAt)
            );
            return sum + responseTime;
          }, 0) / repliedVariant.length
        )
      : null;

    return {
      sent,
      delivered,
      replied,
      confirmed,
      conversionRate,
      avgResponseTime
    };
  }

  /**
   * Salva analytics diários no banco
   */
  async saveDailyAnalytics(campaignId: number, date: string): Promise<void> {
    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) return;

    const startDate = startOfDay(new Date(date));
    const endDate = endOfDay(new Date(date));

    const shippings = await CampaignShipping.findAll({
      where: {
        campaignId,
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    const totalSent = shippings.length;
    const totalDelivered = shippings.filter(s => s.deliveredAt).length;
    const totalReplied = shippings.filter(s => s.replied).length;
    const totalConfirmed = shippings.filter(s => s.confirmation === true).length;

    const conversionRate = totalSent > 0
      ? parseFloat(((totalConfirmed / totalSent) * 100).toFixed(2))
      : 0;

    const repliedShippings = shippings.filter(s => s.repliedAt);
    const avgResponseTime = repliedShippings.length > 0
      ? Math.round(
          repliedShippings.reduce((sum, s) => {
            const responseTime = differenceInMinutes(
              new Date(s.repliedAt),
              new Date(s.createdAt)
            );
            return sum + responseTime;
          }, 0) / repliedShippings.length
        )
      : null;

    await CampaignAnalytics.upsert({
      campaignId,
      date,
      totalSent,
      totalDelivered,
      totalRead: 0,
      totalReplied,
      totalConfirmed,
      conversionRate,
      avgResponseTime,
      companyId: campaign.companyId
    });
  }

  /**
   * Obtém histórico de analytics de uma campanha
   */
  async getCampaignHistory(campaignId: number): Promise<CampaignAnalytics[]> {
    return await CampaignAnalytics.findAll({
      where: { campaignId },
      order: [["date", "ASC"]]
    });
  }

  /**
   * Determina variante vencedora em A/B test (significância estatística)
   */
  determineWinner(variantA: VariantMetrics, variantB: VariantMetrics): {
    winner: "A" | "B" | "INCONCLUSIVE";
    pValue: number;
    significant: boolean;
  } {
    // Teste de significância estatística (Z-test para proporções)
    const p1 = variantA.confirmed / variantA.sent;
    const p2 = variantB.confirmed / variantB.sent;

    const n1 = variantA.sent;
    const n2 = variantB.sent;

    // Proporção combinada
    const pCombined = (variantA.confirmed + variantB.confirmed) / (n1 + n2);

    // Erro padrão
    const se = Math.sqrt(pCombined * (1 - pCombined) * (1/n1 + 1/n2));

    // Z-score
    const z = (p1 - p2) / se;

    // P-value (aproximação usando distribuição normal)
    const pValue = 2 * (1 - this.normalCDF(Math.abs(z)));

    // Significativo se p-value < 0.05
    const significant = pValue < 0.05;

    let winner: "A" | "B" | "INCONCLUSIVE" = "INCONCLUSIVE";
    if (significant) {
      winner = p1 > p2 ? "A" : "B";
    }

    return {
      winner,
      pValue: parseFloat(pValue.toFixed(4)),
      significant
    };
  }

  /**
   * CDF da distribuição normal padrão (aproximação)
   */
  private normalCDF(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
  }

  /**
   * Marca resposta de cliente (atualiza replied/repliedAt)
   */
  async markAsReplied(shippingId: number): Promise<void> {
    const shipping = await CampaignShipping.findByPk(shippingId);
    if (!shipping || shipping.replied) return;

    const repliedAt = new Date();
    const responseTime = differenceInMinutes(repliedAt, shipping.createdAt);

    await shipping.update({
      replied: true,
      repliedAt,
      responseTime
    });

    // Atualiza analytics da campanha
    await this.calculateCampaignMetrics(shipping.campaignId);
  }
}

export default new CampaignAnalyticsService();
