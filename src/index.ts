import express from "express";
import { APIRouter } from "./routes/api-route";
import "./env";

const app = express();

app.use(express.static("web/"));

app.use("/api", APIRouter);

app.listen(8000, () => {
  console.log("Listening on http://127.0.0.1:8000");
});
