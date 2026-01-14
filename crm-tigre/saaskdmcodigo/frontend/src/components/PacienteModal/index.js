import React, { useState, useEffect, useRef } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import api from "../../services/api";
import toastError from "../../errors/toastError";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginRight: theme.spacing(1),
    width: "100%",
  },
  btnWrapper: {
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

const PacienteSchema = Yup.object().shape({
  nome: Yup.string().min(2, "Muito curto!").required("Nome é obrigatório"),
  telefone: Yup.string().min(10, "Muito curto!").required("Telefone é obrigatório"),
  email: Yup.string().email("Email inválido"),
  cpf: Yup.string().matches(/^\d{11}$/, "CPF deve conter 11 dígitos"),
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const PacienteModal = ({ open, onClose, pacienteId }) => {
  const classes = useStyles();
  const isMounted = useRef(true);

  const initialState = {
    nome: "",
    telefone: "",
    whatsapp: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    genero: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    numeroProcedimentos: 0,
    procedimentoFavorito: "",
    status: "ATIVO",
    classificacao: "NOVO",
    observacoes: "",
    alergias: "",
    historicoMedico: "",
  };

  const [paciente, setPaciente] = useState(initialState);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchPaciente = async () => {
      if (!pacienteId) return;

      try {
        const { data } = await api.get(`/pacientes/${pacienteId}`);
        if (isMounted.current) {
          setPaciente(data);
        }
      } catch (err) {
        toastError(err);
      }
    };

    fetchPaciente();
  }, [pacienteId, open]);

  const handleClose = () => {
    onClose();
    setPaciente(initialState);
    setTabValue(0);
  };

  const handleSavePaciente = async (values) => {
    try {
      if (pacienteId) {
        await api.put(`/pacientes/${pacienteId}`, values);
        toast.success("Paciente atualizado com sucesso");
      } else {
        await api.post("/pacientes", values);
        toast.success("Paciente criado com sucesso");
      }
      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle id="form-dialog-title">
        {pacienteId ? "Editar Paciente" : "Novo Paciente"}
      </DialogTitle>
      <Formik
        initialValues={paciente}
        enableReinitialize={true}
        validationSchema={PacienteSchema}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            handleSavePaciente(values);
            actions.setSubmitting(false);
          }, 400);
        }}
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Dados Pessoais" />
              <Tab label="Endereço" />
              <Tab label="Histórico Médico" />
            </Tabs>

            <DialogContent dividers>
              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      label="Nome Completo"
                      name="nome"
                      error={touched.nome && Boolean(errors.nome)}
                      helperText={touched.nome && errors.nome}
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="Telefone"
                      name="telefone"
                      error={touched.telefone && Boolean(errors.telefone)}
                      helperText={touched.telefone && errors.telefone}
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="WhatsApp"
                      name="whatsapp"
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="Email"
                      name="email"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="CPF"
                      name="cpf"
                      error={touched.cpf && Boolean(errors.cpf)}
                      helperText={touched.cpf && errors.cpf}
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="Data de Nascimento"
                      name="dataNascimento"
                      type="date"
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" margin="dense" className={classes.textField}>
                      <InputLabel>Gênero</InputLabel>
                      <Field as={Select} name="genero" label="Gênero">
                        <MenuItem value="">Selecione</MenuItem>
                        <MenuItem value="Masculino">Masculino</MenuItem>
                        <MenuItem value="Feminino">Feminino</MenuItem>
                        <MenuItem value="Outro">Outro</MenuItem>
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" margin="dense" className={classes.textField}>
                      <InputLabel>Status</InputLabel>
                      <Field as={Select} name="status" label="Status">
                        <MenuItem value="ATIVO">Ativo</MenuItem>
                        <MenuItem value="INATIVO">Inativo</MenuItem>
                        <MenuItem value="BLOQUEADO">Bloqueado</MenuItem>
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="Número de Procedimentos"
                      name="numeroProcedimentos"
                      type="number"
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      label="Procedimento Favorito"
                      name="procedimentoFavorito"
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      label="Endereço"
                      name="endereco"
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="Cidade"
                      name="cidade"
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Field
                      as={TextField}
                      label="Estado"
                      name="estado"
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Field
                      as={TextField}
                      label="CEP"
                      name="cep"
                      variant="outlined"
                      margin="dense"
                      className={classes.textField}
                    />
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      label="Alergias"
                      name="alergias"
                      variant="outlined"
                      margin="dense"
                      multiline
                      rows={3}
                      className={classes.textField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      label="Histórico Médico"
                      name="historicoMedico"
                      variant="outlined"
                      margin="dense"
                      multiline
                      rows={3}
                      className={classes.textField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      label="Observações"
                      name="observacoes"
                      variant="outlined"
                      margin="dense"
                      multiline
                      rows={3}
                      className={classes.textField}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary" disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                disabled={isSubmitting}
                variant="contained"
                className={classes.btnWrapper}
              >
                {pacienteId ? "Salvar" : "Adicionar"}
                {isSubmitting && (
                  <CircularProgress size={24} className={classes.buttonProgress} />
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default PacienteModal;
