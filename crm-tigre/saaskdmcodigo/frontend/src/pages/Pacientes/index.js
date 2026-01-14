import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import api from "../../services/api";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import PacienteModal from "../../components/PacienteModal";
import ConfirmationModal from "../../components/ConfirmationModal";

import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import MainContainer from "../../components/MainContainer";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../../components/Can";
import { socketConnection } from "../../services/socket";

const reducer = (state, action) => {
  if (action.type === "LOAD_PACIENTES") {
    const pacientes = action.payload;
    const newPacientes = [];

    pacientes.forEach((paciente) => {
      const pacienteIndex = state.findIndex((p) => p.id === paciente.id);
      if (pacienteIndex !== -1) {
        state[pacienteIndex] = paciente;
      } else {
        newPacientes.push(paciente);
      }
    });

    return [...state, ...newPacientes];
  }

  if (action.type === "UPDATE_PACIENTE") {
    const paciente = action.payload;
    const pacienteIndex = state.findIndex((p) => p.id === paciente.id);

    if (pacienteIndex !== -1) {
      state[pacienteIndex] = paciente;
      return [...state];
    } else {
      return [paciente, ...state];
    }
  }

  if (action.type === "DELETE_PACIENTE") {
    const pacienteId = action.payload;
    const pacienteIndex = state.findIndex((p) => p.id === pacienteId);
    if (pacienteIndex !== -1) {
      state.splice(pacienteIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  customTableCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  filterContainer: {
    display: "flex",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  filterField: {
    minWidth: 200,
  },
}));

const getClassificacaoColor = (classificacao) => {
  switch (classificacao) {
    case "OURO":
      return "#FFD700";
    case "PRATA":
      return "#C0C0C0";
    case "BRONZE":
      return "#CD7F32";
    case "NOVO":
      return "#4CAF50";
    default:
      return "#757575";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "ATIVO":
      return "primary";
    case "INATIVO":
      return "default";
    case "BLOQUEADO":
      return "secondary";
    default:
      return "default";
  }
};

const Pacientes = () => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam, setSearchParam] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [classificacaoFilter, setClassificacaoFilter] = useState("");
  const [pacientes, dispatch] = useReducer(reducer, []);
  const [selectedPacienteId, setSelectedPacienteId] = useState(null);
  const [pacienteModalOpen, setPacienteModalOpen] = useState(false);
  const [deletingPaciente, setDeletingPaciente] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam, statusFilter, classificacaoFilter]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchPacientes = async () => {
        try {
          const { data } = await api.get("/pacientes", {
            params: {
              searchParam,
              pageNumber,
              status: statusFilter,
              classificacao: classificacaoFilter,
            },
          });
          dispatch({ type: "LOAD_PACIENTES", payload: data.pacientes });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
          setLoading(false);
        }
      };
      fetchPacientes();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber, statusFilter, classificacaoFilter]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketConnection({ companyId });

    socket.on(`company-${companyId}-paciente`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_PACIENTE", payload: data.paciente });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_PACIENTE", payload: +data.pacienteId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleOpenPacienteModal = () => {
    setSelectedPacienteId(null);
    setPacienteModalOpen(true);
  };

  const handleClosePacienteModal = () => {
    setSelectedPacienteId(null);
    setPacienteModalOpen(false);
  };

  const handleEditPaciente = (pacienteId) => {
    setSelectedPacienteId(pacienteId);
    setPacienteModalOpen(true);
  };

  const handleDeletePaciente = async (pacienteId) => {
    try {
      await api.delete(`/pacientes/${pacienteId}`);
      toast.success("Paciente deletado com sucesso");
    } catch (err) {
      toastError(err);
    }
    setDeletingPaciente(null);
    setSearchParam("");
    setPageNumber(1);
  };

  const loadMore = () => {
    setPageNumber((prevState) => prevState + 1);
  };

  const handleScroll = (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

  return (
    <MainContainer>
      <PacienteModal
        open={pacienteModalOpen}
        onClose={handleClosePacienteModal}
        aria-labelledby="form-dialog-title"
        pacienteId={selectedPacienteId}
      />
      <ConfirmationModal
        title={
          deletingPaciente
            ? `Deletar paciente ${deletingPaciente.nome}?`
            : "Deletar paciente?"
        }
        open={confirmOpen}
        onClose={setConfirmOpen}
        onConfirm={() => handleDeletePaciente(deletingPaciente.id)}
      >
        Tem certeza que deseja deletar este paciente? Esta ação não pode ser desfeita.
      </ConfirmationModal>
      <MainHeader>
        <Title>Pacientes</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder="Buscar paciente"
            type="search"
            value={searchParam}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
          />
          <Can
            role={user.profile}
            perform="pacientes:create"
            yes={() => (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenPacienteModal}
              >
                Novo Paciente
              </Button>
            )}
          />
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <div className={classes.filterContainer}>
        <FormControl className={classes.filterField}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="ATIVO">Ativo</MenuItem>
            <MenuItem value="INATIVO">Inativo</MenuItem>
            <MenuItem value="BLOQUEADO">Bloqueado</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.filterField}>
          <InputLabel>Classificação</InputLabel>
          <Select
            value={classificacaoFilter}
            onChange={(e) => setClassificacaoFilter(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="OURO">Ouro</MenuItem>
            <MenuItem value="PRATA">Prata</MenuItem>
            <MenuItem value="BRONZE">Bronze</MenuItem>
            <MenuItem value="NOVO">Novo</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Paper
        className={classes.mainPaper}
        variant="outlined"
        onScroll={handleScroll}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Nome</TableCell>
              <TableCell align="center">Telefone</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Classificação</TableCell>
              <TableCell align="center">Procedimentos</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {pacientes.map((paciente) => (
                <TableRow key={paciente.id}>
                  <TableCell align="center">{paciente.nome}</TableCell>
                  <TableCell align="center">{paciente.telefone}</TableCell>
                  <TableCell align="center">{paciente.email}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={paciente.status}
                      color={getStatusColor(paciente.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={paciente.classificacao}
                      size="small"
                      style={{
                        backgroundColor: getClassificacaoColor(
                          paciente.classificacao
                        ),
                        color: "#fff",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {paciente.numeroProcedimentos}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditPaciente(paciente.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <Can
                      role={user.profile}
                      perform="pacientes:delete"
                      yes={() => (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setDeletingPaciente(paciente);
                            setConfirmOpen(true);
                          }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton columns={7} />}
            </>
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Pacientes;
