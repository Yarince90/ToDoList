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

//Customer List Schema
const listSchema = {
title: String,
items: [itemSchema]
};
const List = mongoose.model("List", listSchema);



//Items for testing DB connection
const wakeUp = new Item({
    name: "Wake Up"
});
const eat = new Item({
    name: "Eat"
});
const sleep = new Item({
    name: "Sleep"
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

//Dynamically creates To-Do-List page
app.get('/:listID', (req, res)=>{
    const requestedList = req.params.listID;
    
    //Looks for existing List
    List.findOne({title: requestedList}, (err, foundList)=>{
      if (!err && !foundList){
        const list = new List({
            title: requestedList,
            items: defaultItems
        });        
        list.save();
        console.log("No Matches found ...created new list ...");

        res.redirect('/' + requestedList);
      }
      else {
        console.log("List Found!");
        res.render('list', {listTitle: foundList.title, newListItems: foundList.items});
      }
    });
    
});

//PostsItems to corresponding To-Do-List
app.post('/', (req, res)=>{

    const itemName = req.body.newItem;
    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect('/');
});

app.post("/delete", (req, res)=>{
    const itemID = req.body.checkBox;

    Item.findByIdAndDelete(itemID, (err)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/');
            console.log("Item successfully removed!");
        }
    });
});


app.listen(port, ()=>{
    console.log("Server is started on port: " + port);
});