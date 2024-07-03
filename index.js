import express from 'express';
import bodyParser from 'body-parser';
import { validateLogin } from './loginValidation.js';
import { posts, users } from './data.js';
import { deletePost } from './deletePost.js';
import { v4 as uuidv4 } from 'uuid';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { updatePost } from './updatePost.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = new express();
const router = express.Router();
const port = process.env.PORT || 4000;
let loggedIn; //holds and object of current user when logged in.

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
  if (loggedIn) {
    res.redirect('/');
  } else {
    res.render('login.ejs', {
      loggedIn: loggedIn,
      message: 'Invalid Credentials! Try again.',
    });
  }
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

app.get('/update-post/:id', (req, res) => {
  if (!loggedIn) res.render('index.ejs', { posts: posts, loggedIn: loggedIn });

  const postId = req.params.id;
  const postToUpdate = posts.find((el) => el.id == postId);
  res.render('update-post.ejs', {
    loggedIn: loggedIn,
    postId: postId,
    post: postToUpdate,
  });
});

app.patch('/updatePost/:id', (req, res) => {
  const postId = req.params.id;
  const { postTitle, postText } = req.body;

  const updatedPost = {
    id: postId,
    title: postTitle,
    text: postText,
  };

  if (updatePost(updatedPost)) {
    res.json({ message: 'Post updated successfully', post: updatedPost });
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
