import express from "express";
import isAuth from "../middleware/isAuth";

import * as AgendamentoController from "../controllers/AgendamentoController";

const agendamentoRoutes = express.Router();

agendamentoRoutes.get("/agendamentos", isAuth, AgendamentoController.index);

agendamentoRoutes.get(
  "/agendamentos/slots-disponiveis",
  isAuth,
  AgendamentoController.slotsDisponiveis
);

agendamentoRoutes.get(
  "/agendamentos/:agendamentoId",
  isAuth,
  AgendamentoController.show
);

agendamentoRoutes.post("/agendamentos", isAuth, AgendamentoController.store);

agendamentoRoutes.put(
  "/agendamentos/:agendamentoId",
  isAuth,
  AgendamentoController.update
);

agendamentoRoutes.post(
  "/agendamentos/:agendamentoId/confirmar",
  isAuth,
  AgendamentoController.confirmar
);

agendamentoRoutes.post(
  "/agendamentos/:agendamentoId/cancelar",
  isAuth,
  AgendamentoController.cancelar
);

agendamentoRoutes.post(
  "/agendamentos/:agendamentoId/marcar-realizado",
  isAuth,
  AgendamentoController.marcarRealizado
);

agendamentoRoutes.post(
  "/agendamentos/:agendamentoId/marcar-no-show",
  isAuth,
  AgendamentoController.marcarNoShow
);

export default agendamentoRoutes;
