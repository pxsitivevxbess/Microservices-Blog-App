const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

/*{
    "status" key in comment object was added for Implementing Moderation feature
    key1: array[{id: , content: ,status:'' },{}.....]
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
  commentsForThisPost.push({
    id: commentId,
    content: content,
    status: "pending",
  });
  commentsByPostId[req.params.id] = commentsForThisPost;

  await axios
    .post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content: content,
        postId: req.params.id,
        status: "pending",
      },
    })
    .catch((err) => {
      console.log(err.message);
    });
  res.status(201).send(commentsByPostId);
});

app.post("/events", async (req, res) => {
  console.log("Comments Service received the event", req.body);
  const { data, type } = req.body;
  if (type === "CommentModerated") {
    if (commentsByPostId.hasOwnProperty(data?.postId)) {
     const {postId, id, status} = data;
      const commentModerated = commentsByPostId[postId].find(commentIterator=>{
        return commentIterator.id === id;
      })
      commentModerated.status = status;

      await axios.post('http://localhost:4005/events',{
        type:"CommentUpdated",
        data: data
      }).catch(err=>{
        console.log(err.message);
      })
    }
  }

  res.status(200).send({ status: "Ok" });
});

app.listen(4001, () => {
  console.log("Listening on Port 4001");
});
