const express = require ('express');
const cors = require ('cors');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const dotenv = require ('dotenv');

dotenv.config ();
// mongoose.set('strictQuery',false);
mongoose.set ('strictQuery', true);

const app = express ();
app.use (cors ());
app.use (bodyParser.json ());

const {Schema} = mongoose;
const userSchema = new Schema (
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
  },
  {timestamps: true}
);

const Users = mongoose.model ('users', userSchema);

//! get all users
app.get ('/users', (req, res) => {
  Users.find ({}, (err, docs) => {
    if (!err) {
      res.send (docs);
    } else {
      res.status (500).json ({message: err});
    }
  });
});
//! Get user by id
app.get ('/users/:id', (req, res) => {
  const {id} = req.params;

  Users.findById (id, (err, docs) => {
    if (!err) {
      if (docs) {
        res.send (docs);
        res.status (200);
      } else {
        res.status (404).json ({message: 'NOT FOUND'});
      }
    } else {
      res.status (500).json ({message: err});
    }
  });
});
//! Add new user
app.post ('/users', (req, res) => {
  let user = new Users ({
    fullName: req.body.fullName,
    userName: req.body.userName,
    age: req.body.age,
  });

  user.save ();
  res.send ({message: 'SUCCESS'});
});
//!Delete user
app.delete ('/users/:id', (req, res) => {
  const {id} = req.params;
  Users.findByIdAndDelete (id, err => {
    if (!err) {
      res.send ('SUCCESSFULLY DELETED');
    } else {
      res.status (500).json ({message: err});
    }
  });
});
//! Update user by id
app.put ('/users/:id', (req, res) => {
  const {id} = req.params;

  Users.findByIdAndUpdate (id, req.body, (err, doc) => {
    if (!err) {
      res.status (201);
    } else {
      res.status (500).json (err);
    }
  });
  res.send ({message: 'SUCCESSFULLY Updated'});
});

const PORT = process.env.PORT;
const DB = process.env.DB_URL.replace ('<password>', process.env.DB_PASSWORD);
mongoose.connect (DB, err => {
  if (!err) {
    console.log ('DB connected');
    app.listen (PORT, () => {
      console.log ('APP is up and running');
    });
  }
});
