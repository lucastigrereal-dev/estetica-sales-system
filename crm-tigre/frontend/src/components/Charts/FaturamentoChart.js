import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  chartContainer: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
  },
}));

const FaturamentoChart = ({ data }) => {
  const classes = useStyles();

  // Formatar dados para o gráfico
  const chartData = data?.map((item) => ({
    data: new Date(item.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
    valor: item.valor,
  })) || [];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Paper className={classes.chartContainer}>
      <Typography variant="h6" className={classes.title}>
        📈 Faturamento (Últimos 30 dias)
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#4CAF50"
            strokeWidth={2}
            name="Faturamento"
            dot={{ fill: "#4CAF50", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default FaturamentoChart;
