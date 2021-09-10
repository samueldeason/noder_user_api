const express =require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRouter = require("./routes/users")
const authRouter = require("./routes/auth")

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, () => {
    console.log("Connected to MongoDB!")
});

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)

app.get("/", (req, res) => {
    res.send("Welcome to home page")
})


app.listen(process.env.PORT, () => console.log("Backend server is running!"))