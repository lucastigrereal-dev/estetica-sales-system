import { Op } from "sequelize";
import Agendamento, { AgendamentoStatus } from "../../models/Agendamento";
import Procedimento from "../../models/Procedimento";
import AppError from "../../errors/AppError";

interface Request {
  companyId: number;
  procedimentoId: number;
  dataAgendamento: Date;
  profissionalId?: number;
  horaAbertura?: string;
  horaFechamento?: string;
  intervaloMinutos?: number;
}

interface Slot {
  horaInicio: string;
  horaFim: string;
  disponivel: boolean;
}

const GetSlotsDisponiveisService = async ({
  companyId,
  procedimentoId,
  dataAgendamento,
  profissionalId,
  horaAbertura = "08:00",
  horaFechamento = "18:00",
  intervaloMinutos = 30
}: Request): Promise<Slot[]> => {
  // Buscar procedimento para pegar duração
  const procedimento = await Procedimento.findOne({
    where: { id: procedimentoId, companyId }
  });

  if (!procedimento) {
    throw new AppError("ERR_PROCEDIMENTO_NOT_FOUND", 404);
  }

  const duracaoMinutos = procedimento.duracaoMinutos;

  // Buscar agendamentos existentes para a data
  const whereCondition: any = {
    companyId,
    dataAgendamento,
    status: {
      [Op.notIn]: [AgendamentoStatus.CANCELADO, AgendamentoStatus.NO_SHOW]
    }
  };

  if (profissionalId) {
    whereCondition.profissionalId = profissionalId;
  }

  const agendamentosExistentes = await Agendamento.findAll({
    where: whereCondition,
    attributes: ["horaInicio", "horaFim"]
  });

  // Gerar slots
  const slots: Slot[] = [];
  const [horaAperturaNum, minutoAberturaNum] = horaAbertura.split(":").map(Number);
  const [horaFechamentoNum, minutoFechamentoNum] = horaFechamento
    .split(":")
    .map(Number);

  let horaAtual = horaAperturaNum * 60 + minutoAberturaNum; // em minutos
  const horaFechamentoMinutos = horaFechamentoNum * 60 + minutoFechamentoNum;

  while (horaAtual + duracaoMinutos <= horaFechamentoMinutos) {
    const hora = Math.floor(horaAtual / 60);
    const minuto = horaAtual % 60;
    const horaInicio = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(
      2,
      "0"
    )}`;

    const horaFimMinutos = horaAtual + duracaoMinutos;
    const horaFimHora = Math.floor(horaFimMinutos / 60);
    const horaFimMinuto = horaFimMinutos % 60;
    const horaFim = `${String(horaFimHora).padStart(2, "0")}:${String(
      horaFimMinuto
    ).padStart(2, "0")}`;

    // Verificar se há conflito
    const temConflito = agendamentosExistentes.some(agendamento => {
      return (
        (horaInicio >= agendamento.horaInicio && horaInicio < agendamento.horaFim) ||
        (horaFim > agendamento.horaInicio && horaFim <= agendamento.horaFim) ||
        (horaInicio <= agendamento.horaInicio && horaFim >= agendamento.horaFim)
      );
    });

    slots.push({
      horaInicio,
      horaFim,
      disponivel: !temConflito
    });

    horaAtual += intervaloMinutos;
  }

  return slots;
};

export default GetSlotsDisponiveisService;
