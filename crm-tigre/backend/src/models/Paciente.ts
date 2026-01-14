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
  HasMany,
  DataType,
  Default
} from "sequelize-typescript";
import Company from "./Company";
import Contact from "./Contact";

@Table({ tableName: "Pacientes" })
class Paciente extends Model<Paciente> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @ForeignKey(() => Contact)
  @Column
  contactId: number;

  @Column(DataType.STRING)
  nome: string;

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  telefone: string;

  @Column(DataType.STRING)
  whatsapp: string;

  @Column(DataType.STRING)
  cpf: string;

  @Column(DataType.DATEONLY)
  dataNascimento: Date;

  @Column(DataType.ENUM("M", "F", "OUTRO"))
  genero: string;

  @Column(DataType.STRING)
  endereco: string;

  @Column(DataType.STRING)
  cidade: string;

  @Column(DataType.STRING)
  estado: string;

  @Column(DataType.STRING)
  cep: string;

  @Default(0)
  @Column(DataType.INTEGER)
  numeroProcedimentos: number;

  @Column(DataType.STRING)
  procedimentoFavorito: string;

  @Default("ATIVO")
  @Column(DataType.ENUM("ATIVO", "INATIVO", "BLOQUEADO"))
  status: string;

  @Default("NOVO")
  @Column(DataType.ENUM("OURO", "PRATA", "BRONZE", "NOVO"))
  classificacao: string;

  @Column(DataType.TEXT)
  observacoes: string;

  @Column(DataType.TEXT)
  alergias: string;

  @Column(DataType.TEXT)
  historicoMedico: string;

  @Column(DataType.DATE)
  ultimoContato: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Company)
  company: Company;

  @BelongsTo(() => Contact)
  contact: Contact;
}

export default Paciente;
