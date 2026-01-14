import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
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

const AgendamentosChart = ({ data }) => {
  const classes = useStyles();

  // Formatar dados para o gráfico
  const chartData = data?.map((item) => ({
    data: new Date(item.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
    quantidade: item.count,
  })) || [];

  return (
    <Paper className={classes.chartContainer}>
      <Typography variant="h6" className={classes.title}>
        📅 Agendamentos por Dia
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantidade" fill="#2196F3" name="Agendamentos" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default AgendamentosChart;
