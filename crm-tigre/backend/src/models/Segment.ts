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
  DataType
} from "sequelize-typescript";
import Company from "./Company";

export interface SegmentRule {
  field: string;      // "tags", "isWhatsappValid", "createdAt", etc
  operator: string;   // ">", "<", "=", "!=", "contains", "not_contains", "in", "between"
  value: any;         // Valor ou array de valores
}

@Table
class Segment extends Model<Segment> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.STRING(200),
    allowNull: false
  })
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @Column({
    type: DataType.JSON,
    allowNull: false
  })
  rules: SegmentRule[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  isActive: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  contactCount: number;

  @Column(DataType.DATE)
  lastCalculated: Date;

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

export default Segment;
