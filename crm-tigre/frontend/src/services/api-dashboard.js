import api from "./api";

// ==========================================
// Dashboard Executivo
// ==========================================

export const getDashboardResumoHoje = async (clinicaId) => {
  const { data } = await api.get("/dashboard/executivo/resumo-hoje", {
    headers: { "X-Clinica-Id": clinicaId }
  });
  return data;
};

export const getDashboardMetricas = async (clinicaId, periodo = 30) => {
  const { data } = await api.get(`/dashboard/executivo/metricas?periodo=${periodo}`, {
    headers: { "X-Clinica-Id": clinicaId }
  });
  return data;
};

export const getDashboardConversao = async (clinicaId, periodo = 30) => {
  const { data } = await api.get(`/dashboard/executivo/conversao?periodo=${periodo}`, {
    headers: { "X-Clinica-Id": clinicaId }
  });
  return data;
};

export const getDashboardTopProcedimentos = async (clinicaId, periodo = 30, limit = 5) => {
  const { data } = await api.get(
    `/dashboard/executivo/top-procedimentos?periodo=${periodo}&limit=${limit}`,
    { headers: { "X-Clinica-Id": clinicaId } }
  );
  return data;
};

export const getDashboardTopPacientes = async (clinicaId, periodo = 30, limit = 10) => {
  const { data } = await api.get(
    `/dashboard/executivo/top-pacientes?periodo=${periodo}&limit=${limit}`,
    { headers: { "X-Clinica-Id": clinicaId } }
  );
  return data;
};

export const getDashboardComparativo = async (clinicaId, periodo = 30) => {
  const { data } = await api.get(`/dashboard/executivo/comparativo?periodo=${periodo}`, {
    headers: { "X-Clinica-Id": clinicaId }
  });
  return data;
};

// ==========================================
// Relatórios
// ==========================================

export const gerarRelatorioMensalPDF = async (clinicaId, mes, ano) => {
  const response = await api.get(`/relatorios/mensal/pdf?mes=${mes}&ano=${ano}`, {
    headers: { "X-Clinica-Id": clinicaId },
    responseType: "blob"
  });

  // Criar link de download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `relatorio_${ano}_${String(mes).padStart(2, "0")}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const exportarAgendamentosExcel = async (clinicaId, filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  const response = await api.get(`/relatorios/agendamentos/excel?${params}`, {
    headers: { "X-Clinica-Id": clinicaId },
    responseType: "blob"
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `agendamentos_${new Date().toISOString().split("T")[0]}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const exportarPacientesExcel = async (clinicaId, filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  const response = await api.get(`/relatorios/pacientes/excel?${params}`, {
    headers: { "X-Clinica-Id": clinicaId },
    responseType: "blob"
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `pacientes_${new Date().toISOString().split("T")[0]}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const exportarFinanceiroExcel = async (clinicaId, filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  const response = await api.get(`/relatorios/financeiro/excel?${params}`, {
    headers: { "X-Clinica-Id": clinicaId },
    responseType: "blob"
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `financeiro_${new Date().toISOString().split("T")[0]}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
