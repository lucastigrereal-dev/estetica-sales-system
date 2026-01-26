import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return Promise.all([
      // 1. Adicionar campos de analytics em Campaign
      queryInterface.addColumn("Campaigns", "conversionRate", {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
        comment: "Taxa de conversão em porcentagem"
      }),

      queryInterface.addColumn("Campaigns", "totalDelivered", {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: "Total de mensagens entregues"
      }),

      queryInterface.addColumn("Campaigns", "totalReplied", {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: "Total de respostas recebidas"
      }),

      queryInterface.addColumn("Campaigns", "totalConfirmed", {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: "Total de confirmações"
      }),

      queryInterface.addColumn("Campaigns", "avgResponseTime", {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Tempo médio de resposta em minutos"
      }),

      // 2. Adicionar campos de A/B Testing em Campaign
      queryInterface.addColumn("Campaigns", "isABTest", {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "É um teste A/B?"
      }),

      queryInterface.addColumn("Campaigns", "abVariantA", {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Mensagem variante A para A/B test"
      }),

      queryInterface.addColumn("Campaigns", "abVariantB", {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Mensagem variante B para A/B test"
      }),

      queryInterface.addColumn("Campaigns", "abPercentageA", {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 50,
        comment: "Porcentagem para variante A (0-100)"
      }),

      // 3. Adicionar variante em CampaignShipping
      queryInterface.addColumn("CampaignShippings", "variant", {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: "Variante usada: A, B, ou null"
      }),

      queryInterface.addColumn("CampaignShippings", "replied", {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Cliente respondeu?"
      }),

      queryInterface.addColumn("CampaignShippings", "repliedAt", {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Data/hora da resposta"
      }),

      queryInterface.addColumn("CampaignShippings", "responseTime", {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Tempo de resposta em minutos"
      }),

      // 4. Criar tabela CampaignAnalytics
      queryInterface.createTable("CampaignAnalytics", {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false
        },
        campaignId: {
          type: DataTypes.INTEGER,
          references: { model: "Campaigns", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          allowNull: false
        },
        date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          comment: "Data da métrica"
        },
        totalSent: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          comment: "Total enviado no dia"
        },
        totalDelivered: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          comment: "Total entregue no dia"
        },
        totalRead: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          comment: "Total lido no dia"
        },
        totalReplied: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          comment: "Total respondido no dia"
        },
        totalConfirmed: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          comment: "Total confirmado no dia"
        },
        conversionRate: {
          type: DataTypes.DECIMAL(5, 2),
          defaultValue: 0,
          comment: "Taxa de conversão do dia"
        },
        avgResponseTime: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: "Tempo médio de resposta em minutos"
        },
        companyId: {
          type: DataTypes.INTEGER,
          references: { model: "Companies", key: "id" },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          allowNull: false
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }),

      // 5. Criar índices
      queryInterface.addIndex("CampaignAnalytics", ["campaignId", "date"], {
        unique: true,
        name: "campaign_analytics_campaign_date"
      }),

      queryInterface.addIndex("CampaignAnalytics", ["companyId"]),
      queryInterface.addIndex("CampaignShippings", ["variant"]),
      queryInterface.addIndex("Campaigns", ["isABTest"])
    ]);
  },

  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      // Remove tabela
      queryInterface.dropTable("CampaignAnalytics"),

      // Remove colunas Campaign
      queryInterface.removeColumn("Campaigns", "conversionRate"),
      queryInterface.removeColumn("Campaigns", "totalDelivered"),
      queryInterface.removeColumn("Campaigns", "totalReplied"),
      queryInterface.removeColumn("Campaigns", "totalConfirmed"),
      queryInterface.removeColumn("Campaigns", "avgResponseTime"),
      queryInterface.removeColumn("Campaigns", "isABTest"),
      queryInterface.removeColumn("Campaigns", "abVariantA"),
      queryInterface.removeColumn("Campaigns", "abVariantB"),
      queryInterface.removeColumn("Campaigns", "abPercentageA"),

      // Remove colunas CampaignShipping
      queryInterface.removeColumn("CampaignShippings", "variant"),
      queryInterface.removeColumn("CampaignShippings", "replied"),
      queryInterface.removeColumn("CampaignShippings", "repliedAt"),
      queryInterface.removeColumn("CampaignShippings", "responseTime")
    ]);
  }
};
