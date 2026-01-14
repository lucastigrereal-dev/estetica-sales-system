import Agendamento from "../../models/Agendamento";
import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import Procedimento from "../../models/Procedimento";
import User from "../../models/User";

const ShowAgendamentoService = async (
  id: string | number,
  companyId: number
): Promise<Agendamento> => {
  const agendamento = await Agendamento.findByPk(id, {
    include: [
      {
        model: Contact,
        as: "paciente",
        attributes: ["id", "name", "number", "email"]
      },
      {
        model: Procedimento,
        as: "procedimento",
        attributes: ["id", "nome", "duracaoMinutos", "precoPadrao"]
      },
      {
        model: User,
        as: "profissional",
        attributes: ["id", "name", "email"]
      }
    ]
  });

  if (agendamento?.companyId !== companyId) {
    throw new AppError("Não é possível acessar registro de outra empresa");
  }

  if (!agendamento) {
    throw new AppError("ERR_NO_AGENDAMENTO_FOUND", 404);
  }

  return agendamento;
};

export default ShowAgendamentoService;
