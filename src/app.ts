import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { StudentRoutes } from "./app/modules/student/student.route";
import { UserRoutes } from "./app/modules/user/user.router";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";

const app = express();
const port = 3000

// parser
app.use(express.json());
app.use(cors())

app.use('/api/v1', router);

const test = async (req: Request, res: Response) => {
  const a = 10;
  res.send("Test route");
}

app.get('/', test);

app.use(globalErrorHandler);

app.use(notFound);

export default app;