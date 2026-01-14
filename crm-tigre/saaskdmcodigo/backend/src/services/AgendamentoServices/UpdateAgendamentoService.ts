import AppError from "../../errors/AppError";
import Agendamento from "../../models/Agendamento";
import ShowAgendamentoService from "./ShowAgendamentoService";

interface Request {
  agendamentoData: {
    dataAgendamento?: Date;
    horaInicio?: string;
    profissionalId?: number;
    notas?: string;
    desconto?: number;
    metodoPagamento?: string;
  };
  agendamentoId: string;
  companyId: number;
}

const UpdateAgendamentoService = async ({
  agendamentoData,
  agendamentoId,
  companyId
}: Request): Promise<Agendamento> => {
  const agendamento = await ShowAgendamentoService(agendamentoId, companyId);

  // Se houver desconto, recalcular preço final
  if (agendamentoData.desconto !== undefined) {
    const novoDesconto = agendamentoData.desconto;
    const novoPrecoFinal = agendamento.preco - novoDesconto;
    await agendamento.update({
      ...agendamentoData,
      precoFinal: novoPrecoFinal
    });
  } else {
    await agendamento.update(agendamentoData);
  }

  await agendamento.reload({
    include: ["paciente", "procedimento", "profissional"]
  });

  return agendamento;
};

export default UpdateAgendamentoService;
