import Contact from "../../models/Contact";
import Paciente from "../../models/Paciente";
import AppError from "../../errors/AppError";
import CreatePacienteService from "./CreatePacienteService";

interface Request {
  contactId: string | number;
  companyId: number;
}

const ConvertFromContactService = async ({
  contactId,
  companyId
}: Request): Promise<Paciente> => {
  // Buscar o contato
  const contact = await Contact.findOne({
    where: {
      id: contactId,
      companyId
    }
  });

  if (!contact) {
    throw new AppError("ERR_NO_CONTACT_FOUND", 404);
  }

  // Verificar se já existe um paciente vinculado a este contato
  const existingPaciente = await Paciente.findOne({
    where: {
      visitorId: contactId,
      companyId
    }
  });

  if (existingPaciente) {
    throw new AppError("ERR_PACIENTE_ALREADY_EXISTS", 409);
  }

  // Criar paciente a partir dos dados do contato
  const paciente = await CreatePacienteService({
    visitorId: contact.id,
    companyId,
    nome: contact.name,
    email: contact.email || "",
    telefone: contact.number,
    whatsapp: contact.number,
    status: "ATIVO",
    classificacao: "NOVO",
    numeroProcedimentos: 0,
    ultimoContato: new Date()
  });

  return paciente;
};

export default ConvertFromContactService;
