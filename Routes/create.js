var express = require('express')
var router = express.Router()
var request = require('request');
const Question = require('../Model/question')
// define access parameters



var accessToken = process.env.SPHERE_ACCESS_TOKEN;
var endpoint = process.env.SPHERE_ENDPOINT;

router.post("/problem",(req,res) => {

if(req.user && req.user.role == "admin"){
    if(!req.body.name || !req.body.masterjudgeId )
    res.status(400).json({msg: "Bad Request"})

var problemData = {
    name: req.body.name,
    masterjudgeId: req.body.masterjudgeId
};

// send request
request({
    url: 'https://' + endpoint + '/api/v4/problems?access_token=' + accessToken,
    method: 'POST',
    form: problemData
}, function (error, response, body) {
    
    if (error) {
        console.log('Connection problem');
        res.status(500).json({msg: "Failure"})
    }
    
    // process response
    if (response) {
        if (response.statusCode === 201) {
            var data = JSON.parse(response.body)
            console.log(data); // problem data in JSON
            const question = new Question({
                id: data.id,
                description: req.body.description
            })

            question.save().then((val) => {
                res.json({problemId: data.id})
                return
            }).catch((err) => {
                console.log(err)
                res.status(500).json({msg: "failure"})
                return
            })

        } else {
            if (response.statusCode === 401) {
                console.log('Invalid access token');
            } else if (response.statusCode === 400) {
                var body = JSON.parse(response.body);
                console.log('Error code: ' + body.error_code + ', details available in the message: ' + body.message)
            }

            res.status(500).json({msg: "failure"})
        }
    }
});
}
else
{
    res.status(400).json({msg: "Unauthorized"})
}
 
})


router.post("/testcase/:id",(req,res) => {

 if(req.user && req.user.role == "admin"){
    var problemId = req.params.id;

    if(!req.body.input || !req.body.output )
        res.status(400).json({msg: "Bad Request"})

    var testcaseData = {
        input: req.body.input,
        output: req.body.output,
        timelimit: 1,
        judgeId: 1
    };

// send request
request({
    
    url: 'https://' + endpoint + '/api/v4/problems/' + problemId +  '/testcases?access_token=' + accessToken,
    method: 'POST',
    form: testcaseData
}, function (error, response, body) {
    
    if (error) {
        console.log('Connection problem');
        res.status(500).json({msg: "Failure"})
    }
    
    // process response
    if (response) {
        if (response.statusCode === 201) {
            var data = JSON.parse(response.body)
            console.log(data); // testcase data in JSON
            res.json({number: data.number })
            return
        }
        else {
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

            res.status(500).json({"msg": "failure"})
        }


    }
});
 }
 else
 {
     res.status(400).json({msg: "Unauthorized"})
 }
})

router.post("/submission",(req,res) => {

    if(!req.body.problemId || !req.body.compilerId || !req.body.source)
        res.status(400).json({msg: "Bad Request"})

    var submissionData = {
        problemId: req.body.problemId,
        compilerId: req.body.compilerId,
        source: req.body.source
    };
    
    // send request
    request({
        url: 'https://' + endpoint + '/api/v4/submissions?access_token=' + accessToken,
        method: 'POST',
        form: submissionData
    }, function (error, response, body) {
        
        if (error) {
            console.log('Connection problem');
            res.status(500).json({msg: "Failure"})
        }
        
        // process response
        if (response) {
            if (response.statusCode === 201) {
                var data = JSON.parse(response.body)
                console.log(data); // submission data in JSON
                res.json({id: data.id})
                return
            } else {
                if (response.statusCode === 401) {
                    console.log('Invalid access token');
                } else if (response.statusCode === 402) {
                    console.log('Unable to create submission');
                } else if (response.statusCode === 400) {
                    var body = JSON.parse(response.body);
                    console.log('Error code: ' + body.error_code + ', details available in the message: ' + body.message)
                }
            }
        }
        res.status(500).json({msg: "Failure"})
    });
})
module.exports = router