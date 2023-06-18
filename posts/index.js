const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const posts = {};
const getAllPosts = (req, res) => {
  res.send(posts);
};

const writeApost = async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };

  //Notify Event Bus
  await axios
    .post("http://localhost:4005/events", {
      type: "PostCreated",
      data: {
        id: id,
        title: title,
      },
    })
    .catch((err) => {
      console.log(err.message);
    });
  res.status(201).send(posts[id]);
};
app.get("/posts", getAllPosts);

app.post("/posts", writeApost);

app.post("/events", (req, res) => {
  console.log("Post Service Received", req.body);
  res.status(200).send({ status: "Ok" });
});

app.listen(4000, () => {
  console.log("listing on port 4000");
});
