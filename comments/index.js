const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

/*{
    key1: array[{id: , content: },{}.....]
    key2: array[{},{},....]
    .
    .
    .
}
Key represents postId, array of object represents comments on that post. Each object represents one comment object
Each object of array has two things id: "unique Id of comment" and content: "Content of the comment"
*/
const commentsByPostId = {};
app.get("/posts/:id/comments", (req, res) => {
  res.status(200).send(commentsByPostId[req?.params?.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const commentsForThisPost = commentsByPostId[req?.params?.id] || [];
  commentsForThisPost.push({ id: commentId, content: content });
  commentsByPostId[req.params.id] = commentsForThisPost;

  await axios
    .post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content: content,
        postId: req.params.id,
      },
    })
    .catch((err) => {
      console.log(err.message);
    });
  res.status(201).send(commentsByPostId);
});

app.post("/events", (req, res) => {
  console.log("Comments Service received the event", req.body);

  res.status(200).send({ status: "Ok" });
});

app.listen(4001, () => {
  console.log("Listening on Port 4001");
});
