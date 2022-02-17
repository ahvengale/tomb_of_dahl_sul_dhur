const express = require("express")
const path = require("path")
const fs = require("fs")
const helmet = require("helmet")


const app = express()
const port = 3000
//security middleware so I dont have to see CORS shenanigans

app.use(helmet({
    contentSecurityPolicy: false,
}
))

//Express middleware
/*
    Express middleware lets us provide all our local urls/assets with an anonymous url. 
    we will reference anything from /js as /static and anything from /res as /models even though that directory doesnt exist.
*/
app.use('/static', express.static(path.join(__dirname, '/js'))) //virtual directory routing /static routs to local /js and sending it to client
app.use('/models', express.static(path.join(__dirname, '/res'))) //same idea with /models. This is providing all of the model objects from /res



// respond with our index file when a GET request is made to the homepage
app.get('/', (req, res) => {
    //__dirname is our dynamic root path
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})