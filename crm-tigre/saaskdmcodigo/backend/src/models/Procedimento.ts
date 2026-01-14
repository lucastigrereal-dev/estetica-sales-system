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
  HasMany
} from "sequelize-typescript";
import Company from "./Company";
import Agendamento from "./Agendamento";

@Table
class Procedimento extends Model<Procedimento> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  nome: string;

  @Column
  descricao: string;

  @Column
  categoria: string;

  @AllowNull(false)
  @Column
  duracaoMinutos: number;

  @AllowNull(false)
  @Column
  precoPadrao: number;

  @Default(0)
  @Column
  precoPromocional: number;

  @Default(true)
  @Column
  ativo: boolean;

  @Column
  imagemUrl: string;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @HasMany(() => Agendamento)
  agendamentos: Agendamento[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Procedimento;
