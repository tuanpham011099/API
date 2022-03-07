const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const env = require("dotenv");
env.config();

const User = require("./routes/user");

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));


app.use("/user", User);

mongoose.connect(process.env.DB, { useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("App is running");
        })
    }).catch((error) => { console.log(error) })