import Paciente from "../../models/Paciente";
import Contact from "../../models/Contact";
import AppError from "../../errors/AppError";

const ShowPacienteService = async (
  id: string | number,
  companyId: number
): Promise<Paciente> => {
  const paciente = await Paciente.findOne({
    where: {
      id,
      companyId
    },
    include: [
      {
        model: Contact,
        as: "visitor",
        attributes: ["id", "name", "number", "profilePicUrl", "email"]
      }
    ]
  });

  if (!paciente) {
    throw new AppError("ERR_NO_PACIENTE_FOUND", 404);
  }

  return paciente;
};

export default ShowPacienteService;
