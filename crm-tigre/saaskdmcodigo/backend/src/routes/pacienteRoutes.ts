import express from "express";
import isAuth from "../middleware/isAuth";

import * as PacienteController from "../controllers/PacienteController";

const pacienteRoutes = express.Router();

pacienteRoutes.get("/pacientes", isAuth, PacienteController.index);

pacienteRoutes.get("/pacientes/:pacienteId", isAuth, PacienteController.show);

pacienteRoutes.post("/pacientes", isAuth, PacienteController.store);

pacienteRoutes.put("/pacientes/:pacienteId", isAuth, PacienteController.update);

pacienteRoutes.delete("/pacientes/:pacienteId", isAuth, PacienteController.remove);

pacienteRoutes.post(
  "/pacientes/convert/:contactId",
  isAuth,
  PacienteController.convertFromContact
);

export default pacienteRoutes;
