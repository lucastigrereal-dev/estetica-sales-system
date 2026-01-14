import express from "express";
import isAuth from "../middleware/isAuth";

import * as PacienteController from "../controllers/PacienteController";
import * as ProcedimentoController from "../controllers/ProcedimentoController";
import * as AgendamentoController from "../controllers/AgendamentoController";
import * as PagamentoController from "../controllers/PagamentoController";
import * as DashboardController from "../controllers/DashboardController";

const crmTigreRoutes = express.Router();

// ==================== PACIENTES ====================
crmTigreRoutes.get("/pacientes", isAuth, PacienteController.index);
crmTigreRoutes.get("/pacientes/:id", isAuth, PacienteController.show);
crmTigreRoutes.post("/pacientes", isAuth, PacienteController.store);
crmTigreRoutes.put("/pacientes/:id", isAuth, PacienteController.update);
crmTigreRoutes.delete("/pacientes/:id", isAuth, PacienteController.remove);
crmTigreRoutes.post("/pacientes/convert/:contactId", isAuth, PacienteController.convertFromContact);

// ==================== PROCEDIMENTOS ====================
crmTigreRoutes.get("/procedimentos", isAuth, ProcedimentoController.index);
crmTigreRoutes.get("/procedimentos/:id", isAuth, ProcedimentoController.show);
crmTigreRoutes.post("/procedimentos", isAuth, ProcedimentoController.store);
crmTigreRoutes.put("/procedimentos/:id", isAuth, ProcedimentoController.update);
crmTigreRoutes.delete("/procedimentos/:id", isAuth, ProcedimentoController.remove);

// ==================== AGENDAMENTOS ====================
crmTigreRoutes.get("/agendamentos", isAuth, AgendamentoController.index);
crmTigreRoutes.get("/agendamentos/slots", isAuth, AgendamentoController.slotsDisponiveis);
crmTigreRoutes.get("/agendamentos/:id", isAuth, AgendamentoController.show);
crmTigreRoutes.post("/agendamentos", isAuth, AgendamentoController.store);
crmTigreRoutes.put("/agendamentos/:id", isAuth, AgendamentoController.update);
crmTigreRoutes.delete("/agendamentos/:id", isAuth, AgendamentoController.remove);
crmTigreRoutes.post("/agendamentos/:id/confirmar", isAuth, AgendamentoController.confirmar);
crmTigreRoutes.post("/agendamentos/:id/cancelar", isAuth, AgendamentoController.cancelar);
crmTigreRoutes.post("/agendamentos/:id/realizado", isAuth, AgendamentoController.marcarRealizado);
crmTigreRoutes.post("/agendamentos/:id/noshow", isAuth, AgendamentoController.marcarNoShow);

// ==================== PAGAMENTOS ====================
crmTigreRoutes.get("/pagamentos", isAuth, PagamentoController.index);
crmTigreRoutes.get("/pagamentos/resumo", isAuth, PagamentoController.resumoFinanceiro);
crmTigreRoutes.get("/pagamentos/:id", isAuth, PagamentoController.show);
crmTigreRoutes.post("/pagamentos", isAuth, PagamentoController.store);
crmTigreRoutes.post("/pagamentos/link", isAuth, PagamentoController.gerarLinkPagamento);
crmTigreRoutes.post("/pagamentos/pix", isAuth, PagamentoController.gerarPix);
crmTigreRoutes.post("/pagamentos/webhook/stripe", PagamentoController.webhookStripe);

// ==================== DASHBOARD ====================
crmTigreRoutes.get("/dashboard/resumo", isAuth, DashboardController.resumoHoje);
crmTigreRoutes.get("/dashboard/metricas", isAuth, DashboardController.metricas);
crmTigreRoutes.get("/dashboard/conversao", isAuth, DashboardController.conversao);
crmTigreRoutes.get("/dashboard/top-procedimentos", isAuth, DashboardController.topProcedimentos);
crmTigreRoutes.get("/dashboard/top-pacientes", isAuth, DashboardController.topPacientes);
crmTigreRoutes.get("/dashboard/proximos", isAuth, DashboardController.proximosAgendamentos);

export default crmTigreRoutes;
