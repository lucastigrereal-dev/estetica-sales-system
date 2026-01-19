import { Router } from "express";
import * as AuroraController from "../controllers/AuroraController";
import isAuth from "../middleware/isAuth";

const auroraRoutes = Router();

/**
 * AURORA IA ROUTES
 * Endpoints para integração com Aurora IA
 */

// Health Check - Sem autenticação
auroraRoutes.get("/health", AuroraController.health);

// Processar mensagem com Aurora
auroraRoutes.post("/processar-mensagem", isAuth, AuroraController.processarMensagem);

// Qualificar lead
auroraRoutes.get("/qualificar/:ticketId", isAuth, AuroraController.qualificarLeadEndpoint);

// Testar Aurora (debugging)
auroraRoutes.post("/testar", isAuth, AuroraController.testarAurora);

// Estatísticas
auroraRoutes.get("/stats", isAuth, AuroraController.getStats);

export default auroraRoutes;
