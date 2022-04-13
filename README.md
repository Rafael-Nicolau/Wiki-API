# Wiki-API

Its a pure RESTful API destinated in provide small articles in a WIKI style

Full programmed to accept .get, .post, .delete, .put, .patch
Can be URL specific > /articles/:yourarticle or generic > /article.

Uses mongoose to simplify mongoDB CRUD operations.

Example code:

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
