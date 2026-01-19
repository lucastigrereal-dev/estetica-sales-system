import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  DataType,
  Default
} from "sequelize-typescript";
import Company from "./Company";
import Paciente from "./Paciente";
import Agendamento from "./Agendamento";

@Table({ tableName: "LembreteLogs" })
class LembreteLog extends Model<LembreteLog> {
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

  @ForeignKey(() => Agendamento)
  @Column
  agendamentoId: number;

  @Column(DataType.ENUM("LEMBRETE_24H", "LEMBRETE_2H", "NPS", "REATIVACAO"))
  tipo: string;

  @Column(DataType.STRING)
  numeroWhatsapp: string;

  @Column(DataType.TEXT)
  mensagem: string;

  @Default("PENDENTE")
  @Column(DataType.ENUM("PENDENTE", "ENVIADO", "FALHA", "RESPONDIDO"))
  status: string;

  @Default(0)
  @Column(DataType.INTEGER)
  tentativas: number;

  @Column(DataType.DATE)
  ultimaTentativa: Date;

  @Column(DataType.TEXT)
  erroMensagem: string;

  @Column(DataType.TEXT)
  respostaRecebida: string;

  @Column(DataType.DATE)
  dataResposta: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Company)
  company: Company;

  @BelongsTo(() => Paciente)
  paciente: Paciente;

  @BelongsTo(() => Agendamento)
  agendamento: Agendamento;
}

export default LembreteLog;
