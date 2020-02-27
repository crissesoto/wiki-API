const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('view engine', 'ejs');


// DATABASE

// connection
mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false, useCreateIndex: true});
// notified if we connect successfully
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("succesfully connected to DB");
});

// create article schema
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

// create a model from the article schema
const Article = mongoose.model("Article", articleSchema);

/////////////////////////// Rquest All Articles /////////////////////////////

// Chained route /articles handler 
app.route("/articles")
    // get all the articles in db = READ 
    .get(function(req, res) {
        // access all of the articles documents through our article model.
        Article.find(function (err, foundArticles) {
            if (!err){
                res.send(foundArticles)
            }else{
                res.send(err)
            };
        });
    })

    // post a new article into db = CREATE
    .post(function(req, res) {
        const data = req.body
        const {title, content} = data;
        console.log(data)
        // create new article / insert db
        const newArticle = new Article({ title: title, content: content });

        //save new article
        newArticle.save(function (err, newArticle) {
            if (!err){
                res.send(newArticle);
            }else{
                res.send(err);
            }
        });
    })

    // detele all the records from articles
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Succesfully deleted all articles!.");
            }else{
                res.send(err);
            };
        })

    });


/////////////////////////// Rquest One Specific Article /////////////////////////////

app.route("/articles/:article")
    .get(function (req, res) {
        const article = req.params.article;

        Article.findOne({ title: article }).exec(function (err, foundArticle) {
            if(foundArticle){
                res.send(foundArticle);
            }else if(err){
                res.send(err)
            }else{
                res.send("Article not found!.");
            };
        });

        
    })

    .put(function (req,res) {
        const article = req.params.article;
        const data = req.body;


        Article.updateOne(
            {title: article}, 
            data, 
            function (err, foundArticle) {
            if(!err){
                res.send("Succesfully update");
            }else{
                res.send(err)
            }
        }) 

        
    })
    .patch(function (req,res) {
        const article = req.params.article;
        const data = req.body;

        Article.updateOne(
            {title: article}, 
            { $set: data }, 
            function (err, foundArticle) {
                if(foundArticle){
                    res.send(foundArticle);
                }else{
                    res.send("Could not update article")
                }
        }) 
        
    })
    .delete(function (req,res) {
        const article = req.params.article;
        Article.deleteOne({ title: article }, function (err) {
            if(!err){
                res.send("Succesfully deleted article")
            }else{
                res.send(err)
            }
        });

        
    });


const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log(`Server started at port: ${PORT}`);
})