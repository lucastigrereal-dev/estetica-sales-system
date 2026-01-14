import AppError from "../../errors/AppError";
import Procedimento from "../../models/Procedimento";
import ShowProcedimentoService from "./ShowProcedimentoService";

interface Request {
  procedimentoData: {
    nome?: string;
    descricao?: string;
    categoria?: string;
    duracaoMinutos?: number;
    precoPadrao?: number;
    precoPromocional?: number;
    ativo?: boolean;
    imagemUrl?: string;
  };
  procedimentoId: string;
  companyId: number;
}

const UpdateProcedimentoService = async ({
  procedimentoData,
  procedimentoId,
  companyId
}: Request): Promise<Procedimento> => {
  const procedimento = await ShowProcedimentoService(procedimentoId, companyId);

  await procedimento.update(procedimentoData);

  await procedimento.reload();

  return procedimento;
};

export default UpdateProcedimentoService;
