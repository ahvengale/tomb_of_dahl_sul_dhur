import express from "express"
import * as path from "path"
import helmet from "helmet"

import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const port = 3000
//security middleware so I dont have to see CORS shenanigans

app.use(helmet({
    contentSecurityPolicy: false,
}
))
app.use(helmet.noSniff())

//Express middleware
/*
    Express middleware lets us provide all our local urls/assets with an anonymous url. 
    we will reference anything from /js as /static and anything from /res as /models even though that directory doesnt exist.
*/
// app.use('/static', express.static(path.join(__dirname, '/js'))) //virtual directory routing /static routs to local /js and sending it to client
app.use('/models', express.static(path.join(__dirname, '/res'))) //same idea with /models. This is providing all of the model objects from /res
app.use('/dist', express.static(path.join(__dirname, '/dist')))


express.static.mime.define({ 'application/javascript': ['js'] }); //no idea if this is doing anything... 
express.static.mime.define({ 'text/html': ['html'] });
// respond with our index file when a GET request is made to the homepage
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    //__dirname is our dynamic root path
    res.sendFile(path.join(__dirname, 'dist/index.html'))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})