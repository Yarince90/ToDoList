const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require (__dirname + '/date.js');

const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Connects to Mongoose Data Base
mongoose.connect("mongodb://localhost:27017/toDoListDB", {useNewUrlParser: true});

//Mongoose DB Item Schema
const itemSchema = new mongoose.Schema ({
    name: {
        type: String,
        require: [true, "Item name cannot be empty"]
    }
});

const Item = mongoose.model("Item", itemSchema);

//Items for testing DB connection
const wakeUp = new Item({
    name: "Wake Up"
});
const eat = new Item({
    name: "eat"
});
const sleep = new Item({
    name: "sleep"
});
const defaultItems = [wakeUp, eat, sleep];




//Loads Main To-Do List page
app.get('/', (req, res)=>{
    //Sets todays date
    let day = date.getDate();

    //Look for Items in DB
    Item.find({}, (err, foundItems)=>{

        //Save default data for testing if there is none, else it loads data
        if(foundItems.length === 0){
            Item.insertMany(defaultItems, (err)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Items successfully added!");
                }
            });
            res.redirect('/');
        }
        else{
            res.render('list.ejs', {listTitle: day, newListItems: foundItems});
        }
    });
});

//Loads Work To-Do-List
app.get('/work', (req, res)=>{
    res.render('list.ejs', {listTitle: "Work List", newListItems: workItems})
});

//PostsItems to corresponding To-Do-List
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