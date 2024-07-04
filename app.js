import express from "express";
import router from "./routes/api.js";
import connection from "./conn.js";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/", router)
app.use((req,res ) => {
    res.status(404).json({message : "Page not found"})
})

connection();

app.listen( env.APP_PORT, () => console.log("Listening on port 3000"))