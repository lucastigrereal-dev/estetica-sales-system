import AppError from "../../errors/AppError";
import Agendamento, { AgendamentoStatus } from "../../models/Agendamento";
import ShowAgendamentoService from "./ShowAgendamentoService";

interface Request {
  agendamentoId: string;
  companyId: number;
  motivoCancelamento?: string;
}

const CancelarAgendamentoService = async ({
  agendamentoId,
  companyId,
  motivoCancelamento
}: Request): Promise<Agendamento> => {
  const agendamento = await ShowAgendamentoService(agendamentoId, companyId);

  if (
    agendamento.status === AgendamentoStatus.REALIZADO ||
    agendamento.status === AgendamentoStatus.CANCELADO
  ) {
    throw new AppError("ERR_AGENDAMENTO_NAO_PODE_SER_CANCELADO", 400);
  }

  await agendamento.update({
    status: AgendamentoStatus.CANCELADO,
    motivoCancelamento
  });

  await agendamento.reload({
    include: ["paciente", "procedimento", "profissional"]
  });

  return agendamento;
};

export default CancelarAgendamentoService;
