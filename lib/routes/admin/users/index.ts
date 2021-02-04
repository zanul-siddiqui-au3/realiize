// NPM Deps
import * as express from "express";
import { Middleware } from "../../../services/middleware";

// Internal Deps
import { adminUsersRoutes } from "./routes";
const middleware = new Middleware();
export class adminUsersRouter {
  router: express.Router;
  constructor() {
    this.router = express.Router();
    this.router
      .get("/", adminUsersRoutes.get)
      .get("/:id" , adminUsersRoutes.getOne)
  }
}