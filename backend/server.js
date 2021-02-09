import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as socketio from "socket.io";
import http from "http";
import router from "./router.js";
// constants
const port = process.env.PORT || 7000;

//  app init
// const io: socketio.Server = new socketio.Server();
// io.attach(server);

const app = express();
// middlewares
app.use(express.json());
app.use(cors());
app.use(router);

const server = http.createServer(app);
// const io = socketio(server);
const io = new socketio.Server({
  cors: {
    origin: "*"
  }
});
io.attach(server);

let count = null;
let dataArray = [];

// server side socket creation
io.on("connection", socket => {
  console.log(`new user is connected`);
  count = count + 1;

  // emit for client side
  socket.emit("newMessage", {
    data: "Hello world"
  });

  // listen to client message
  socket.on("newMessage", newMessage => {
    console.log("new-message -->", newMessage);
    dataArray.push(newMessage);
    if (dataArray.length !== count - 1) {
      // some database stuffs here i.e saving to database
      // clearing the dataArray
      // not re-assigning count
      // emits again
      // socket.emit("newMessage", {
      //   data: "Hello world"
      // });
      //  to save time the it has been left but the same database coonection is done for task2.
    }
    console.log("done");
    console.log("data-array", dataArray.length);
    console.log("count", count);
  });

  socket.on("disconnect", () => {
    console.log("diconnected from user");
    count--;
  });
});

server.listen(port, () => console.log(`server is running at port ${port}`));
