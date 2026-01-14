import Procedimento from "../../models/Procedimento";
import AppError from "../../errors/AppError";

const ShowProcedimentoService = async (
  id: string | number,
  companyId: number
): Promise<Procedimento> => {
  const procedimento = await Procedimento.findByPk(id);

  if (procedimento?.companyId !== companyId) {
    throw new AppError("Não é possível acessar registro de outra empresa");
  }

  if (!procedimento) {
    throw new AppError("ERR_NO_PROCEDIMENTO_FOUND", 404);
  }

  return procedimento;
};

export default ShowProcedimentoService;
