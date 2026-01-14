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
  BelongsTo
} from "sequelize-typescript";
import Contact from "./Contact";
import Company from "./Company";

@Table
class Paciente extends Model<Paciente> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Contact)
  @Column
  visitorId: number;

  @BelongsTo(() => Contact)
  visitor: Contact;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @AllowNull(false)
  @Column
  nome: string;

  @Default("")
  @Column
  email: string;

  @AllowNull(false)
  @Column
  telefone: string;

  @Default("")
  @Column
  whatsapp: string;

  @Default("")
  @Column
  cpf: string;

  @Column
  dataNascimento: Date;

  @Default("")
  @Column
  genero: string;

  @Default("")
  @Column
  endereco: string;

  @Default("")
  @Column
  cidade: string;

  @Default("")
  @Column
  estado: string;

  @Default("")
  @Column
  cep: string;

  @Default(0)
  @Column
  numeroProcedimentos: number;

  @Default("")
  @Column
  procedimentoFavorito: string;

  @Default("ATIVO")
  @Column
  status: string;

  @Default("NOVO")
  @Column
  classificacao: string;

  @Default("")
  @Column
  observacoes: string;

  @Default("")
  @Column
  alergias: string;

  @Default("")
  @Column
  historicoMedico: string;

  @Column
  ultimoContato: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Paciente;
