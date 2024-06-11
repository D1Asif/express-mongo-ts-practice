import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { StudentRoutes } from "./app/modules/student/student.route";
import { UserRoutes } from "./app/modules/user/user.router";
import globalErrorHandler from "./app/middlewares/GlobalErrorHandler";

const app = express();
const port = 3000

// parser
app.use(express.json());
app.use(cors())

app.use('/api/v1/students', StudentRoutes);
app.use('/api/v1/users', UserRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
})

app.use(globalErrorHandler);

export default app;