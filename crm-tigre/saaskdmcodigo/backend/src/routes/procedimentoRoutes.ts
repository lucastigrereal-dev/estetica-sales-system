import express from "express";
import isAuth from "../middleware/isAuth";

import * as ProcedimentoController from "../controllers/ProcedimentoController";

const procedimentoRoutes = express.Router();

procedimentoRoutes.get("/procedimentos", isAuth, ProcedimentoController.index);

procedimentoRoutes.get(
  "/procedimentos/:procedimentoId",
  isAuth,
  ProcedimentoController.show
);

procedimentoRoutes.post("/procedimentos", isAuth, ProcedimentoController.store);

procedimentoRoutes.put(
  "/procedimentos/:procedimentoId",
  isAuth,
  ProcedimentoController.update
);

procedimentoRoutes.delete(
  "/procedimentos/:procedimentoId",
  isAuth,
  ProcedimentoController.remove
);

export default procedimentoRoutes;
