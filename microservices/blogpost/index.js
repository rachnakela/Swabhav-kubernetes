const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const uuid = require("uuid")
const axios = require("axios")

const app = express();
app.use(cors())
app.use(bodyParser.json())

const posts = {

}
app.get('/api/v1/blog/post',(req,resp)=>{
    resp.send(posts)
})
app.post('/api/v1/blog/post',async(req,resp)=>{
    
    const { title } = req.body;
    const id = uuid.v4();
    posts[id] = {id,title}

    
    resp.status(201).send(posts[id])
    await axios.post("http://event_svc:4005/event-bus/event",{
        type:"PostCreated",
        data:{id,title}
    }).catch(e=>console.log(e.message))
})

app.post("/event-bus/event/listener",(req,resp)=>{
    const {type}=req.body
    console.log("Received event ",type)
    resp.send({})
})

app.listen(4001,()=>{
    console.log("post service running at 4001")
})