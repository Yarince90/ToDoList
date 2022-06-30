const express = require('express');
const bodyParser = require('body-parser');
const date = require (__dirname + '/date.js');
const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = [];
const workItems = [];

app.get('/', (req, res)=>{
    let day = date.getDate();
    res.render('list.ejs', {listTitle: day, newListItems: items});
});

app.get('/work', (req, res)=>{
    res.render('list.ejs', {listTitle: "Work List", newListItems: workItems})
});

app.post('/', (req, res)=>{
    let item = req.body.newItem;

    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect('/work');
    }
    else{
        items.push(item);
        res.redirect('/');
    }
});



app.listen(port, ()=>{
    console.log("Server is started on port: " + port);
});