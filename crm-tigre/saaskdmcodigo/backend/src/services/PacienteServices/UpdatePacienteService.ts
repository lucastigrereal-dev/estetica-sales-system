import Paciente from "../../models/Paciente";
import AppError from "../../errors/AppError";
import ShowPacienteService from "./ShowPacienteService";

interface PacienteData {
  nome?: string;
  email?: string;
  telefone?: string;
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
  observacoes?: string;
  alergias?: string;
  historicoMedico?: string;
  ultimoContato?: Date;
}

interface Request {
  pacienteData: PacienteData;
  pacienteId: string | number;
  companyId: number;
}

const calcularClassificacao = (numeroProcedimentos: number): string => {
  if (numeroProcedimentos === 0) return "NOVO";
  if (numeroProcedimentos >= 10) return "OURO";
  if (numeroProcedimentos >= 5) return "PRATA";
  return "BRONZE";
};

const UpdatePacienteService = async ({
  pacienteData,
  pacienteId,
  companyId
}: Request): Promise<Paciente> => {
  const paciente = await ShowPacienteService(pacienteId, companyId);

  try {
    const updateData: any = { ...pacienteData };

    // Recalcular classificação se numeroProcedimentos foi alterado
    if (pacienteData.numeroProcedimentos !== undefined) {
      updateData.classificacao = calcularClassificacao(
        pacienteData.numeroProcedimentos
      );
    }

    // Atualizar ultimoContato se não foi fornecido
    if (!pacienteData.ultimoContato) {
      updateData.ultimoContato = new Date();
    }

    await paciente.update(updateData);

    await paciente.reload();

    return paciente;
  } catch (error: any) {
    throw new AppError(error.message);
  }
};

export default UpdatePacienteService;
