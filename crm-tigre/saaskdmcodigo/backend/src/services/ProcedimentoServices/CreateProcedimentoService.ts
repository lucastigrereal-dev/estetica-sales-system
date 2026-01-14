import AppError from "../../errors/AppError";
import Procedimento from "../../models/Procedimento";

interface Request {
  nome: string;
  descricao?: string;
  categoria?: string;
  duracaoMinutos: number;
  precoPadrao: number;
  precoPromocional?: number;
  ativo?: boolean;
  imagemUrl?: string;
  companyId: number;
}

const CreateProcedimentoService = async ({
  nome,
  descricao,
  categoria,
  duracaoMinutos,
  precoPadrao,
  precoPromocional = 0,
  ativo = true,
  imagemUrl,
  companyId
}: Request): Promise<Procedimento> => {
  const procedimentoExists = await Procedimento.findOne({
    where: { nome, companyId }
  });

  if (procedimentoExists) {
    throw new AppError("ERR_PROCEDIMENTO_DUPLICATED");
  }

  const procedimento = await Procedimento.create({
    nome,
    descricao,
    categoria,
    duracaoMinutos,
    precoPadrao,
    precoPromocional,
    ativo,
    imagemUrl,
    companyId
  });

  return procedimento;
};

export default CreateProcedimentoService;
