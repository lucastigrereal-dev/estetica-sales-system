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
import Procedimento from "./Procedimento";
import User from "./User";

export enum AgendamentoStatus {
  AGENDADO = "AGENDADO",
  CONFIRMADO = "CONFIRMADO",
  REALIZADO = "REALIZADO",
  CANCELADO = "CANCELADO",
  NO_SHOW = "NO_SHOW"
}

export enum PagamentoStatus {
  PENDENTE = "PENDENTE",
  PAGO = "PAGO",
  PARCIAL = "PARCIAL",
  CANCELADO = "CANCELADO"
}

@Table
class Agendamento extends Model<Agendamento> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Company)
  @AllowNull(false)
  @Column
  companyId: number;

  @ForeignKey(() => Contact)
  @AllowNull(false)
  @Column
  pacienteId: number;

  @ForeignKey(() => Procedimento)
  @AllowNull(false)
  @Column
  procedimentoId: number;

  @ForeignKey(() => User)
  @Column
  profissionalId: number;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  dataAgendamento: Date;

  @AllowNull(false)
  @Column(DataType.TIME)
  horaInicio: string;

  @AllowNull(false)
  @Column(DataType.TIME)
  horaFim: string;

  @AllowNull(false)
  @Column
  duracaoMinutos: number;

  @Default(AgendamentoStatus.AGENDADO)
  @Column(DataType.ENUM(...Object.values(AgendamentoStatus)))
  status: AgendamentoStatus;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  preco: number;

  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  desconto: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  precoFinal: number;

  @Default(PagamentoStatus.PENDENTE)
  @Column(DataType.ENUM(...Object.values(PagamentoStatus)))
  pagamentoStatus: PagamentoStatus;

  @Column
  metodoPagamento: string;

  @Column(DataType.TEXT)
  notas: string;

  @Column
  googleEventId: string;

  @Default(false)
  @Column
  lembrete24hEnviado: boolean;

  @Default(false)
  @Column
  lembrete2hEnviado: boolean;

  @Column(DataType.TEXT)
  motivoCancelamento: string;

  @BelongsTo(() => Company)
  company: Company;

  @BelongsTo(() => Contact)
  paciente: Contact;

  @BelongsTo(() => Procedimento)
  procedimento: Procedimento;

  @BelongsTo(() => User)
  profissional: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Agendamento;
