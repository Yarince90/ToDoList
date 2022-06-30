const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res)=>{
    res.send("Server is Up and Running! :)");
});

app.listen(port, ()=>{
    console.log("Server is started on port: " + port);
});