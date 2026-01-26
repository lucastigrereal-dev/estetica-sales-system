import { Op, WhereOptions } from "sequelize";
import Segment, { SegmentRule } from "../models/Segment";
import Contact from "../models/Contact";
import ContactListItem from "../models/ContactListItem";

class SegmentService {
  /**
   * Constrói query dinâmica baseada nas regras do segmento
   */
  buildQuery(rules: SegmentRule[], companyId: number): WhereOptions {
    const whereConditions: any = {
      companyId
    };

    for (const rule of rules) {
      const condition = this.ruleToSequelizeCondition(rule);
      if (condition) {
        whereConditions[rule.field] = condition;
      }
    }

    return whereConditions;
  }

  /**
   * Converte regra individual em condição Sequelize
   */
  private ruleToSequelizeCondition(rule: SegmentRule): any {
    const { operator, value } = rule;

    switch (operator) {
      case "=":
      case "equals":
        return { [Op.eq]: value };

      case "!=":
      case "not_equals":
        return { [Op.ne]: value };

      case ">":
      case "greater_than":
        return { [Op.gt]: value };

      case ">=":
      case "greater_or_equal":
        return { [Op.gte]: value };

      case "<":
      case "less_than":
        return { [Op.lt]: value };

      case "<=":
      case "less_or_equal":
        return { [Op.lte]: value };

      case "contains":
      case "like":
        return { [Op.like]: `%${value}%` };

      case "not_contains":
      case "not_like":
        return { [Op.notLike]: `%${value}%` };

      case "starts_with":
        return { [Op.like]: `${value}%` };

      case "ends_with":
        return { [Op.like]: `%${value}` };

      case "in":
        return { [Op.in]: Array.isArray(value) ? value : [value] };

      case "not_in":
        return { [Op.notIn]: Array.isArray(value) ? value : [value] };

      case "between":
        if (Array.isArray(value) && value.length === 2) {
          return { [Op.between]: value };
        }
        return null;

      case "is_null":
        return { [Op.is]: null };

      case "is_not_null":
        return { [Op.not]: null };

      default:
        console.warn(`Operador desconhecido: ${operator}`);
        return null;
    }
  }

  /**
   * Calcula contatos que fazem parte do segmento
   */
  async calculateSegmentContacts(segmentId: number): Promise<Contact[]> {
    const segment = await Segment.findByPk(segmentId);
    if (!segment) {
      throw new Error("Segmento não encontrado");
    }

    const whereConditions = this.buildQuery(segment.rules, segment.companyId);

    const contacts = await Contact.findAll({
      where: whereConditions
    });

    // Atualiza cache de contagem
    await segment.update({
      contactCount: contacts.length,
      lastCalculated: new Date()
    });

    return contacts;
  }

  /**
   * Obtém apenas IDs dos contatos (mais rápido para campanhas)
   */
  async getSegmentContactIds(segmentId: number): Promise<number[]> {
    const contacts = await this.calculateSegmentContacts(segmentId);
    return contacts.map(c => c.id);
  }

  /**
   * Preview de contatos sem salvar
   */
  async previewSegment(
    rules: SegmentRule[],
    companyId: number,
    limit: number = 50
  ): Promise<{ contacts: Contact[]; total: number }> {
    const whereConditions = this.buildQuery(rules, companyId);

    const { count, rows } = await Contact.findAndCountAll({
      where: whereConditions,
      limit
    });

    return {
      contacts: rows,
      total: count
    };
  }

  /**
   * Valida regras do segmento
   */
  validateRules(rules: SegmentRule[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!Array.isArray(rules) || rules.length === 0) {
      errors.push("Segmento deve ter pelo menos uma regra");
      return { valid: false, errors };
    }

    const validOperators = [
      "=", "!=", ">", ">=", "<", "<=",
      "equals", "not_equals",
      "greater_than", "greater_or_equal",
      "less_than", "less_or_equal",
      "contains", "not_contains",
      "like", "not_like",
      "starts_with", "ends_with",
      "in", "not_in", "between",
      "is_null", "is_not_null"
    ];

    const validFields = [
      "name", "number", "email", "isWhatsappValid",
      "isGroup", "createdAt", "updatedAt"
    ];

    rules.forEach((rule, index) => {
      if (!rule.field) {
        errors.push(`Regra ${index + 1}: campo é obrigatório`);
      } else if (!validFields.includes(rule.field)) {
        errors.push(`Regra ${index + 1}: campo "${rule.field}" não é válido`);
      }

      if (!rule.operator) {
        errors.push(`Regra ${index + 1}: operador é obrigatório`);
      } else if (!validOperators.includes(rule.operator)) {
        errors.push(`Regra ${index + 1}: operador "${rule.operator}" não é válido`);
      }

      if (rule.value === undefined && !["is_null", "is_not_null"].includes(rule.operator)) {
        errors.push(`Regra ${index + 1}: valor é obrigatório`);
      }

      if (rule.operator === "between" && (!Array.isArray(rule.value) || rule.value.length !== 2)) {
        errors.push(`Regra ${index + 1}: operador "between" requer array com 2 valores`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Cria segmento pré-definido comum
   */
  async createPresetSegment(
    preset: string,
    companyId: number
  ): Promise<Segment> {
    const presets: { [key: string]: { name: string; description: string; rules: SegmentRule[] } } = {
      whatsapp_validos: {
        name: "WhatsApp Válidos",
        description: "Contatos com WhatsApp verificado",
        rules: [
          { field: "isWhatsappValid", operator: "=", value: true }
        ]
      },
      nao_grupos: {
        name: "Contatos Individuais",
        description: "Apenas contatos individuais (não grupos)",
        rules: [
          { field: "isGroup", operator: "=", value: false }
        ]
      },
      recentes: {
        name: "Contatos Recentes",
        description: "Contatos adicionados nos últimos 30 dias",
        rules: [
          {
            field: "createdAt",
            operator: ">=",
            value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      com_email: {
        name: "Contatos com Email",
        description: "Contatos que possuem email cadastrado",
        rules: [
          { field: "email", operator: "is_not_null", value: null }
        ]
      }
    };

    const presetData = presets[preset];
    if (!presetData) {
      throw new Error(`Preset "${preset}" não encontrado`);
    }

    return await Segment.create({
      ...presetData,
      companyId,
      isActive: true
    });
  }
}

export default new SegmentService();
