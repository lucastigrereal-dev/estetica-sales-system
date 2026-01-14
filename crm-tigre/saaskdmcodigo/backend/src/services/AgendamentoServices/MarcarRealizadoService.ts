import AppError from "../../errors/AppError";
import Agendamento, { AgendamentoStatus, PagamentoStatus } from "../../models/Agendamento";
import ShowAgendamentoService from "./ShowAgendamentoService";

interface Request {
  agendamentoId: string;
  companyId: number;
  pagamentoStatus?: PagamentoStatus;
  metodoPagamento?: string;
}

const MarcarRealizadoService = async ({
  agendamentoId,
  companyId,
  pagamentoStatus,
  metodoPagamento
}: Request): Promise<Agendamento> => {
  const agendamento = await ShowAgendamentoService(agendamentoId, companyId);

  if (agendamento.status === AgendamentoStatus.CANCELADO) {
    throw new AppError("ERR_AGENDAMENTO_CANCELADO", 400);
  }

  const updateData: any = {
    status: AgendamentoStatus.REALIZADO
  };

  if (pagamentoStatus) {
    updateData.pagamentoStatus = pagamentoStatus;
  }

  if (metodoPagamento) {
    updateData.metodoPagamento = metodoPagamento;
  }

  await agendamento.update(updateData);

  await agendamento.reload({
    include: ["paciente", "procedimento", "profissional"]
  });

  return agendamento;
};

export default MarcarRealizadoService;
