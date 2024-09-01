import app from "./app";
import { port } from "../config";
import { connectDB } from "./db";

connectDB().then(() => {
  console.log("Connected to database");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
