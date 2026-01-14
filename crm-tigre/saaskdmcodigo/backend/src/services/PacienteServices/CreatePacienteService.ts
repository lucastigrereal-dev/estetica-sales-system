import Paciente from "../../models/Paciente";
import AppError from "../../errors/AppError";

interface Request {
  visitorId?: number;
  companyId: number;
  nome: string;
  email?: string;
  telefone: string;
  whatsapp?: string;
  cpf?: string;
  dataNascimento?: Date;
  genero?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  numeroProcedimentos?: number;
  procedimentoFavorito?: string;
  status?: string;
  classificacao?: string;
  observacoes?: string;
  alergias?: string;
  historicoMedico?: string;
  ultimoContato?: Date;
}

const calcularClassificacao = (numeroProcedimentos: number): string => {
  if (numeroProcedimentos === 0) return "NOVO";
  if (numeroProcedimentos >= 10) return "OURO";
  if (numeroProcedimentos >= 5) return "PRATA";
  return "BRONZE";
};

const CreatePacienteService = async (
  pacienteData: Request
): Promise<Paciente> => {
  try {
    const {
      visitorId,
      companyId,
      nome,
      email = "",
      telefone,
      whatsapp = "",
      cpf = "",
      dataNascimento,
      genero = "",
      endereco = "",
      cidade = "",
      estado = "",
      cep = "",
      numeroProcedimentos = 0,
      procedimentoFavorito = "",
      status = "ATIVO",
      observacoes = "",
      alergias = "",
      historicoMedico = "",
      ultimoContato
    } = pacienteData;

    // Calcular classificação automaticamente
    const classificacao = calcularClassificacao(numeroProcedimentos);

    const paciente = await Paciente.create({
      visitorId,
      companyId,
      nome,
      email,
      telefone,
      whatsapp: whatsapp || telefone,
      cpf,
      dataNascimento,
      genero,
      endereco,
      cidade,
      estado,
      cep,
      numeroProcedimentos,
      procedimentoFavorito,
      status,
      classificacao,
      observacoes,
      alergias,
      historicoMedico,
      ultimoContato: ultimoContato || new Date()
    });

    return paciente;
  } catch (error: any) {
    throw new AppError(error.message);
  }
};

export default CreatePacienteService;
