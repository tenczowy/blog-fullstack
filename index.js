import express from 'express';
import bodyParser from 'body-parser';
import { validateLogin } from './loginValidation.js';
import { posts, users } from './data.js';
import { deletePost } from './deletePost.js';
import { v4 as uuidv4 } from 'uuid';

const app = new express();
const port = 3000;
let loggedIn; //holds and object of current user when logged in.

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index.ejs', { posts: posts, loggedIn: loggedIn });
});

app.get('/about', (req, res) => {
  res.render('index.ejs', { posts: posts, loggedIn: loggedIn });
});

app.get('/logout', (req, res) => {
  loggedIn = false;
  res.render('index.ejs', { posts: posts, loggedIn: loggedIn });
});

app.get('/login', (req, res) => {
  res.render('login.ejs', { loggedIn: loggedIn });
});

app.get('/add', (req, res) => {
  res.render('new-post.ejs', { loggedIn: loggedIn });
});

app.post('/login', (req, res) => {
  const login = req.body.username;
  const password = req.body.password;
  loggedIn = validateLogin(login, password, users);
  res.redirect('/');
});

app.post('/new-post', (req, res) => {
  if (loggedIn) {
    const newPost = {
      id: uuidv4(),
      title: req.body.postTitle,
      text: req.body.postText,
      author: loggedIn.userName,
    };

    posts.push(newPost);
    res.redirect('/');
  } else {
    res.render('login.ejs', { loggedIn: loggedIn });
  }
});

app.delete('/deletePost/:id', (req, res) => {
  const postId = req.params.id;
  const isDeleted = deletePost(postId);

  if (isDeleted) {
    // res.json('Deleted successfully!');
    res.redirect('/');
  } else {
    res
      .status(500)
      .json({ message: `Failed to delete post with ID ${postId}.` });
  }
});

app.listen(port, () => {
  console.log('Server running on port 3000.');
});
