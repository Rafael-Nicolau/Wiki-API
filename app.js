//jshint asi:true

const express = require('express')
const dotenv = require('dotenv').config()
const app = express()
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require('mongoose')
const port = process.env.PORT || 3000
const my_api = process.env.MY_APIKEY

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"))

mongoose.connect("mongodb+srv://"+my_api+"@cluster0.laqkg.mongodb.net/wikiDB?retryWrites=true&w=majority");

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("article", articleSchema)


//Request targeting all articles
app.route("/articles")

    .get(function(req, res){
        Article.find( function(err, foundArticles){
            !err?res.send(foundArticles):res.send(err);
        })
    })

    .post(function (req, res) {

        const newArticle = new Article( {
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save(function (err) {
            !err?res.send("Article add successfully"):res.send("An error ocurred: "+err)
        })
    })

    .delete(function(req, res) {

        Article.deleteMany(function (err) {
            !err?res.send("Successfully deleted all articles"):res.send("An error ocurred: "+err)        
        })
    
        const { id } = req.params
        res.send(`Delete record with id ${id}`)
    })

//Request targeting specific articles
app.route("/articles/:articleTitle")

    .get(function(req, res){
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
            if (err) {
                res.send(err)
            } else if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("No articles matching that title was found.")
            }
        })
    })

    .put(function(req, res) {
        Article.replaceOne(
            {title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content},
            function (err) {
                !err?res.send("Successfully uptdated article"):res.send("An error ocurred: "+err)
            }
        )        
    })

    .patch(function(req, res) {
        Article.updateOne(
            {title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content},
            {$set: req.body},
            function (err) {
                !err?res.send("Successfully uptdated article"):res.send("An error ocurred: "+err)
            }
        )        
    })

    .delete(function(req, res) {
        Article.deleteOne(
            {title: req.params.articleTitle},
            function (err) {
                !err?res.send("Successfully deleted article"):res.send("An error ocurred: "+err)
              })
    })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))