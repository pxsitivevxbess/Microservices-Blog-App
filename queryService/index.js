const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(bodyParser.json());

/*
{
    {postId:"", title:"", comment:[{id:"", content:""},{}]}

}
 */
const posts = {};
app.get("/posts", (req, res) => {
  res.status(200).send(posts);
});

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  } else if (type === "CommentCreated") {
    const { id, content, postId } = req.body.data;
    if (posts.hasOwnProperty(postId) !== true) {
      res.status(404).send("Post not found");
    }
    posts[postId].comments.push({ id, content, status: req.body?.status });
  } else if (type === "CommentUpdated") {
    const { id, postId, content, status } = req.body.data;
    const updatedComment = posts[postId].find((commentIterator) => {
      return commentIterator.id === id;
    });
    updatedComment.status = status;
    updatedComment.content = content;
    //CommentUpdated is generic,
    //we dont know what has been updated
    //hence we udpate everything from the body i.e status and content
  }
};
app.post("/events", (req, res) => {
  console.log("event reached query service", req.body);
  const { type, data } = req.body;
  handleEvent(type, data);
  res.status(200).send(posts);
});

app.listen(4002, async () => {
  console.log("Listening on 4002");
  try {
    const res = await axios.get("http://localhost:4005/events");
    for (let event of res.data) {
      console.log("Processing event:", event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
