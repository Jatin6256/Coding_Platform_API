var express = require('express')
var router = express.Router()
const User = require('../Model/user')
const md5 = require('md5');
const jwt = require('jsonwebtoken');



router.post("/login",function(req,res){

    User.findOne({username: req.body.username},function(err,foundUser){
  
      if(err)
        console.log(err);
      else{
  
        if(foundUser)
        {
          if(foundUser.password == req.body.password){
            const newToken = jwt.sign({ id: foundUser.username, role: foundUser.role }, process.env.SECRET);
            res.json({token: newToken});
          }
          else
            res.status(400).send("invalid Password");
        }
        else
          res.status(400).send("invalid username");
      }
    })
  
  })
  
  router.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.json({msg: "success"})
    });

});
  module.exports = router