import React, { useState, useEffect, useReducer } from "react";
import {
  Button,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip
} from "@material-ui/core";
import { Edit, DeleteOutline, Add } from "@material-ui/icons";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import ProcedimentoModal from "../../components/ProcedimentoModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import { toast } from "react-toastify";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
}));

const Procedimentos = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [procedimentos, setProcedimentos] = useState([]);
  const [selectedProcedimento, setSelectedProcedimento] = useState(null);
  const [procedimentoModalOpen, setProcedimentoModalOpen] = useState(false);
  const [deletingProcedimento, setDeletingProcedimento] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    fetchProcedimentos();
  }, []);

  const fetchProcedimentos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/procedimentos");
      setProcedimentos(data.procedimentos);
    } catch (err) {
      toast.error("Erro ao carregar procedimentos");
    }
    setLoading(false);
  };

  const handleOpenProcedimentoModal = () => {
    setSelectedProcedimento(null);
    setProcedimentoModalOpen(true);
  };

  const handleCloseProcedimentoModal = () => {
    setSelectedProcedimento(null);
    setProcedimentoModalOpen(false);
  };

  const handleEditProcedimento = (procedimento) => {
    setSelectedProcedimento(procedimento);
    setProcedimentoModalOpen(true);
  };

  const handleDeleteProcedimento = async (procedimentoId) => {
    try {
      await api.delete(`/procedimentos/${procedimentoId}`);
      toast.success("Procedimento deletado com sucesso");
      fetchProcedimentos();
    } catch (err) {
      toast.error("Erro ao deletar procedimento");
    }
    setDeletingProcedimento(null);
  };

  const handleSaveProcedimento = () => {
    fetchProcedimentos();
    handleCloseProcedimentoModal();
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={deletingProcedimento && `Deletar ${deletingProcedimento.nome}?`}
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => handleDeleteProcedimento(deletingProcedimento.id)}
      >
        Esta ação não pode ser desfeita.
      </ConfirmationModal>
      <ProcedimentoModal
        open={procedimentoModalOpen}
        onClose={handleCloseProcedimentoModal}
        onSave={handleSaveProcedimento}
        procedimentoId={selectedProcedimento?.id}
      />
      <MainHeader>
        <Title>Procedimentos</Title>
        <MainHeaderButtonsWrapper>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenProcedimentoModal}
          >
            <Add /> Adicionar Procedimento
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Duração (min)</TableCell>
              <TableCell>Preço Padrão</TableCell>
              <TableCell>Preço Promocional</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {loading ? (
                <TableRowSkeleton columns={7} />
              ) : (
                <>
                  {procedimentos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2">
                          Nenhum procedimento cadastrado
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    procedimentos.map((procedimento) => (
                      <TableRow key={procedimento.id}>
                        <TableCell>{procedimento.nome}</TableCell>
                        <TableCell>{procedimento.categoria || "-"}</TableCell>
                        <TableCell>{procedimento.duracaoMinutos}</TableCell>
                        <TableCell>
                          R$ {procedimento.precoPadrao?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {procedimento.precoPromocional > 0
                            ? `R$ ${procedimento.precoPromocional.toFixed(2)}`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={procedimento.ativo ? "Ativo" : "Inativo"}
                            color={procedimento.ativo ? "primary" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleEditProcedimento(procedimento)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setDeletingProcedimento(procedimento);
                              setConfirmModalOpen(true);
                            }}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </>
              )}
            </>
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Procedimentos;
