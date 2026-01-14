import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
  DataType
} from "sequelize-typescript";
import Company from "./Company";
import Contact from "./Contact";
import Agendamento from "./Agendamento";

export enum TipoAutomacao {
  LEMBRETE_24H = "LEMBRETE_24H",
  LEMBRETE_2H = "LEMBRETE_2H",
  NPS = "NPS",
  REATIVACAO_30D = "REATIVACAO_30D",
  REATIVACAO_60D = "REATIVACAO_60D",
  REATIVACAO_90D = "REATIVACAO_90D"
}

export enum StatusAutomacao {
  PENDENTE = "PENDENTE",
  ENVIADO = "ENVIADO",
  RESPONDIDO = "RESPONDIDO",
  ERRO = "ERRO"
}

@Table
class Automacao extends Model<Automacao> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(TipoAutomacao)))
  tipo: TipoAutomacao;

  @ForeignKey(() => Company)
  @AllowNull(false)
  @Column
  companyId: number;

  @ForeignKey(() => Contact)
  @AllowNull(false)
  @Column
  pacienteId: number;

  @ForeignKey(() => Agendamento)
  @Column
  agendamentoId: number;

  @Column(DataType.DATE)
  dataEnvio: Date;

  @Default(StatusAutomacao.PENDENTE)
  @Column(DataType.ENUM(...Object.values(StatusAutomacao)))
  status: StatusAutomacao;

  @Column(DataType.TEXT)
  mensagemEnviada: string;

  @Column(DataType.TEXT)
  resposta: string;

  @Column(DataType.INTEGER)
  notaNps: number;

  @Column(DataType.TEXT)
  erroMensagem: string;

  @BelongsTo(() => Company)
  company: Company;

  @BelongsTo(() => Contact)
  paciente: Contact;

  @BelongsTo(() => Agendamento)
  agendamento: Agendamento;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Automacao;
