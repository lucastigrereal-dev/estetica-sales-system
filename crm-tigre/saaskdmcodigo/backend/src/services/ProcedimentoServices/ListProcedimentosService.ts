import { Sequelize, Op } from "sequelize";
import Procedimento from "../../models/Procedimento";

interface Request {
  searchParam?: string;
  pageNumber?: string;
  companyId: number;
  ativo?: boolean;
  categoria?: string;
}

interface Response {
  procedimentos: Procedimento[];
  count: number;
  hasMore: boolean;
}

const ListProcedimentosService = async ({
  searchParam = "",
  pageNumber = "1",
  companyId,
  ativo,
  categoria
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
          Sequelize.fn("LOWER", Sequelize.col("nome")),
          "LIKE",
          `%${searchParam.toLowerCase().trim()}%`
        )
      },
      {
        descricao: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("descricao")),
          "LIKE",
          `%${searchParam.toLowerCase().trim()}%`
        )
      }
    ];
  }

  if (ativo !== undefined) {
    whereCondition.ativo = ativo;
  }

  if (categoria) {
    whereCondition.categoria = categoria;
  }

  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  const { count, rows: procedimentos } = await Procedimento.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["nome", "ASC"]]
  });

  const hasMore = count > offset + procedimentos.length;

  return {
    procedimentos,
    count,
    hasMore
  };
};

export default ListProcedimentosService;
