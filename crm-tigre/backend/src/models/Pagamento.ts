import {
  Table, Column, CreatedAt, UpdatedAt, Model, PrimaryKey,
  AutoIncrement, ForeignKey, BelongsTo, DataType, Default
} from "sequelize-typescript";
import Company from "./Company";
import Paciente from "./Paciente";
import Agendamento from "./Agendamento";

@Table({ tableName: "Pagamentos" })
class Pagamento extends Model<Pagamento> {
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

  @Column(DataType.DECIMAL(10, 2))
  valor: number;

  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  desconto: number;

  @Column(DataType.DECIMAL(10, 2))
  valorFinal: number;

  @Default("CARTAO")
  @Column(DataType.ENUM("CARTAO", "PIX", "BOLETO", "DINHEIRO", "TRANSFERENCIA"))
  metodo: string;

  @Default("PENDENTE")
  @Column(DataType.ENUM("PENDENTE", "PROCESSANDO", "APROVADO", "RECUSADO", "REEMBOLSADO"))
  status: string;

  @Column(DataType.STRING)
  stripePaymentId: string;

  @Column(DataType.STRING)
  stripeCheckoutUrl: string;

  @Column(DataType.TEXT)
  pixCode: string;

  @Column(DataType.STRING)
  pixQrCodeUrl: string;

  @Column(DataType.STRING)
  boletoUrl: string;

  @Column(DataType.DATE)
  dataPagamento: Date;

  @Column(DataType.TEXT)
  observacoes: string;

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

export default Pagamento;
