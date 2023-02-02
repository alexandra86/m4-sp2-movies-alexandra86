import express, { Application } from "express";
import { startDatabase } from "./database";
import {
  createMovies,
  deleteMovies,
  listAllMovies,
  rescueMovies,
  updatesAllMovieData,
} from "./functions";
import { ensureMoviesExists } from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/movies", createMovies);

app.get("/movies", listAllMovies);

app.get("/movies/:id", ensureMoviesExists, rescueMovies);

app.put("/movies/:id", ensureMoviesExists, updatesAllMovieData);

app.delete("/movies/:id", ensureMoviesExists, deleteMovies);

app.listen(3000, async () => {
  await startDatabase();
  console.log("Server is running!");
});
