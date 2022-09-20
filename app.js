//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const petSchema = {
  title: String,
  content: String
};

const Pet = mongoose.model("Pet", petSchema);

///////////////////////////////////Requests Targetting all Pets////////////////////////

app.route("/Pets")

.get(function(req, res){
  Pet.find(function(err, foundPets){
    if (!err) {
      res.send(foundPets);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){

  const newPet = new Pet({
    title: req.body.title,
    content: req.body.content
  });

  newPet.save(function(err){
    if (!err){
      res.send("Successfully added a new Pet.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){

  Pet.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all Pets.");
    } else {
      res.send(err);
    }
  });
});

////////////////////////////////Requests Targetting A Specific Pet////////////////////////

app.route("/Pets/:PetTitle")

.get(function(req, res){

  Pet.findOne({title: req.params.PetTitle}, function(err, foundPet){
    if (foundPet) {
      res.send(foundPet);
    } else {
      res.send("No Pets matching that title was found.");
    }
  });
})

.put(function(req, res){

  Pet.update(
    {title: req.params.PetTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected Pet.");
      }
    }
  );
})

.patch(function(req, res){

  Pet.update(
    {title: req.params.PetTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated Pet.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Pet.deleteOne(
    {title: req.params.PetTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding Pet.");
      } else {
        res.send(err);
      }
    }
  );
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
