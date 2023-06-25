const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const keyWordForModeration = "orange";

const isCommentOk = (commentObj) => {
  let returnData = commentObj?.content.includes(keyWordForModeration)
    ? false
    : true;
    return returnData;
};

app.post("/events", async (req, res) => {
  console.log("Moderation Service received the event", req.body);
  const { type, data } = req.body;
  if (type === "CommentCreated") {
    let isCommentApproved = isCommentOk(data);
    data.status = isCommentApproved === true ? "approved" : "rejected";
    await axios
      .post("http:localhost:4005/events", {
        type: "CommentModerated",
        data: data,
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  res.status(200).send({ status: "Ok" });
});

app.listen(4003, () => {
  console.log("Moderation Service listening at 4003");
});
