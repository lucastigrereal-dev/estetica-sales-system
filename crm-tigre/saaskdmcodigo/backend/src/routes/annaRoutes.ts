import express from "express";
import * as AnnaController from "../controllers/AnnaController";
import isAuth from "../middleware/isAuth";

const annaRoutes = express.Router();

annaRoutes.get("/anna/analysis/:ticketId", isAuth, AnnaController.getAnalysis);
annaRoutes.get("/anna/resumo/:ticketId", isAuth, AnnaController.getResumo);
annaRoutes.post(
  "/anna/converter/:ticketId",
  isAuth,
  AnnaController.converterAgendamento
);
annaRoutes.get("/anna/dashboard", isAuth, AnnaController.getDashboard);

export default annaRoutes;
