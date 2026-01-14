import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  Default,
  DataType
} from "sequelize-typescript";

import Ticket from "./Ticket";
import Schedule from "./Schedule";
import Company from "./Company";

@Table
class TicketAnalysis extends Model<TicketAnalysis> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Ticket)
  @Column
  ticketId: number;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @Default(0)
  @Column(DataType.INTEGER)
  scoreQualificacao: number;

  @Default(0)
  @Column(DataType.FLOAT)
  sentimentoMedio: number;

  @Column(DataType.TEXT)
  procedimentoInteresse: string;

  @Column(DataType.STRING)
  experienciaPrevia: string;

  @Column(DataType.STRING)
  melhorDia: string;

  @Column(DataType.STRING)
  melhorHorario: string;

  @Column(DataType.TEXT)
  observacoes: string;

  @Default(false)
  @Column
  convertido: boolean;

  @ForeignKey(() => Schedule)
  @Column
  agendamentoId: number;

  @BelongsTo(() => Schedule)
  agendamento: Schedule;

  @Default([])
  @Column(DataType.JSONB)
  historicoConversa: object[];

  @Column(DataType.TEXT)
  resumoIA: string;

  // TAERE v1.3 - Motor de Qualificação de Leads
  @Column(DataType.STRING)
  leadState: string; // HOT, WARM, COLD, CURIOSO, SPAM

  @Column(DataType.JSONB)
  taereScores: object; // { timing, affective, economic, risk, engagement, total }

  @Column(DataType.JSONB)
  taereSignals: object[]; // Array de sinais detectados

  @Column(DataType.JSONB)
  taereReasons: string[]; // Motivos da classificação

  @Default(0)
  @Column(DataType.FLOAT)
  taereConfidence: number; // 0-1

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default TicketAnalysis;
