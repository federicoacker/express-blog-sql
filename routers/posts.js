import { Router } from "express";
import express from "express";
import postsController from "../controllers/posts.js";
import validateCP from "../middlewares/validateCP.js";
import validateU from "../middlewares/validateU.js";
import checkId from "../middlewares/checkId.js";

const postsRouter = express.Router();
postsRouter.use(express.json());


postsRouter.get("/", postsController.index);

postsRouter.get("/:id", [checkId, postsController.show]);

postsRouter.post("/", [validateCP, postsController.store]);

postsRouter.put("/:slug", [validateCP, checkId, postsController.update]);

postsRouter.patch("/:slug", [validateU, checkId,  postsController.modify]);

postsRouter.delete("/:slug", [checkId ,postsController.destroy]);

export default postsRouter;