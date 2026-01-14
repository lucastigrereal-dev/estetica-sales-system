import {
  Table, Column, CreatedAt, UpdatedAt, Model, PrimaryKey,
  AutoIncrement, ForeignKey, BelongsTo, DataType, Default
} from "sequelize-typescript";
import Company from "./Company";
import Paciente from "./Paciente";
import Agendamento from "./Agendamento";

@Table({ tableName: "PesquisasNps" })
class PesquisaNps extends Model<PesquisaNps> {
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

  @Column(DataType.INTEGER)
  score: number;

  @Column(DataType.TEXT)
  comentario: string;

  @Column(DataType.DATE)
  dataEnvio: Date;

  @Column(DataType.DATE)
  dataResposta: Date;

  @Default(false)
  @Column(DataType.BOOLEAN)
  respondido: boolean;

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

export default PesquisaNps;
