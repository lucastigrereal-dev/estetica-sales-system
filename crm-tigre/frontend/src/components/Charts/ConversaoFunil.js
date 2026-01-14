import React from "react";
import { Paper, Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  chartContainer: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: 600,
  },
  funnel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  funnelStage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    color: "white",
    fontWeight: 600,
    fontSize: "1.1rem",
    position: "relative",
    minHeight: "60px",
  },
  stageLabel: {
    fontSize: "0.85rem",
    opacity: 0.9,
    marginBottom: theme.spacing(0.5),
  },
  stageValue: {
    fontSize: "1.5rem",
    fontWeight: 700,
  },
  stageTaxa: {
    fontSize: "0.8rem",
    opacity: 0.9,
    marginTop: theme.spacing(0.5),
  },
}));

const ConversaoFunil = ({ data }) => {
  const classes = useStyles();

  if (!data) return null;

  const stages = [
    { label: "Leads", value: data.leads, width: "100%", color: "#3498db" },
    { label: "Qualificados", value: data.qualificados, width: "80%", color: "#2ecc71", taxa: data.taxas?.qualificacao },
    { label: "Agendados", value: data.agendados, width: "60%", color: "#f39c12", taxa: data.taxas?.agendamento },
    { label: "Realizados", value: data.realizados, width: "40%", color: "#e74c3c", taxa: data.taxas?.conversao },
  ];

  return (
    <Paper className={classes.chartContainer}>
      <Typography variant="h6" className={classes.title}>
        🎯 Funil de Conversão
      </Typography>
      <Box className={classes.funnel}>
        {stages.map((stage, index) => (
          <Box
            key={index}
            className={classes.funnelStage}
            style={{
              width: stage.width,
              backgroundColor: stage.color,
            }}
          >
            <div className={classes.stageLabel}>{stage.label}</div>
            <div className={classes.stageValue}>{stage.value}</div>
            {stage.taxa && (
              <div className={classes.stageTaxa}>
                Taxa: {stage.taxa.toFixed(1)}%
              </div>
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ConversaoFunil;
