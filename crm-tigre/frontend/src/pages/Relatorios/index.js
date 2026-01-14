import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Divider,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { GetApp, PictureAsPdf, TableChart } from "@material-ui/icons";
import { toast } from "react-toastify";

import {
  gerarRelatorioMensalPDF,
  exportarAgendamentosExcel,
  exportarPacientesExcel,
  exportarFinanceiroExcel,
} from "../../services/api-dashboard";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: 600,
  },
  sectionTitle: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
  formControl: {
    marginBottom: theme.spacing(2),
    width: "100%",
  },
  buttonGroup: {
    display: "flex",
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
    flexWrap: "wrap",
  },
  downloadButton: {
    padding: theme.spacing(1.5, 3),
    fontWeight: 600,
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

const Relatorios = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  // Pegar clinica_id do contexto/localStorage
  const clinicaId = localStorage.getItem("clinicaId") || 1;

  // Estados para filtros
  const [mesPDF, setMesPDF] = useState(new Date().getMonth() + 1);
  const [anoPDF, setAnoPDF] = useState(new Date().getFullYear());

  const [filtrosAgendamentos, setFiltrosAgendamentos] = useState({
    data_inicio: "",
    data_fim: "",
    status: "",
  });

  const [filtrosPacientes, setFiltrosPacientes] = useState({
    nome: "",
  });

  const [filtrosFinanceiro, setFiltrosFinanceiro] = useState({
    data_inicio: "",
    data_fim: "",
    status: "",
    metodo: "",
  });

  const handleGerarPDF = async () => {
    if (!mesPDF || !anoPDF) {
      toast.error("Selecione o mês e ano");
      return;
    }

    setLoading(true);
    try {
      await gerarRelatorioMensalPDF(clinicaId, mesPDF, anoPDF);
      toast.success("Relatório PDF gerado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar relatório PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleExportarAgendamentos = async () => {
    setLoading(true);
    try {
      await exportarAgendamentosExcel(clinicaId, filtrosAgendamentos);
      toast.success("Agendamentos exportados com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao exportar agendamentos");
    } finally {
      setLoading(false);
    }
  };

  const handleExportarPacientes = async () => {
    setLoading(true);
    try {
      await exportarPacientesExcel(clinicaId, filtrosPacientes);
      toast.success("Pacientes exportados com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao exportar pacientes");
    } finally {
      setLoading(false);
    }
  };

  const handleExportarFinanceiro = async () => {
    setLoading(true);
    try {
      await exportarFinanceiroExcel(clinicaId, filtrosFinanceiro);
      toast.success("Financeiro exportado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao exportar financeiro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        📊 Relatórios
      </Typography>

      {/* Relatório Mensal PDF */}
      <Paper className={classes.paper}>
        <Typography variant="h6" className={classes.sectionTitle}>
          📄 Relatório Mensal (PDF)
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Gera um relatório completo com todas as métricas do mês selecionado
        </Typography>

        <Grid container spacing={2} style={{ marginTop: 16 }}>
          <Grid item xs={12} sm={6}>
            <FormControl className={classes.formControl} variant="outlined">
              <InputLabel>Mês</InputLabel>
              <Select
                value={mesPDF}
                onChange={(e) => setMesPDF(e.target.value)}
                label="Mês"
              >
                <MenuItem value={1}>Janeiro</MenuItem>
                <MenuItem value={2}>Fevereiro</MenuItem>
                <MenuItem value={3}>Março</MenuItem>
                <MenuItem value={4}>Abril</MenuItem>
                <MenuItem value={5}>Maio</MenuItem>
                <MenuItem value={6}>Junho</MenuItem>
                <MenuItem value={7}>Julho</MenuItem>
                <MenuItem value={8}>Agosto</MenuItem>
                <MenuItem value={9}>Setembro</MenuItem>
                <MenuItem value={10}>Outubro</MenuItem>
                <MenuItem value={11}>Novembro</MenuItem>
                <MenuItem value={12}>Dezembro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              className={classes.formControl}
              label="Ano"
              variant="outlined"
              type="number"
              value={anoPDF}
              onChange={(e) => setAnoPDF(e.target.value)}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.downloadButton}
          onClick={handleGerarPDF}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <PictureAsPdf />}
        >
          Gerar Relatório PDF
        </Button>
      </Paper>

      <Divider style={{ margin: "32px 0" }} />

      {/* Exportação de Agendamentos */}
      <Paper className={classes.paper}>
        <Typography variant="h6" className={classes.sectionTitle}>
          📅 Exportar Agendamentos (Excel)
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              className={classes.formControl}
              label="Data Início"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filtrosAgendamentos.data_inicio}
              onChange={(e) =>
                setFiltrosAgendamentos({ ...filtrosAgendamentos, data_inicio: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              className={classes.formControl}
              label="Data Fim"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filtrosAgendamentos.data_fim}
              onChange={(e) =>
                setFiltrosAgendamentos({ ...filtrosAgendamentos, data_fim: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl className={classes.formControl} variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={filtrosAgendamentos.status}
                onChange={(e) =>
                  setFiltrosAgendamentos({ ...filtrosAgendamentos, status: e.target.value })
                }
                label="Status"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="pendente">Pendente</MenuItem>
                <MenuItem value="confirmado">Confirmado</MenuItem>
                <MenuItem value="cancelado">Cancelado</MenuItem>
                <MenuItem value="realizado">Realizado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.downloadButton}
          onClick={handleExportarAgendamentos}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <TableChart />}
        >
          Exportar Agendamentos
        </Button>
      </Paper>

      {/* Exportação de Pacientes */}
      <Paper className={classes.paper}>
        <Typography variant="h6" className={classes.sectionTitle}>
          👥 Exportar Pacientes (Excel)
        </Typography>

        <TextField
          className={classes.formControl}
          label="Filtrar por Nome"
          variant="outlined"
          value={filtrosPacientes.nome}
          onChange={(e) => setFiltrosPacientes({ ...filtrosPacientes, nome: e.target.value })}
          placeholder="Deixe vazio para exportar todos"
        />

        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.downloadButton}
          onClick={handleExportarPacientes}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <TableChart />}
        >
          Exportar Pacientes
        </Button>
      </Paper>

      {/* Exportação Financeira */}
      <Paper className={classes.paper}>
        <Typography variant="h6" className={classes.sectionTitle}>
          💰 Exportar Financeiro (Excel)
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              className={classes.formControl}
              label="Data Início"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filtrosFinanceiro.data_inicio}
              onChange={(e) =>
                setFiltrosFinanceiro({ ...filtrosFinanceiro, data_inicio: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              className={classes.formControl}
              label="Data Fim"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filtrosFinanceiro.data_fim}
              onChange={(e) =>
                setFiltrosFinanceiro({ ...filtrosFinanceiro, data_fim: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl className={classes.formControl} variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={filtrosFinanceiro.status}
                onChange={(e) =>
                  setFiltrosFinanceiro({ ...filtrosFinanceiro, status: e.target.value })
                }
                label="Status"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="PENDENTE">Pendente</MenuItem>
                <MenuItem value="APROVADO">Aprovado</MenuItem>
                <MenuItem value="RECUSADO">Recusado</MenuItem>
                <MenuItem value="REEMBOLSADO">Reembolsado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl className={classes.formControl} variant="outlined">
              <InputLabel>Método</InputLabel>
              <Select
                value={filtrosFinanceiro.metodo}
                onChange={(e) =>
                  setFiltrosFinanceiro({ ...filtrosFinanceiro, metodo: e.target.value })
                }
                label="Método"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="PIX">PIX</MenuItem>
                <MenuItem value="CARTAO">Cartão</MenuItem>
                <MenuItem value="BOLETO">Boleto</MenuItem>
                <MenuItem value="DINHEIRO">Dinheiro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.downloadButton}
          onClick={handleExportarFinanceiro}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <TableChart />}
        >
          Exportar Financeiro
        </Button>
      </Paper>
    </Container>
  );
};

export default Relatorios;
