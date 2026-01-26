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
import Campaign from "./Campaign";
import Company from "./Company";

@Table
class CampaignAnalytics extends Model<CampaignAnalytics> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Campaign)
  @Column
  campaignId: number;

  @BelongsTo(() => Campaign)
  campaign: Campaign;

  @Column(DataType.DATEONLY)
  date: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  totalSent: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  totalDelivered: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  totalRead: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  totalReplied: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  totalConfirmed: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    defaultValue: 0
  })
  conversionRate: number;

  @Column(DataType.INTEGER)
  avgResponseTime: number;

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

export default CampaignAnalytics;
