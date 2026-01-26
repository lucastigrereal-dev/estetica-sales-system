import { Request, Response } from "express";
import Segment from "../models/Segment";
import SegmentService from "../services/SegmentService";

class SegmentController {
  /**
   * GET /segments
   * Lista todos os segmentos da empresa
   */
  async index(req: Request, res: Response): Promise<Response> {
    const { companyId } = req.user;

    try {
      const segments = await Segment.findAll({
        where: { companyId },
        order: [["name", "ASC"]]
      });

      return res.json(segments);
    } catch (error) {
      console.error("Erro ao listar segmentos:", error);
      return res.status(500).json({ error: "Erro ao listar segmentos" });
    }
  }

  /**
   * GET /segments/:id
   * Obtém detalhes de um segmento
   */
  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { companyId } = req.user;

    try {
      const segment = await Segment.findOne({
        where: { id, companyId }
      });

      if (!segment) {
        return res.status(404).json({ error: "Segmento não encontrado" });
      }

      return res.json(segment);
    } catch (error) {
      console.error("Erro ao buscar segmento:", error);
      return res.status(500).json({ error: "Erro ao buscar segmento" });
    }
  }

  /**
   * POST /segments
   * Cria novo segmento
   */
  async store(req: Request, res: Response): Promise<Response> {
    const { companyId } = req.user;
    const { name, description, rules, isActive } = req.body;

    try {
      // Valida regras
      const validation = SegmentService.validateRules(rules);
      if (!validation.valid) {
        return res.status(400).json({
          error: "Regras inválidas",
          details: validation.errors
        });
      }

      // Cria segmento
      const segment = await Segment.create({
        name,
        description,
        rules,
        isActive: isActive !== undefined ? isActive : true,
        companyId
      });

      // Calcula contatos iniciais
      await SegmentService.calculateSegmentContacts(segment.id);

      // Recarrega com contagem atualizada
      await segment.reload();

      return res.status(201).json(segment);
    } catch (error) {
      console.error("Erro ao criar segmento:", error);
      return res.status(500).json({ error: "Erro ao criar segmento" });
    }
  }

  /**
   * PUT /segments/:id
   * Atualiza segmento
   */
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { companyId } = req.user;
    const { name, description, rules, isActive } = req.body;

    try {
      const segment = await Segment.findOne({
        where: { id, companyId }
      });

      if (!segment) {
        return res.status(404).json({ error: "Segmento não encontrado" });
      }

      // Se regras mudaram, valida
      if (rules) {
        const validation = SegmentService.validateRules(rules);
        if (!validation.valid) {
          return res.status(400).json({
            error: "Regras inválidas",
            details: validation.errors
          });
        }
      }

      // Atualiza
      await segment.update({
        name: name || segment.name,
        description: description !== undefined ? description : segment.description,
        rules: rules || segment.rules,
        isActive: isActive !== undefined ? isActive : segment.isActive
      });

      // Se regras mudaram, recalcula
      if (rules) {
        await SegmentService.calculateSegmentContacts(segment.id);
        await segment.reload();
      }

      return res.json(segment);
    } catch (error) {
      console.error("Erro ao atualizar segmento:", error);
      return res.status(500).json({ error: "Erro ao atualizar segmento" });
    }
  }

  /**
   * DELETE /segments/:id
   * Deleta segmento
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { companyId } = req.user;

    try {
      const segment = await Segment.findOne({
        where: { id, companyId }
      });

      if (!segment) {
        return res.status(404).json({ error: "Segmento não encontrado" });
      }

      await segment.destroy();

      return res.json({ message: "Segmento deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar segmento:", error);
      return res.status(500).json({ error: "Erro ao deletar segmento" });
    }
  }

  /**
   * POST /segments/preview
   * Preview de contatos antes de criar segmento
   */
  async preview(req: Request, res: Response): Promise<Response> {
    const { companyId } = req.user;
    const { rules, limit } = req.body;

    try {
      // Valida regras
      const validation = SegmentService.validateRules(rules);
      if (!validation.valid) {
        return res.status(400).json({
          error: "Regras inválidas",
          details: validation.errors
        });
      }

      // Preview
      const result = await SegmentService.previewSegment(
        rules,
        companyId,
        limit || 50
      );

      return res.json(result);
    } catch (error) {
      console.error("Erro no preview:", error);
      return res.status(500).json({ error: "Erro ao gerar preview" });
    }
  }

  /**
   * GET /segments/:id/contacts
   * Lista contatos do segmento
   */
  async getContacts(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { companyId } = req.user;

    try {
      const segment = await Segment.findOne({
        where: { id, companyId }
      });

      if (!segment) {
        return res.status(404).json({ error: "Segmento não encontrado" });
      }

      const contacts = await SegmentService.calculateSegmentContacts(
        Number(id)
      );

      return res.json({
        segmentId: segment.id,
        segmentName: segment.name,
        total: contacts.length,
        contacts
      });
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
      return res.status(500).json({ error: "Erro ao buscar contatos" });
    }
  }

  /**
   * POST /segments/:id/refresh
   * Recalcula contatos do segmento
   */
  async refresh(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { companyId } = req.user;

    try {
      const segment = await Segment.findOne({
        where: { id, companyId }
      });

      if (!segment) {
        return res.status(404).json({ error: "Segmento não encontrado" });
      }

      await SegmentService.calculateSegmentContacts(Number(id));
      await segment.reload();

      return res.json({
        message: "Segmento recalculado com sucesso",
        contactCount: segment.contactCount,
        lastCalculated: segment.lastCalculated
      });
    } catch (error) {
      console.error("Erro ao recalcular segmento:", error);
      return res.status(500).json({ error: "Erro ao recalcular segmento" });
    }
  }

  /**
   * POST /segments/preset/:presetName
   * Cria segmento a partir de preset
   */
  async createPreset(req: Request, res: Response): Promise<Response> {
    const { presetName } = req.params;
    const { companyId } = req.user;

    try {
      const segment = await SegmentService.createPresetSegment(
        presetName,
        companyId
      );

      await SegmentService.calculateSegmentContacts(segment.id);
      await segment.reload();

      return res.status(201).json(segment);
    } catch (error) {
      console.error("Erro ao criar preset:", error);
      return res.status(500).json({ error: error.message || "Erro ao criar preset" });
    }
  }
}

export default new SegmentController();
