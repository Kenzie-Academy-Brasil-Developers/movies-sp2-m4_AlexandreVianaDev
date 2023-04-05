import express, { Application } from "express";
import { startDatabase } from "./database";
import {
  deleteMovie,
  insertMoviesFormat,
  retrieveMovieById,
  retrieveMovies,
  updateMovie,
} from "./logic";
import { verifyIfIdExists, verifyIfNameExists } from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/movies", verifyIfNameExists, insertMoviesFormat);
app.get("/movies", retrieveMovies);
app.get("/movies/:id", verifyIfIdExists, retrieveMovieById);
app.patch("/movies/:id", verifyIfIdExists, verifyIfNameExists, updateMovie);
app.delete("/movies/:id", verifyIfIdExists, deleteMovie);

const PORT: number = 3000;
const runningMsg = `Server is running on http://localhost:${PORT}`;
app.listen(PORT, async () => {
  await startDatabase();
  console.log(runningMsg);
});
