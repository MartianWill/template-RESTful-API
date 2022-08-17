const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

/*****************************mongoose*****************************/

const userName = "";
const password = "";
const database = "wikiDB";
const options = {useNewUrlParser: true, useUnifiedTopology: true};

const uri = `mongodb+srv://${userName}:${password}@cluster0.nvecimf.mongodb.net/${database}?retryWrites=true&w=majority`;

mongoose.connect(uri,options,() => console.log("Mongoose is connected"));

const articleSchema = new mongoose.Schema({
    title: {type: String, required: [true,"title is required"]},
    content: String
})

const Article = mongoose.model('Article', articleSchema);

/*****************************RESTful express main*****************************/

app.route('/articles')
    .get((req,res) => {
        Article.find((err, foundArticles)=> {
            if (err) {
                res.send(err);
            } else {
                res.send(foundArticles);   
            }
        });
    })
    .post((req,res) => {

        const newArticle = new Article({
            title: req.body.title,
            content:req.body.content
        });
    
        newArticle.save((err) => {
            if(err){
                res.send(err);
            } else {
                res.send("successfully added a new article");
            }
        });
    })
    .delete((req,res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("successfully deleted all articles");
            } else {
                res.send(err);
            }
        });
    });

app.route('/articles/:articleTitle')
    .get((req,res) => {
        Article.findOne({title: req.params.articleTitle},(err,foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles found");
            }
        });
    })
    .put((req,res) => {
        Article.updateOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},(err) => {
                if(!err){res.send("successfully updated article")}
            });
    })
    .patch((req,res) => {
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},(err) => {
                if(!err) {res.send("successfully updated article")}
            }
        );
    })
    .delete((req,res) => {
        Article.deleteOne(
            {title: req.params.articleTitle},(err) => {
                if(!err){
                    res.send("successfully deleted");
                } else {res.send(err);}
            }
        );
    });

app.listen(port,() => {
    console.log(`connected to local port: ${port}`);
})

