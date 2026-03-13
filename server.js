import exp from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { userapp } from './apis/userapi.js';
import { authorapp } from './apis/authorapi.js';
import { adminapp } from './apis/adminapi.js';
import { commonapp } from './apis/commonapi.js';

config();

const app = exp();
const PORT = process.env.PORT || 5000;

//body parser
app.use(exp.json());
//cookie parser
app.use(cookieParser());
//path parser 
app.use("/user-api",userapp)
app.use("/author-api",authorapp)
app.use("/admin-api",adminapp)
app.use("/auth",commonapp)


//connect to mongodb server
async function connectToDb() {
    try {
        await connect(process.env.DB_URL);
        console.log("Connected to MongoDB successfully 🙏");

        //start server
        app.listen(PORT, () => console.log("server started at port " + PORT));

    } catch (err) {
        console.log("Error connecting to MongoDB:", err);
    }
}

connectToDb();
//error handling middleware
app.use((err, req, res, next) => {
    console.log("error occured", err.name);
    //validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: "error occured", error: err.message })
    }
    //cast error
    if (err.name === "CastError") {
        return res.status(400).json({ message: "error occured", err: err.message })
    }
    if (err.name === "MongoServerError") {
        return res.status(400).json({ message: "error occured", err: err.message })
    }
    if (err.code == 11000) {
        return res.status(400).json({ message: "duplicate key found", err: err.message })
    }
    if (err.name == "MongooseError") {
        return res.status(400).json({ message: "error", err: err.message })
    }
    //server error
    res.status(500).json({ message: "server side error", err: err.message })
});