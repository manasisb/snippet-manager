const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();


const app = express();

// app.get("/test", function(req,res){
//     res.send("Hello Manasi here!")
// });

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());


app.use("/snippet", require("./router/snippetRouter"));
app.use("/auth",require("./router/userauth"));

app.get("/snippet", (req,res) =>{
    // res.json(req.body.code);
    res.send("Hey There!!!")
});

app.listen(5000, function(){
    console.log("Started server on port 5000");
});

// connect to mongoDB

mongoose.connect(process.env.MDB_CONNECT_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) return console.log(err);
    console.log("Connected to Mongo DB");
});


// "mongodb+srv://devhistry:SDhi2E8nN1vgTGM8@snippet-manager.spfov.mongodb.net/main?retryWrites=true&w=majority"