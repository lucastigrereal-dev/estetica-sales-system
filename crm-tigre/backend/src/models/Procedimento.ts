import {
  Table, Column, CreatedAt, UpdatedAt, Model, PrimaryKey,
  AutoIncrement, ForeignKey, BelongsTo, DataType, Default
} from "sequelize-typescript";
import Company from "./Company";

@Table({ tableName: "Procedimentos" })
class Procedimento extends Model<Procedimento> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @Column(DataType.STRING)
  nome: string;

  @Column(DataType.TEXT)
  descricao: string;

  @Default("FACIAL")
  @Column(DataType.ENUM("FACIAL", "CORPORAL", "CAPILAR", "INJETAVEL", "LASER", "OUTRA"))
  categoria: string;

  @Default(60)
  @Column(DataType.INTEGER)
  duracaoMinutos: number;

  @Column(DataType.DECIMAL(10, 2))
  precoPadrao: number;

  @Column(DataType.DECIMAL(10, 2))
  precoPromocional: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  ativo: boolean;

  @Column(DataType.STRING)
  imagemUrl: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Company)
  company: Company;
}

export default Procedimento;
