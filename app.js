//CONFIG APP
const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	expressSanitizer = require('express-sanitizer');
methodOverride = require('method-override');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
//MONGOOSE
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/blogapp_rest', {
	useNewUrlParser: true
});
var blogappSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: { type: Date, default: Date.now }
});
var Blog = mongoose.model('Blog', blogappSchema);

//ROUTEING

//ROOT
app.get('/', function(req, res) {
	res.redirect('/blog');
});
//NEW FORM
app.get('/blog/new', function(req, res) {
	res.render('new');
});

//INDEX
app.get('/blog', function(req, res) {
	Blog.find({}, function(err, blogs) {
		if (err) {
			console.log(err);
		} else {
			res.render('index', { blogs: blogs });
		}
	});
});

//CREATE BLOG
app.post('/blog', function(req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, blos) {
		if (err) {
			res.redirect('/blog/new');
		} else {
			console.log(blos);
			res.redirect('/blog');
		}
	});
});

//SHOW BLOG
app.get('/blog/:id', function(req, res) {
	Blog.findById(req.params.id, function(err, blog) {
		if (err) {
			res.redirect('/blog');
		} else {
			res.render('show', { blog: blog });
		}
	});
});

//EDIT ROUTE
app.get('/blog/:id/edit', function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if (err) {
			res.redirect('/blog');
		} else {
			res.render('edit', { blog: foundBlog });
		}
	});
});
//UPDATE ROUTE
app.put('/blog/:id', function(req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, Updatedblog) {
		if (err) {
			res.redirect('/blog');
		} else {
			res.redirect('/blog/' + req.params.id);
		}
	});
});
//DELETE ROUTE
app.delete('/blog/:id', function(req, res) {
	Blog.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect('/blog');
		} else {
			res.redirect('/blog');
		}
	});
});

//LISTENING PATH
app.listen(3000, function() {
	console.log('$$$$$SERVER HAS STARTED MASTER$$$$$');
});
