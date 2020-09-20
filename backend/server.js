//importing
const express = require("express");
const mongoose = require("mongoose");
const dbConfig = require("./db.js");
import Message from "./models/dbMessage.js";
import Pusher from 'pusher';
import cors from 'cors';
import Room from './models/room.js';

//app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1069887",
  key: "2cb6ce6c7e4396a5ec14",
  secret: "a912232faad271ec07fa",
  cluster: "eu",
  encrypted: true,
});

//middleware
app.use(express.json());
app.use(cors());

//DB config
const connectionUrl =
  "mongodb+srv://username:password@cluster0.onrry.mongodb.net/dbname?retryWrites=true&w=majority";
// mongoose.Promise = global.Promise;
mongoose
  .connect(connectionUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database sucessfully connected!");
    },
    (error) => {
      console.log("Could not connect to database : " + error);
    }
  );


const db = mongoose.connection;

db.once("open", () => {
  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received
      });
    } else {
      console.log("Error triggering pusher");
    }
  });
});

db.once("open", () => {
  const roomCollection = db.collection("rooms");
  const changeStream = roomCollection.watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const roomDetails = change.fullDocument;
      pusher.trigger("room", "inserted", {
        name: roomDetails.name,
      });
    } else {
      console.log("Error triggering pusher");
    }
  });
});


//api routes
app.get("/", (req, res) => res.status(200).send("Hello world"));

app.post("/message/new", (req, res) => {
  const dbMessage = req.body;

  Message.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/messages/sync", (req, res) => {
  Message.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post('/rooms/new', (req, res) => {
  const roomData = req.body;

Room.create(roomData, (err, data) => {
  if(err){
    res.status(500).send(err);
  }else{
    res.status(201).send(data);
  }
});

});

app.get('/rooms/sync', (req, res) => {
  Room.find((err, data) => {
    if(err){
      res.status(500).send(err);
    }else{ 
      res.status(200).send(data);
    }
  })
})

app.get('/rooms/sync/:id', (req, res)=>{
  Room.findById(req.params.id, (err, data)=>{
    if(err){
      res.status(500).send(err);
    }else{
      res.status(200).send(data);
    }
  })
})

//listener
app.listen(port, () => console.log(`Listening on localhost:${port}`));
