import AppError from "../../errors/AppError";
import Agendamento, { AgendamentoStatus } from "../../models/Agendamento";
import ShowAgendamentoService from "./ShowAgendamentoService";

const MarcarNoShowService = async (
  agendamentoId: string,
  companyId: number
): Promise<Agendamento> => {
  const agendamento = await ShowAgendamentoService(agendamentoId, companyId);

  if (
    agendamento.status === AgendamentoStatus.REALIZADO ||
    agendamento.status === AgendamentoStatus.CANCELADO
  ) {
    throw new AppError("ERR_AGENDAMENTO_NAO_PODE_SER_MARCADO_NO_SHOW", 400);
  }

  await agendamento.update({
    status: AgendamentoStatus.NO_SHOW
  });

  await agendamento.reload({
    include: ["paciente", "procedimento", "profissional"]
  });

  return agendamento;
};

export default MarcarNoShowService;
