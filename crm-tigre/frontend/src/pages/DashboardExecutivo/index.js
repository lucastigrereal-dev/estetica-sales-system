import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  TrendingUp,
  CalendarToday,
  AttachMoney,
  PersonAdd,
  Cancel,
} from "@material-ui/icons";

import FaturamentoChart from "../../components/Charts/FaturamentoChart";
import AgendamentosChart from "../../components/Charts/AgendamentosChart";
import ConversaoFunil from "../../components/Charts/ConversaoFunil";
import TopProcedimentos from "../../components/Charts/TopProcedimentos";

import {
  getDashboardResumoHoje,
  getDashboardMetricas,
  getDashboardConversao,
  getDashboardTopProcedimentos,
} from "../../services/api-dashboard";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  kpiCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
  },
  kpiCardContent: {
    flexGrow: 1,
  },
  kpiIcon: {
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(2),
    fontSize: "3rem",
    opacity: 0.3,
  },
  kpiValue: {
    fontSize: "2.5rem",
    fontWeight: 700,
    marginTop: theme.spacing(1),
  },
  kpiLabel: {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
    textTransform: "uppercase",
  },
  chartPaper: {
    padding: theme.spacing(3),
  },
  refreshInfo: {
    marginTop: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    fontSize: "0.75rem",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },
}));

const DashboardExecutivo = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [resumo, setResumo] = useState(null);
  const [metricas, setMetricas] = useState(null);
  const [conversao, setConversao] = useState(null);
  const [topProcedimentos, setTopProcedimentos] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Pegar clinica_id do contexto/localStorage (ajuste conforme sua implementação)
  const clinicaId = localStorage.getItem("clinicaId") || 1;

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [resumoData, metricasData, conversaoData, topProcsData] = await Promise.all([
        getDashboardResumoHoje(clinicaId),
        getDashboardMetricas(clinicaId, 30),
        getDashboardConversao(clinicaId, 30),
        getDashboardTopProcedimentos(clinicaId, 30, 5),
      ]);

      setResumo(resumoData);
      setMetricas(metricasData);
      setConversao(conversaoData);
      setTopProcedimentos(topProcsData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Auto-refresh a cada 5 minutos
    const interval = setInterval(() => {
      loadDashboardData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" className={classes.container}>
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      </Container>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: 600, marginBottom: 24 }}>
        Dashboard Executivo
      </Typography>

      {/* KPIs */}
      <Grid container spacing={3} style={{ marginBottom: 24 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.kpiCard} style={{ backgroundColor: "#2196F3", color: "white" }}>
            <CardContent className={classes.kpiCardContent}>
              <CalendarToday className={classes.kpiIcon} />
              <Typography className={classes.kpiLabel}>Agendamentos Hoje</Typography>
              <Typography className={classes.kpiValue}>
                {resumo?.agendamentos_total || 0}
              </Typography>
              <Typography variant="caption">
                Realizados: {resumo?.agendamentos_realizados || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.kpiCard} style={{ backgroundColor: "#4CAF50", color: "white" }}>
            <CardContent className={classes.kpiCardContent}>
              <AttachMoney className={classes.kpiIcon} />
              <Typography className={classes.kpiLabel}>Faturamento Hoje</Typography>
              <Typography className={classes.kpiValue}>
                {formatCurrency(resumo?.faturamento_hoje)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.kpiCard} style={{ backgroundColor: "#FF9800", color: "white" }}>
            <CardContent className={classes.kpiCardContent}>
              <Cancel className={classes.kpiIcon} />
              <Typography className={classes.kpiLabel}>No-Shows</Typography>
              <Typography className={classes.kpiValue}>
                {resumo?.no_shows || 0}
              </Typography>
              <Typography variant="caption">
                Taxa: {resumo?.taxa_no_show?.toFixed(1) || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.kpiCard} style={{ backgroundColor: "#9C27B0", color: "white" }}>
            <CardContent className={classes.kpiCardContent}>
              <PersonAdd className={classes.kpiIcon} />
              <Typography className={classes.kpiLabel}>Novos Leads</Typography>
              <Typography className={classes.kpiValue}>
                {resumo?.novos_leads || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FaturamentoChart data={metricas?.faturamento} />
        </Grid>
        <Grid item xs={12} md={6}>
          <AgendamentosChart data={metricas?.agendamentos} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ConversaoFunil data={conversao} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TopProcedimentos data={topProcedimentos} />
        </Grid>
      </Grid>

      <Typography className={classes.refreshInfo}>
        Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")} | Auto-refresh a cada 5 minutos
      </Typography>
    </Container>
  );
};

export default DashboardExecutivo;
