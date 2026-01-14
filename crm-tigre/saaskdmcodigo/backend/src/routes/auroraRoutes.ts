import express from "express";
import * as AuroraController from "../controllers/AuroraController";
import isAuth from "../middleware/isAuth";

const auroraRoutes = express.Router();

auroraRoutes.get("/aurora/analysis/:ticketId", isAuth, AuroraController.getAnalysis);
auroraRoutes.get("/aurora/resumo/:ticketId", isAuth, AuroraController.getResumo);
auroraRoutes.post(
  "/aurora/converter/:ticketId",
  isAuth,
  AuroraController.converterAgendamento
);
auroraRoutes.get("/aurora/dashboard", isAuth, AuroraController.getDashboard);

export default auroraRoutes;
