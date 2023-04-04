import express, { Application, Request, Response } from "express";
import { startDatabase } from "./database";

const app: Application = express();
app.use(express.json());

// app.post("/movies", insertQuery)

const PORT: number = 3000;
const runningMsg = `Server is running on http://localhost:${PORT}`;
app.listen(PORT, async () => {
  await startDatabase();
  console.log(runningMsg);
});
