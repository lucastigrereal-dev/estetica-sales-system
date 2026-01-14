import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Button,
  makeStyles,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useHistory } from "react-router-dom";

moment.locale("pt-br");
const localizer = momentLocalizer(moment);

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(2),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  calendar: {
    height: "calc(100vh - 250px)",
  },
}));

const statusColors = {
  AGENDADO: "#f39c12",
  CONFIRMADO: "#3498db",
  REALIZADO: "#27ae60",
  CANCELADO: "#e74c3c",
  NO_SHOW: "#95a5a6"
};

const Agendamentos = () => {
  const classes = useStyles();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [agendamentos, setAgendamentos] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  useEffect(() => {
    if (agendamentos.length > 0) {
      const formattedEvents = agendamentos.map((agendamento) => {
        const [ano, mes, dia] = agendamento.dataAgendamento.split("-");
        const [horaInicio, minInicio] = agendamento.horaInicio.split(":");
        const [horaFim, minFim] = agendamento.horaFim.split(":");

        return {
          id: agendamento.id,
          title: `${agendamento.paciente?.name} - ${agendamento.procedimento?.nome}`,
          start: new Date(ano, mes - 1, dia, horaInicio, minInicio),
          end: new Date(ano, mes - 1, dia, horaFim, minFim),
          resource: agendamento,
        };
      });
      setEvents(formattedEvents);
    }
  }, [agendamentos]);

  const fetchAgendamentos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/agendamentos");
      setAgendamentos(data.agendamentos);
    } catch (err) {
      toast.error("Erro ao carregar agendamentos");
    }
    setLoading(false);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    setDetailsModalOpen(true);
  };

  const handleConfirmar = async () => {
    try {
      await api.post(`/agendamentos/${selectedEvent.id}/confirmar`);
      toast.success("Agendamento confirmado");
      fetchAgendamentos();
      setDetailsModalOpen(false);
    } catch (err) {
      toast.error("Erro ao confirmar agendamento");
    }
  };

  const handleCancelar = async () => {
    try {
      await api.post(`/agendamentos/${selectedEvent.id}/cancelar`, {
        motivoCancelamento: "Cancelado pelo sistema",
      });
      toast.success("Agendamento cancelado");
      fetchAgendamentos();
      setDetailsModalOpen(false);
    } catch (err) {
      toast.error("Erro ao cancelar agendamento");
    }
  };

  const handleMarcarRealizado = async () => {
    try {
      await api.post(`/agendamentos/${selectedEvent.id}/marcar-realizado`);
      toast.success("Agendamento marcado como realizado");
      fetchAgendamentos();
      setDetailsModalOpen(false);
    } catch (err) {
      toast.error("Erro ao marcar como realizado");
    }
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = statusColors[event.resource.status] || "#3174ad";
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  return (
    <MainContainer>
      <Dialog
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                <strong>Paciente:</strong> {selectedEvent.paciente?.name}
              </Typography>
              <Typography variant="body1">
                <strong>Procedimento:</strong> {selectedEvent.procedimento?.nome}
              </Typography>
              <Typography variant="body1">
                <strong>Data:</strong> {selectedEvent.dataAgendamento}
              </Typography>
              <Typography variant="body1">
                <strong>Horário:</strong> {selectedEvent.horaInicio} -{" "}
                {selectedEvent.horaFim}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong>{" "}
                <Chip
                  label={selectedEvent.status}
                  style={{
                    backgroundColor: statusColors[selectedEvent.status],
                    color: "white",
                  }}
                  size="small"
                />
              </Typography>
              <Typography variant="body1">
                <strong>Preço Final:</strong> R${" "}
                {selectedEvent.precoFinal?.toFixed(2)}
              </Typography>
              {selectedEvent.notas && (
                <Typography variant="body1">
                  <strong>Notas:</strong> {selectedEvent.notas}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              {selectedEvent.status === "AGENDADO" && (
                <Button onClick={handleConfirmar} color="primary">
                  Confirmar
                </Button>
              )}
              {(selectedEvent.status === "AGENDADO" ||
                selectedEvent.status === "CONFIRMADO") && (
                <>
                  <Button onClick={handleMarcarRealizado} color="primary">
                    Marcar Realizado
                  </Button>
                  <Button onClick={handleCancelar} color="secondary">
                    Cancelar
                  </Button>
                </>
              )}
              <Button onClick={() => setDetailsModalOpen(false)}>Fechar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <MainHeader>
        <Title>Agendamentos</Title>
        <MainHeaderButtonsWrapper>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push("/agendamentos/novo")}
          >
            <Add /> Novo Agendamento
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <div className={classes.calendar}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            messages={{
              next: "Próximo",
              previous: "Anterior",
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia",
            }}
            views={["month", "week", "day"]}
            defaultView="week"
          />
        </div>
      </Paper>
    </MainContainer>
  );
};

export default Agendamentos;
