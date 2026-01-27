import AppError from "../../errors/AppError";
import Agendamento, { AgendamentoStatus, PagamentoStatus } from "../../models/Agendamento";
import Procedimento from "../../models/Procedimento";
import { Op } from "sequelize";

interface Request {
  companyId: number;
  pacienteId: number;
  procedimentoId: number;
  profissionalId?: number;
  dataAgendamento: Date;
  horaInicio: string;
  preco?: number;
  desconto?: number;
  metodoPagamento?: string;
  notas?: string;
}

const CreateAgendamentoService = async ({
  companyId,
  pacienteId,
  procedimentoId,
  profissionalId,
  dataAgendamento,
  horaInicio,
  preco,
  desconto = 0,
  metodoPagamento,
  notas
}: Request): Promise<Agendamento> => {
  // Buscar procedimento
  const procedimento = await Procedimento.findOne({
    where: { id: procedimentoId, companyId }
  });

  if (!procedimento) {
    throw new AppError("ERR_PROCEDIMENTO_NOT_FOUND", 404);
  }

  // Calcular hora fim baseado na duração
  const [horaInicioNum, minutoInicioNum] = horaInicio.split(":").map(Number);
  const duracaoMinutos = procedimento.duracaoMinutos;
  const dataHoraInicio = new Date();
  dataHoraInicio.setHours(horaInicioNum, minutoInicioNum);
  const dataHoraFim = new Date(dataHoraInicio.getTime() + duracaoMinutos * 60000);
  const horaFim = `${String(dataHoraFim.getHours()).padStart(2, "0")}:${String(
    dataHoraFim.getMinutes()
  ).padStart(2, "0")}`;

  // Verificar conflitos de horário
  const conflito = await Agendamento.findOne({
    where: {
      companyId,
      dataAgendamento,
      status: {
        [Op.notIn]: [AgendamentoStatus.CANCELADO, AgendamentoStatus.NO_SHOW]
      },
      [Op.or]: [
        {
          horaInicio: {
            [Op.between]: [horaInicio as any, horaFim as any]
          }
        },
        {
          horaFim: {
            [Op.between]: [horaInicio as any, horaFim as any]
          }
        },
        {
          [Op.and]: [
            {
              horaInicio: {
                [Op.lte]: horaInicio as any
              }
            },
            {
              horaFim: {
                [Op.gte]: horaFim as any
              }
            }
          ]
        }
      ]
    }
  });

  if (conflito) {
    throw new AppError("ERR_AGENDAMENTO_CONFLITO_HORARIO", 400);
  }

  // Calcular preço final
  const precoFinal = preco || procedimento.precoPromocional || procedimento.precoPadrao;
  const precoComDesconto = precoFinal - desconto;

  const agendamento = await Agendamento.create({
    companyId,
    pacienteId,
    procedimentoId,
    profissionalId,
    dataAgendamento,
    horaInicio,
    horaFim,
    duracaoMinutos,
    preco: precoFinal,
    desconto,
    precoFinal: precoComDesconto,
    status: AgendamentoStatus.AGENDADO,
    pagamentoStatus: PagamentoStatus.PENDENTE,
    metodoPagamento,
    notas
  });

  await agendamento.reload({
    include: ["paciente", "procedimento", "profissional"]
  });

  return agendamento;
};

export default CreateAgendamentoService;
