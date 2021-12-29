var express = require('express')
var router = express.Router()
var request = require('request');
const Question = require('../Model/question')

// define access parameters
var accessToken = process.env.SPHERE_ACCESS_TOKEN;
var endpoint = process.env.SPHERE_ENDPOINT;

router.delete("/problem/:id",(req, res) => {




    if(req.user && req.user.role == "admin"){
        var problemId = req.params.id;

        // send request
         request({
            
            url: 'https://' + endpoint + '/api/v4/problems/' + problemId + '?access_token=' + accessToken,
            method: 'DELETE'
            }, function (error, response, body) {
            
            if (error) {
                console.log('Connection problem');
                res.status(500).json({msg: "Failure"})
            }
            
            // process response
            if (response) {
                if (response.statusCode === 200) {
                    console.log('Problem deleted');
                    Question.deleteOne({id: req.params.id}).then((val) => {
                        res.json({msg: "success"})
                        return
                    }).catch((err) => {
                        console.log(err)
                        res.status(500).json({msg: "failure"})
                        return
                    })
    
                } else {
                    if (response.statusCode === 401) {
                        console.log('Invalid access token');
                    } else if (response.statusCode === 403) {
                        console.log('Access denied');
                    } else if (response.statusCode === 404) {
                        console.log('Problem not found');
                    }
    
                    res.status(500).json({msg: "Failure"})
                }
            }
    
    
        });
    
    }
    else
    {
        res.status(400).json({msg: "Unauthorized"})
    }
   

})


module.exports = router