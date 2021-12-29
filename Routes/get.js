var express = require('express')
var router = express.Router()
var request = require('request');

var accessToken = process.env.SPHERE_ACCESS_TOKEN;
var endpoint = process.env.SPHERE_ENDPOINT;

router.get("/submission/:id",(req,res) => {

    var submissionId = req.params.id

// send request
    request({
        url: 'https://' + endpoint + '/api/v4/submissions/' + submissionId + '?access_token=' + accessToken,
        method: 'GET'
    }, function (error, response, body) {
    
    if (error) {
        console.log('Connection problem');
        res.status(500).json({msg: "Failure"})
    }
    
    // process response
    if (response) {
        if (response.statusCode === 200) {
            var data = JSON.parse(response.body)
            console.log(data); // submission data in JSON
            res.json({
                status: data.result.status.name
            })
            return
        } else {
            if (response.statusCode === 401) {
                console.log('Invalid access token');
            } else if (response.statusCode === 403) {
                console.log('Access denied');
            } else if (response.statusCode === 404) {
                console.log('Submision not found');
            }
        }
    }

    res.status(500).json({msg: "Failure"})
});
})

module.exports = router