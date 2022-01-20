const express = require("express")
const axios = require("axios")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express();
app.use(bodyParser.json());
app.use(cors())

const events = [];

//
app.post("/event-bus/event",(req,resp)=>{
    console.log("received event")
    const event = req.body;// 
    events.push(event)

    axios.post("http://post_svc:4001/event-bus/event/listener",event).catch(e=>{
        console.log(e.message)
    })
    axios.post("http://comment_svc:4002/event-bus/event/listener",event).catch(e=>{
        console.log(e.message)
    })
    axios.post("http://query_svc:4003/event-bus/event/listener",event).catch(e=>{
        console.log(e.message)
    })

    resp.send({});
})
app.get("/event-bus/event",(req,resp)=>{
    resp.send(events);
})

app.listen(4005,()=>console.log("event bus started @ 4005"))