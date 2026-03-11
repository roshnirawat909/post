/*const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const upload = require('./config/MulterConfig');


// --- Mongoose Connection ---
mongoose.connect('mongodb://localhost:27017/miniApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.log('MongoDB connection error:', err));

// --- Model Imports ---
const userModel = require('./models/user');
const postModel = require('./models/post');

// --- App Config ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


// --- Middleware ---
function isLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  try {
    const data = jwt.verify(token, "shhhh");
    req.user = data;
    next();
  } catch (err) {
    return res.redirect("/login");
  }
}

// --- Routes ---
app.get('/', (req, res) => {
  res.render("index");
});

app.get('/profile/upload', (req, res) => {
  res.render("profileUpload");
});

app.post('/upload',isLoggedIn, upload.single("image"),async (req, res) => {
   let user = await userModel.findOne({email : req.user.email});
   user.profilePic = req.file.filename;
    await user.save();
    res.redirect("/profile");

});

app.get('/login', (req, res) => {
  res.render("login");
});

app.get('/profile', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email }).populate("posts");
  res.render("profile", { user });
});

app.post('/post', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  const { content } = req.body;

  const post = await postModel.create({
    user: user._id,
    content,
  });

  user.posts.push(post._id);
  await user.save();

  res.redirect("/profile");
});

app.get('/like/:id', isLoggedIn, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id).populate("user");
    if (!post) return res.status(404).send("Post not found");

    const userId = req.user.userid;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/edit/:id', isLoggedIn, async (req, res) => {
  
    const post = await postModel.findById(req.params.id).populate("user");
    
    res.render("edit",{post});
});

app.post('/update/:id', isLoggedIn, async (req, res) => {
  let post =  await postModel.findByIdAndUpdate(req.params.id, { content: req.body.content }).populate("user");
  res.redirect("/profile");
});

app.get('/logout', (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

app.post('/register', async (req, res) => {
  try {
    const { username, name, age, password, email } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).send("User already registered");

    const hash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      name,
      age,
      email,
      password: hash,
    });

    const token = jwt.sign(
      { email: newUser.email, userid: newUser._id },
      "shhhh",
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/login");
  } catch (err) {
    console.error("User creation error:", err);
    res.status(500).send("Error creating user");

  }
   //const profilePic = req.file?.filename || 'default.png';
  // Include profilePic in user creation
});




app.post('/login', async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.redirect("/login");

    const token = jwt.sign(
      { email: user.email, userid: user._id },
      "shhhh",
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/profile");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Error logging in");
  }
});

// --- Start Server ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});*/

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const upload = require('./config/MulterConfig');

// --- Mongoose Connection ---
mongoose.connect('mongodb://localhost:27017/miniApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.log('MongoDB connection error:', err));

// --- Model Imports ---
const userModel = require('./models/user');
const postModel = require('./models/post');

// --- App Config ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// --- Middleware ---
function isLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  try {
    const data = jwt.verify(token, "shhhh");
    req.user = data;
    next();
  } catch (err) {
    return res.redirect("/login");
  }
}

// --- Routes ---
app.get('/', (req, res) => {
  res.render("index");
});

app.get('/profile/upload', (req, res) => {
  res.render("profileUpload");
});

app.post('/upload', isLoggedIn, upload.single("image"), async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  user.profilePic = req.file.filename;
  await user.save();
  res.redirect("/profile");
});

app.get('/login', (req, res) => {
  res.render("login");
});

app.get('/profile', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email }).populate("posts");
  res.render("profile", { user });
});

app.post('/post', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  const { content } = req.body;

  const post = await postModel.create({
    user: user._id,
    content,
  });

  user.posts.push(post._id);
  await user.save();

  res.redirect("/profile");
});

app.get('/like/:id', isLoggedIn, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id).populate("user");
    if (!post) return res.status(404).send("Post not found");

    const userId = req.user.userid;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// --- Edit Post Page ---
app.get('/edit/:id', isLoggedIn, async (req, res) => {
  const post = await postModel.findById(req.params.id).populate("user");
  res.render("Update", { post });   // ✅ renders Update.ejs
});

// --- Update Post ---
app.post('/update/:id', isLoggedIn, async (req, res) => {
  await postModel.findByIdAndUpdate(req.params.id, { content: req.body.content });
  res.redirect("/profile");
});

app.get('/logout', (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

app.post('/register', async (req, res) => {
  try {
    const { username, name, age, password, email } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).send("User already registered");

    const hash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      name,
      age,
      email,
      password: hash,
    });

    const token = jwt.sign(
      { email: newUser.email, userid: newUser._id },
      "shhhh",
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/login");
  } catch (err) {
    console.error("User creation error:", err);
    res.status(500).send("Error creating user");
  }
});

app.post('/login', async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.redirect("/login");

    const token = jwt.sign(
      { email: user.email, userid: user._id },
      "shhhh",
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/profile");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Error logging in");
  }
});

// --- Start Server ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});