const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const uuid = require("uuid");
const { default: axios } = require("axios");

const app = express();
app.use(cors())
app.use(bodyParser.json())

const posts = {}
app.get("/api/v1/blog/post",(req,resp)=>{

    resp.send(posts);
})

app.post("/event-bus/event/listener",(req,resp)=>{
    const {type,data}=req.body
    console.log("Received event ",type)
    handleEvent(type,data)
    resp.send({})
})
const handleEvent = (type,data)=>{
    if(type == "PostCreated"){
        const {id,title} = data;
        posts[id] = {id,title,comments:[]}
        return
    }
    if(type == "CommentCreated"){
        const {postId,commentId,message} = data;
        const post = posts[postId];
        post.comments.push({commentId,message})
        return
    }

}

app.listen(4003,async()=>{
    const resp = await axios.get("http://event_svc:4005/event-bus/event")
    .catch(e=> console.log(e))

    const events = resp.data;
    for(let e of events){
        console.log("processing event:",e.type)
        handleEvent(e.type,e.data)
    }
    console.log("listening on port 4003")
})

