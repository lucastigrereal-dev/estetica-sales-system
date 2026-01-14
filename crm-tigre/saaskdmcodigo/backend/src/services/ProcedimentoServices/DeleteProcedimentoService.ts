import Procedimento from "../../models/Procedimento";
import AppError from "../../errors/AppError";

const DeleteProcedimentoService = async (
  id: string,
  companyId: number
): Promise<void> => {
  const procedimento = await Procedimento.findOne({
    where: { id }
  });

  if (!procedimento) {
    throw new AppError("ERR_NO_PROCEDIMENTO_FOUND", 404);
  }

  if (procedimento.companyId !== companyId) {
    throw new AppError("Não é possível excluir registro de outra empresa");
  }

  await procedimento.destroy();
};

export default DeleteProcedimentoService;
