import { Sequelize, Op } from "sequelize";
import Agendamento, { AgendamentoStatus } from "../../models/Agendamento";
import Contact from "../../models/Contact";
import Procedimento from "../../models/Procedimento";
import User from "../../models/User";

interface Request {
  searchParam?: string;
  pageNumber?: string;
  companyId: number;
  status?: AgendamentoStatus;
  dataInicio?: Date;
  dataFim?: Date;
  profissionalId?: number;
}

interface Response {
  agendamentos: Agendamento[];
  count: number;
  hasMore: boolean;
}

const ListAgendamentosService = async ({
  searchParam = "",
  pageNumber = "1",
  companyId,
  status,
  dataInicio,
  dataFim,
  profissionalId
}: Request): Promise<Response> => {
  const whereCondition: any = {
    companyId: {
      [Op.eq]: companyId
    }
  };

  if (status) {
    whereCondition.status = status;
  }

  if (dataInicio && dataFim) {
    whereCondition.dataAgendamento = {
      [Op.between]: [dataInicio, dataFim]
    };
  } else if (dataInicio) {
    whereCondition.dataAgendamento = {
      [Op.gte]: dataInicio
    };
  } else if (dataFim) {
    whereCondition.dataAgendamento = {
      [Op.lte]: dataFim
    };
  }

  if (profissionalId) {
    whereCondition.profissionalId = profissionalId;
  }

  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  const { count, rows: agendamentos } = await Agendamento.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: Contact,
        as: "paciente",
        attributes: ["id", "name", "number"]
      },
      {
        model: Procedimento,
        as: "procedimento",
        attributes: ["id", "nome", "duracaoMinutos"]
      },
      {
        model: User,
        as: "profissional",
        attributes: ["id", "name"]
      }
    ],
    limit,
    offset,
    order: [
      ["dataAgendamento", "DESC"],
      ["horaInicio", "DESC"]
    ]
  });

  const hasMore = count > offset + agendamentos.length;

  return {
    agendamentos,
    count,
    hasMore
  };
};

export default ListAgendamentosService;
