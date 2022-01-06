const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const uuid = require("uuid")

const app = express();
app.use(cors())
app.use(bodyParser.json())

const posts = {

}
app.get('/api/v1/blog/post',(req,resp)=>{
    resp.send(posts)
})
app.post('/api/v1/blog/post',(req,resp)=>{
    const { title } = req.body;
    const id = uuid.v4();
    posts[id] = {id,title}

    resp.status(201).send(posts[id])
})
app.listen(4001,()=>{
    console.log("post service running at 4001")
})