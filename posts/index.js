const express = require("express");
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');

const app = express();
app.use(bodyParser.json());

const posts = {};
const getAllPosts = (req, res) => {
  res.send(posts);
};

const writeApost = (req, res)=>{
    const id = randomBytes(4).toString('hex');
    const {title }= req.body;
    posts[id]= {
        id, title
    }
    res.status(201).send(posts[id]);

}
app.get("/posts", getAllPosts);

app.post("/posts", writeApost);

app.listen(4000, () => {
  console.log("listing on port 4000");
});
