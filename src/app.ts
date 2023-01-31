import express, { Application } from "express";

const app: Application = express();
app.use(express.json());

app.post("/movies");

app.get("/movies");

app.patch("/movies/:id");

app.delete("/movies/:id");

app.listen(3000, () => {
  console.log("Server is running!");
});
