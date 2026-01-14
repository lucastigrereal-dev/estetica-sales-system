import {
  Table, Column, CreatedAt, UpdatedAt, Model, PrimaryKey,
  AutoIncrement, ForeignKey, BelongsTo, DataType, Default
} from "sequelize-typescript";
import Company from "./Company";
import Paciente from "./Paciente";
import Procedimento from "./Procedimento";
import User from "./User";

@Table({ tableName: "Agendamentos" })
class Agendamento extends Model<Agendamento> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @ForeignKey(() => Paciente)
  @Column
  pacienteId: number;

  @ForeignKey(() => Procedimento)
  @Column
  procedimentoId: number;

  @ForeignKey(() => User)
  @Column
  profissionalId: number;

  @Column(DataType.DATE)
  dataAgendamento: Date;

  @Column(DataType.TIME)
  horaInicio: string;

  @Column(DataType.TIME)
  horaFim: string;

  @Column(DataType.INTEGER)
  duracaoMinutos: number;

  @Default("AGENDADO")
  @Column(DataType.ENUM("AGENDADO", "CONFIRMADO", "REALIZADO", "CANCELADO", "NO_SHOW"))
  status: string;

  @Column(DataType.DECIMAL(10, 2))
  preco: number;

  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  desconto: number;

  @Column(DataType.DECIMAL(10, 2))
  precoFinal: number;

  @Default("PENDENTE")
  @Column(DataType.ENUM("PENDENTE", "PAGO", "PARCIAL", "REEMBOLSADO"))
  pagamentoStatus: string;

  @Column(DataType.STRING)
  metodoPagamento: string;

  @Column(DataType.TEXT)
  notas: string;

  @Column(DataType.STRING)
  motivoCancelamento: string;

  @Column(DataType.STRING)
  googleEventId: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  lembrete24hEnviado: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  lembrete2hEnviado: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Company)
  company: Company;

  @BelongsTo(() => Paciente)
  paciente: Paciente;

  @BelongsTo(() => Procedimento)
  procedimento: Procedimento;

  @BelongsTo(() => User)
  profissional: User;
}

export default Agendamento;
