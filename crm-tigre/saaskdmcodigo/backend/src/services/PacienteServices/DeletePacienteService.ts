import Paciente from "../../models/Paciente";
import AppError from "../../errors/AppError";

const DeletePacienteService = async (
  id: string | number,
  companyId: number
): Promise<void> => {
  const paciente = await Paciente.findOne({
    where: {
      id,
      companyId
    }
  });

  if (!paciente) {
    throw new AppError("ERR_NO_PACIENTE_FOUND", 404);
  }

  await paciente.destroy();
};

export default DeletePacienteService;
