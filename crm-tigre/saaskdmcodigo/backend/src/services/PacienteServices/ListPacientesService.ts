import { Sequelize, Op } from "sequelize";
import Paciente from "../../models/Paciente";
import Contact from "../../models/Contact";

interface Request {
  searchParam?: string;
  pageNumber?: string;
  status?: string;
  classificacao?: string;
  companyId: number;
}

interface Response {
  pacientes: Paciente[];
  count: number;
  hasMore: boolean;
}

const ListPacientesService = async ({
  searchParam = "",
  pageNumber = "1",
  status,
  classificacao,
  companyId
}: Request): Promise<Response> => {
  const whereCondition: any = {
    companyId: {
      [Op.eq]: companyId
    }
  };

  if (searchParam) {
    whereCondition[Op.or] = [
      {
        nome: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("Paciente.nome")),
          "LIKE",
          `%${searchParam.toLowerCase().trim()}%`
        )
      },
      { telefone: { [Op.like]: `%${searchParam.toLowerCase().trim()}%` } },
      { email: { [Op.like]: `%${searchParam.toLowerCase().trim()}%` } },
      { cpf: { [Op.like]: `%${searchParam.toLowerCase().trim()}%` } }
    ];
  }

  if (status) {
    whereCondition.status = status;
  }

  if (classificacao) {
    whereCondition.classificacao = classificacao;
  }

  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  const { count, rows: pacientes } = await Paciente.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    include: [
      {
        model: Contact,
        as: "visitor",
        attributes: ["id", "name", "number", "profilePicUrl"]
      }
    ],
    order: [["nome", "ASC"]]
  });

  const hasMore = count > offset + pacientes.length;

  return {
    pacientes,
    count,
    hasMore
  };
};

export default ListPacientesService;
