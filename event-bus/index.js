const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

let eventsDb = [];
app.post("/events", async (req, res) => {
  console.log("event reached event bus", req.body);
  const event = req.body;
  eventsDb.push(event);
  await axios.post("http://localhost:4000/events", event).catch((err) => {
    console.log(err.message);
  });
  await axios.post("http://localhost:4001/events", event).catch((err) => {
    console.log(err.message);
  });
  await axios.post("http://localhost:4002/events", event).catch((err) => {
    console.log(err.message);
  });
  if(event?.type === CommentCreated)
  {
    await axios.post("http://localhost:4003/events",event).catch(err=>{
      console.log(err.message);
    })
  }

  res.send({ status: "ok" });
});

app.get("/events", (req, res)=>{
  res.send(eventsDb).status("Ok");
})

app.listen(4005, () => {
  console.log("Listening on 4005");
});
