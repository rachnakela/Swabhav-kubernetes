const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const uuid = require("uuid")
const axios = require("axios")

const app = express();
app.use(cors())
app.use(bodyParser.json())

const postsWithComments = {

}
app.get('/api/v1/blog/post/:postId/comments',(req,resp)=>{
    const postId = req.params.postId
    const comments = postsWithComments[postId]||[]
    resp.send(comments)
})
app.post('/api/v1/blog/post/:postId/comments',async (req,resp)=>{
    const commentId = uuid.v4();
    const { message } = req.body;

    const postId = req.params.postId;
    const comments = postsWithComments[postId] || []
    
    comments.push({commentId,message})
    postsWithComments[postId] = comments

    await axios.post("http://event_svc:4005/event-bus/event",{
        type:"CommentCreated",
        data:{postId,commentId,message}
    }).catch(e=>console.log(e.message))

    resp.status(201).send({commentId,message})
})

app.post("/event-bus/event/listener",(req,resp)=>{
    const {type}=req.body
    console.log("Received event ",type)
    resp.send({})
})

app.listen(4002,()=>{
    console.log("comment service running at 4002")
})