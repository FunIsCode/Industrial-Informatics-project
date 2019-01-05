var express = require('express');
var app = express();
var request = require('request');

var port=4444;

 app.get('/',function(req,res){
    console.log('hello world')
})


//subscribeEvents();


app.listen(port, function () {
    console.log('Server is running on http://localhost:' + port);
});



// subcribe the events in fastline

var bodyParser = require('body-parser') //analyse the responses
app.use(bodyParser.json());//use json format

app.post('/notifs',function (req,res) {
    console.log(req.body);      // your JSON
//    res.send(res.body);
})

var Client = require('node-rest-client').Client; //creat client
client = new Client();

var args = {
    data: {"destUrl": "http://130.230.154.198:4444/notifs"},  //Here is my own IP address

    //data: {"destUrl": "http://130.230.158.176:3000/"},  //Here is my own IP address
    headers:{"Content-Type": "application/json"}
};



//Subscribe the notification of zone 1~5

client.get("http://escop.rd.tut.fi:3000/RTU", function(data, response) { //check system is online

    for (var WsNumber = 1; WsNumber < 13; WsNumber++) {
        client.post('http://escop.rd.tut.fi:3000/RTU/SimCNV' + WsNumber + '/events/Z1_Changed/notifs', args, function (data, response) {
        });
        client.post('http://escop.rd.tut.fi:3000/RTU/SimCNV' + WsNumber + '/events/Z2_Changed/notifs', args, function (data, response) {
        });
        client.post('http://escop.rd.tut.fi:3000/RTU/SimCNV' + WsNumber + '/events/Z3_Changed/notifs', args, function (data, response) {
        });
        client.post('http://escop.rd.tut.fi:3000/RTU/SimCNV' + WsNumber + '/events/Z4_Changed/notifs', args, function (data, response) {
        });
        client.post('http://escop.rd.tut.fi:3000/RTU/SimCNV' + WsNumber + '/events/Z5_Changed/notifs', args, function (data, response) {
        });

        if (WsNumber == 2 || WsNumber == 3 || WsNumber == 4 || WsNumber == 5 || WsNumber == 6 || WsNumber == 8 || WsNumber == 9 || WsNumber == 10 || WsNumber == 11 || WsNumber == 12) {

            //  request.post('http://localhost:3000/RTU/SimROB' + WsNumber + '/events/DrawStartExecution/notifs', {form: {destUrl: 'http://localhost:' + port + '/notifs'}}, function (err, httpResponse, body) {
            //  });
            request.post('http://escop.rd.tut.fi:3000/RTU/SimROB' + WsNumber + '/events/DrawEndExecution/notifs', args, function (data, response){
            });
            //   request.post('http://localhost:3000/RTU/SimROB' + WsNumber + '/events/PenChanged/notifs', {form: {destUrl: 'http://localhost:' + port + '/notifs'}}, function (err, httpResponse, body) {
            //   });
        }
    }

    request.post('http://escop.rd.tut.fi:3000/RTU/SimROB1/events/PaperLoaded/notifs', args, function (data, response) {
    });
    request.post('http://escop.rd.tut.fi:3000/RTU/SimROB1/events/PaperUnloaded/notifs', args, function (data, response) {
    });
    request.post('http://escop.rd.tut.fi:3000/RTU/SimROB7/events/PalletLoaded/notifs', args, function (data, response) {
    });
    request.post('http://escop.rd.tut.fi:3000/RTU/SimROB7/events/PalletUnloaded/notifs', args, function (data, response) {
    });

    console.log('the somulator is running');
});


