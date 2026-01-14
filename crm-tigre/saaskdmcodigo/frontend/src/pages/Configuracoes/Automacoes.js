import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
  Chip,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import {
  CheckCircle,
  Error,
  Schedule,
  TrendingUp,
  Notifications,
  Assessment
} from "@material-ui/icons";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import { toast } from "react-toastify";
import api from "../../services/api";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(2),
    overflowY: "scroll",
    ...theme.scrollbarStyles
  },
  statsCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  statsIcon: {
    fontSize: 40,
    marginBottom: theme.spacing(1)
  },
  configSection: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  templateField: {
    marginTop: theme.spacing(2)
  }
}));

const statusColors = {
  PENDENTE: "default",
  ENVIADO: "primary",
  RESPONDIDO: "secondary",
  ERRO: "secondary"
};

const tipoIcons = {
  LEMBRETE_24H: <Notifications />,
  LEMBRETE_2H: <Schedule />,
  NPS: <Assessment />,
  REATIVACAO_30D: <TrendingUp />,
  REATIVACAO_60D: <TrendingUp />,
  REATIVACAO_90D: <TrendingUp />
};

const Automacoes = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [automacoes, setAutomacoes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    enviados: 0,
    respondidos: 0,
    erros: 0
  });

  // Configurações (mock - você pode salvar em Settings)
  const [config, setConfig] = useState({
    lembrete24h: true,
    lembrete2h: true,
    nps: true,
    reativacao30d: true,
    reativacao60d: true,
    reativacao90d: true
  });

  // Modal de edição de template
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateText, setTemplateText] = useState("");

  useEffect(() => {
    fetchAutomacoes();
  }, []);

  const fetchAutomacoes = async () => {
    setLoading(true);
    try {
      // TODO: Criar endpoint GET /automacoes
      // const { data } = await api.get("/automacoes");
      // setAutomacoes(data.automacoes);

      // Mock data para demonstração
      const mockData = [
        {
          id: 1,
          tipo: "LEMBRETE_24H",
          paciente: { name: "Maria Silva" },
          agendamento: { dataAgendamento: "2026-01-15", horaInicio: "14:00" },
          dataEnvio: "2026-01-14T10:00:00",
          status: "ENVIADO",
          mensagemEnviada: "Olá Maria! Lembrando que você tem um agendamento..."
        },
        {
          id: 2,
          tipo: "NPS",
          paciente: { name: "João Santos" },
          dataEnvio: "2026-01-14T20:00:00",
          status: "RESPONDIDO",
          resposta: "10",
          notaNps: 10
        }
      ];

      setAutomacoes(mockData);

      // Calcular estatísticas
      setStats({
        total: mockData.length,
        enviados: mockData.filter((a) => a.status === "ENVIADO").length,
        respondidos: mockData.filter((a) => a.status === "RESPONDIDO").length,
        erros: mockData.filter((a) => a.status === "ERRO").length
      });
    } catch (err) {
      toast.error("Erro ao carregar automações");
      console.error(err);
    }
    setLoading(false);
  };

  const handleConfigChange = (key) => {
    setConfig((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
    // TODO: Salvar em Settings
    toast.success("Configuração atualizada");
  };

  const handleEditTemplate = (tipo) => {
    setSelectedTemplate(tipo);
    // TODO: Buscar template atual do backend
    setTemplateText(
      "Template exemplo. Use {nome}, {data}, {hora}, {procedimento} como variáveis."
    );
    setTemplateModalOpen(true);
  };

  const handleSaveTemplate = () => {
    // TODO: Salvar template no backend
    toast.success("Template atualizado com sucesso");
    setTemplateModalOpen(false);
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      LEMBRETE_24H: "Lembrete 24h",
      LEMBRETE_2H: "Lembrete 2h",
      NPS: "Pesquisa NPS",
      REATIVACAO_30D: "Reativação 30 dias",
      REATIVACAO_60D: "Reativação 60 dias",
      REATIVACAO_90D: "Reativação 90 dias"
    };
    return labels[tipo] || tipo;
  };

  return (
    <MainContainer>
      <Dialog
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Editar Template - {getTipoLabel(selectedTemplate)}</DialogTitle>
        <DialogContent>
          <TextField
            label="Mensagem"
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            value={templateText}
            onChange={(e) => setTemplateText(e.target.value)}
            helperText="Use {nome}, {data}, {hora}, {procedimento} como variáveis"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveTemplate} color="primary" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <MainHeader>
        <Title>Automações e Lembretes</Title>
      </MainHeader>

      <Paper className={classes.mainPaper} variant="outlined">
        {/* Estatísticas */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent className={classes.statsCard}>
                <Notifications className={classes.statsIcon} color="primary" />
                <Typography variant="h4">{stats.total}</Typography>
                <Typography color="textSecondary">Total de Envios</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent className={classes.statsCard}>
                <CheckCircle className={classes.statsIcon} style={{ color: "#4caf50" }} />
                <Typography variant="h4">{stats.enviados}</Typography>
                <Typography color="textSecondary">Enviados</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent className={classes.statsCard}>
                <Assessment className={classes.statsIcon} style={{ color: "#9c27b0" }} />
                <Typography variant="h4">{stats.respondidos}</Typography>
                <Typography color="textSecondary">Respondidos</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent className={classes.statsCard}>
                <Error className={classes.statsIcon} color="secondary" />
                <Typography variant="h4">{stats.erros}</Typography>
                <Typography color="textSecondary">Erros</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Configurações */}
        <div className={classes.configSection}>
          <Typography variant="h6" gutterBottom>
            Ativar/Desativar Automações
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.lembrete24h}
                    onChange={() => handleConfigChange("lembrete24h")}
                    color="primary"
                  />
                }
                label="Lembrete 24h"
              />
              <Button
                size="small"
                onClick={() => handleEditTemplate("LEMBRETE_24H")}
              >
                Editar Template
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.lembrete2h}
                    onChange={() => handleConfigChange("lembrete2h")}
                    color="primary"
                  />
                }
                label="Lembrete 2h"
              />
              <Button
                size="small"
                onClick={() => handleEditTemplate("LEMBRETE_2H")}
              >
                Editar Template
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.nps}
                    onChange={() => handleConfigChange("nps")}
                    color="primary"
                  />
                }
                label="Pesquisa NPS"
              />
              <Button size="small" onClick={() => handleEditTemplate("NPS")}>
                Editar Template
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.reativacao30d}
                    onChange={() => handleConfigChange("reativacao30d")}
                    color="primary"
                  />
                }
                label="Reativação 30 dias"
              />
              <Button
                size="small"
                onClick={() => handleEditTemplate("REATIVACAO_30D")}
              >
                Editar Template
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.reativacao60d}
                    onChange={() => handleConfigChange("reativacao60d")}
                    color="primary"
                  />
                }
                label="Reativação 60 dias"
              />
              <Button
                size="small"
                onClick={() => handleEditTemplate("REATIVACAO_60D")}
              >
                Editar Template
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.reativacao90d}
                    onChange={() => handleConfigChange("reativacao90d")}
                    color="primary"
                  />
                }
                label="Reativação 90 dias"
              />
              <Button
                size="small"
                onClick={() => handleEditTemplate("REATIVACAO_90D")}
              >
                Editar Template
              </Button>
            </Grid>
          </Grid>
        </div>

        {/* Histórico */}
        <Typography variant="h6" gutterBottom style={{ marginTop: 32 }}>
          Histórico de Envios
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell>Data/Hora</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Resposta</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRowSkeleton columns={5} />
            ) : (
              <>
                {automacoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2">
                        Nenhum envio registrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  automacoes.map((automacao) => (
                    <TableRow key={automacao.id}>
                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {tipoIcons[automacao.tipo]}
                          {getTipoLabel(automacao.tipo)}
                        </div>
                      </TableCell>
                      <TableCell>{automacao.paciente?.name}</TableCell>
                      <TableCell>
                        {moment(automacao.dataEnvio).format("DD/MM/YYYY HH:mm")}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={automacao.status}
                          color={statusColors[automacao.status]}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {automacao.notaNps
                          ? `⭐ ${automacao.notaNps}/10`
                          : automacao.resposta || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </>
            )}
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Automacoes;
