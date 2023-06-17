const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
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
const commentsByPostId = {

}
app.get('/posts/:id/comments', (req, res)=>{

    res.status(200).send(commentsByPostId[req?.params?.id]||[]);
})

app.post('/posts/:id/comments', (req, res)=>{
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const commentsForThisPost = commentsByPostId[req?.params?.id]||[];
    commentsForThisPost.push({id:commentId,content:content});
    commentsByPostId[req.params.id] = commentsForThisPost;
    res.status(201).send(commentsByPostId);

})

app.listen(4001, ()=>{
    console.log("Listening on Port 4001");
})

