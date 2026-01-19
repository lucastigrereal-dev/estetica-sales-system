import { Router } from "express";
import * as LembreteController from "../controllers/LembreteController";
import isAuth from "../middleware/isAuth";

const lembreteRoutes = Router();

/**
 * LEMBRETE ROUTES
 * Endpoints para gerenciar lembretes automáticos e NPS
 */

// Dashboard de lembretes
lembreteRoutes.get("/dashboard", isAuth, LembreteController.dashboard);

// Estatísticas gerais
lembreteRoutes.get("/stats", isAuth, LembreteController.stats);

// Status de um lembrete específico
lembreteRoutes.get("/status/:id", isAuth, LembreteController.statusLembrete);

// Reenviar lembrete falhado
lembreteRoutes.post("/reenviar/:id", isAuth, LembreteController.reenviarLembrete);

// Resultado NPS
lembreteRoutes.get("/nps/resultado", isAuth, LembreteController.resultadoNps);

export default lembreteRoutes;
