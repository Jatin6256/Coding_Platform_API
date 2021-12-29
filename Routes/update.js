var express = require('express')
var router = express.Router()
var request = require('request');
const Question = require('../Model/question')


var accessToken = process.env.SPHERE_ACCESS_TOKEN;
var endpoint = process.env.SPHERE_ENDPOINT;

router.put("/problem/:id",(req,res) => {
    if(req.user && req.user.role == "admin"){
        var problemId = req.params.id;

        if(!req.body.problemData)
            res.status(400).json({msg: "Bad Request"})
    
        var problemData = req.body.problemData
    
    
    // send request
        request({
            url: 'https://' + endpoint + '/api/v4/problems/' + problemId +  '?access_token=' + accessToken,
            method: 'PUT',
            form: problemData
        }, function (error, response, body) {
            
            if (error) {
                console.log('Connection problem');
                res.status(500).json({msg: "Failure"})
            }
            
            // process response
            if (response) {
                if (response.statusCode === 200) {
                    console.log('Problem updated');
                    res.json({"msg": "success"})
                } else {
                    if (response.statusCode === 401) {
                        console.log('Invalid access token');
                    } else if (response.statusCode === 403) {
                        console.log('Access denied');
                    } else if (response.statusCode === 404) {
                        console.log('Problem does not exist');
                    } else if (response.statusCode === 400) {
                        var body = JSON.parse(response.body);
                        console.log('Error code: ' + body.error_code + ', details available in the message: ' + body.message)
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

router.put("/description/:id",(req,res) => {

    if(req.user && req.user.role == "admin"){
        if(!req.body.description)
            res.status(400).json({msg: "Bad Request"})

        var newDescription = req.body.description

        Question.updateOne({id: req.params.id},{description: newDescription}).then((val) => {
            console.log("description updated")
            res.json({"msg": "Success"})
        }).catch(err => {
            console.log(err)
            res.status(500).json({msg: "Failure"})
        })
    }
    else
    {
        res.status(400).json({msg: "Unauthorized"})
    }
    
})

module.exports = router