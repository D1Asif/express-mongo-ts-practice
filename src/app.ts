import express, { Request, Response } from "express";
import cors from "cors";
import { StudentRoutes } from "./app/modules/student/student.route";

const app = express();
const port = 3000

// parser
app.use(express.json());
app.use(cors())

app.use('/api/v1/students', StudentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
})

export default app;