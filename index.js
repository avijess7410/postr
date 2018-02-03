// module imports
const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const Sequelize = require('sequelize');
const app = express();
const router = express.Router();

passport.use(new FacebookStrategy ({
  clientID:'2012782155404972',
  clientSecret: '332aaf48f1dff4e22957a26b70b90bca',
  callbackURL:'http://localhost:3000/auth/facebook/callback'
  
},

  function(accessToken, refreshToken, profile, done){
    console.log(profile)
    done(profile)
  }
))

// use json format for req body
app.use(bodyParser.json())

// connect to db
const sequelize = new Sequelize('Music', 'isaac', null, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: '/Users/Avi Labtop/Desktop/js-backend2/Chinook_Sqlite_AutoIncrementPKs.sqlite'
});

// define schema
const Artist = sequelize.define('Artist', {
      ArtistId: {
        Name: Sequelize.STRING,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      
},
{
    freezeTableName: true,
    timestamps: false
})
//api
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth.facebook/callback', passport.authenticate('facebook', {successRedirect: '/'}));


app.get('/artist', (req,res) => {
  Artist.findAll().then(artists => {
    res.json(artists)
  })
})


app.get('/artist/:id', (req,res)=>{
  Artist.find(
  {
    where:{ ArtistId: req.params.id
      }
    }
  ) .then(artist => {
    res.json(artist)
  })

})

app.post('/artist', (req,res)=> {
  Artist.create({
    Name: req.body.name
  })
  res.sendStatus(200)
})


// app.put('/artist/:id', (req, res) => (
//   Artist.update(
// {Name: 'The Coders'},
// {
//   where: {
//     ArtistId: req.params.id
//   }
// } 
// ).then(artist =>{
//   res.json(artist)
//   })
// })
// 17:05 on video


app.delete('/artist/:id', (req, res)=>{
  Artist.find(
  {
    where: {
      ArtistId: req.params.id
   } 

     }
     ).then(artist => {
      artist.destroy();
      res.sendStatus(200)
     })
})

// run server on port 3000
app.listen(3000, () => {
    console.log('server running')
})

module.exports = Artist;