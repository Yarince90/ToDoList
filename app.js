const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

let items = [];

app.get('/', (req, res)=>{
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-us", options);
    res.render('list.ejs', {kindOfDay: day, newListItems: items});
});

app.post('/', (req, res)=>{
    let item = req.body.newItem;

    items.push(item);

    res.redirect('/');
})


app.listen(port, ()=>{
    console.log("Server is started on port: " + port);
});