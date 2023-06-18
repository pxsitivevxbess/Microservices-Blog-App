const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

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

app.post("/events", (req, res) => {

    console.log("event reached query service", req.body);
  const { type, data } = req.body;
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  } else {
    const {id, content, postId} = req.body.data;
    if(posts.hasOwnProperty(postId)===true){
    posts[postId].comments.push({ id, content });
    }
  }
  res.status(200).send(posts);
});

app.listen(4002, () => {
  console.log("Listening on 4002");
});
