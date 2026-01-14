import AppError from "../../errors/AppError";
import Agendamento, { AgendamentoStatus } from "../../models/Agendamento";
import ShowAgendamentoService from "./ShowAgendamentoService";

const ConfirmarAgendamentoService = async (
  agendamentoId: string,
  companyId: number
): Promise<Agendamento> => {
  const agendamento = await ShowAgendamentoService(agendamentoId, companyId);

  if (agendamento.status !== AgendamentoStatus.AGENDADO) {
    throw new AppError("ERR_AGENDAMENTO_NAO_PODE_SER_CONFIRMADO", 400);
  }

  await agendamento.update({
    status: AgendamentoStatus.CONFIRMADO
  });

  await agendamento.reload({
    include: ["paciente", "procedimento", "profissional"]
  });

  return agendamento;
};

export default ConfirmarAgendamentoService;
