import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  },
  info: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(0.5),
  },
  icon: {
    marginRight: theme.spacing(1),
    fontSize: 18,
  },
  chipContainer: {
    display: "flex",
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
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

const PacienteCard = ({ paciente, onEdit }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card} variant="outlined">
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="flex-start">
          <Grid item xs={10}>
            <Typography className={classes.title} gutterBottom>
              {paciente.nome}
            </Typography>
          </Grid>
          <Grid item xs={2} style={{ textAlign: "right" }}>
            {onEdit && (
              <IconButton size="small" onClick={() => onEdit(paciente.id)}>
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Grid>
        </Grid>

        <div className={classes.chipContainer}>
          <Chip
            label={paciente.status}
            color={getStatusColor(paciente.status)}
            size="small"
          />
          <Chip
            label={paciente.classificacao}
            size="small"
            style={{
              backgroundColor: getClassificacaoColor(paciente.classificacao),
              color: "#fff",
            }}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          {paciente.telefone && (
            <div className={classes.info}>
              <PhoneIcon className={classes.icon} />
              <Typography variant="body2">{paciente.telefone}</Typography>
            </div>
          )}

          {paciente.email && (
            <div className={classes.info}>
              <EmailIcon className={classes.icon} />
              <Typography variant="body2">{paciente.email}</Typography>
            </div>
          )}

          {paciente.numeroProcedimentos !== undefined && (
            <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
              Procedimentos: {paciente.numeroProcedimentos}
            </Typography>
          )}

          {paciente.procedimentoFavorito && (
            <Typography variant="body2" color="textSecondary">
              Favorito: {paciente.procedimentoFavorito}
            </Typography>
          )}

          {paciente.observacoes && (
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ marginTop: 8, fontStyle: "italic" }}
            >
              {paciente.observacoes}
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PacienteCard;
