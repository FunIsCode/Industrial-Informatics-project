var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser') //parse the responses to json format
    app.use(bodyParser.json());// this is to parse the response from simulator(fastory line)
    app.use(bodyParser.urlencoded({ extended: false }));// this is to parse the request from UI

var fs=require('fs');
var localhost='127.0.0.1';
var port=4444;     //our own server

app.get('/', function(req, res){
  res.sendFile( __dirname  + "/index.html" ); // our UI is in file index.html
}); //give the UI

app.post('/order', function (req, res) {// we set the method in UI as post and the action="/order"
    //console.log(req)
    console.log(req.body); 
     fs.appendFile("database.json", JSON.stringify(req.body)+"\n", 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The information was saved!");
    });
});// when sumbit the form, the information will be printed out on our own server 

app.listen(port, function(err){
if(err){
	console.log('ERROR');
}
    console.log('server is running on:'+'http://'+localhost+':'+port+'\n');
});// run the server



// make the query to fuseki server.
var optionsKB={

        method: 'post',
        body: { }, // Javascript object payload.
       // json: true,
        url: "http://127.0.0.1:3032/iii2017/query",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept':'application/sparql-results+json,*/*;q=0.9'
        }


};





var curr= "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> SELECT * WHERE {sn:workStation_9 sn:hasRobotURL ?url1. sn:conveyor_1 sn:hasServiceURL ?url2. }";

function ReceiveKB(curr){
    //console.log(curr);
    optionsKB.body = curr; //Assembly of the new query
    //console.log(optionsKB);
    request(optionsKB, function (err, res, body) {
        if (err) {
            console.log('Error :', err);
            return;
        };
        var json=JSON.parse(body);

      console.log(json.results.bindings[0].url1.value+json.results.bindings[0].url2.value);




    /*for(var i = 0; i<body.results.bindings.length; i++) {
         var next = body.results.bindings[i].url.value;
         //var setValue = next;
         console.log(next);
        // requestOut(next);
     }*/
 });
}

ReceiveKB(curr);




/*

var args = {
    data: {"destUrl":"http://localhost:4444/events"},  //Here is my own IP address we use the local server to test

       headers:{"Content-Type": "application/json"}
};


// subcribe all the events in fastline



var Client = require('node-rest-client').Client; //creat client
client = new Client();



client.get("http://localhost:3000/RTU", function(data, response) { //check system is online

    for (var WsNumber = 1; WsNumber < 13; WsNumber++) {

        client.post('http://localhost:3000/RTU/SimCNV' + WsNumber + '/events/Z1_Changed/notifs', args, function (data, response) {
        });
        client.post('http://localhost:3000/RTU/SimCNV' + WsNumber + '/events/Z2_Changed/notifs', args, function (data, response) {
        });
        client.post('http://localhost:3000/RTU/SimCNV' + WsNumber + '/events/Z3_Changed/notifs', args, function (data, response) {
        });
        client.post('http://localhost:3000/RTU/SimCNV' + WsNumber + '/events/Z4_Changed/notifs', args, function (data, response) {
        });
        client.post('http://localhost:3000/RTU/SimCNV' + WsNumber + '/events/Z5_Changed/notifs', args, function (data, response) {
        });

        if (WsNumber == 2 || WsNumber == 3 || WsNumber == 4 || WsNumber == 5 || WsNumber == 6 || WsNumber == 8 || WsNumber == 9 || WsNumber == 10 || WsNumber == 11 || WsNumber == 12) {

            request.post('http://localhost:3000/RTU/SimROB' + WsNumber + '/events/DrawStartExecution/notifs', args, function (data, response) {
            });
            client.post('http://localhost:3000/RTU/SimROB' + WsNumber + '/events/DrawEndExecution/notifs', args, function (data, response){
            });
             request.post('http://localhost:3000/RTU/SimROB' + WsNumber + '/events/PenChanged/notifs', {form: {destUrl: 'http://localhost:' + port + '/notifs'}}, function (err, httpResponse, body) {
            });
       }
    }


    client.post('http://localhost:3000/RTU/SimROB1/events/PaperLoaded/notifs', args, function (data, response) {
    });
    client.post('http://localhost:3000/RTU/SimROB1/events/PaperUnloaded/notifs', args, function (data, response) {
    });
    client.post('http://localhost:3000/RTU/SimROB7/events/PalletLoaded/notifs', args, function (data, response) {
    });
    client.post('http://localhost:3000/RTU/SimROB7/events/PalletUnloaded/notifs', args, function (data, response) {
    });



});


app.post('/events',function (req,res) { // out put the respose from the simulator


    console.log(req.body.id);// your JSON
    console.log(req.body.payload.PalletID);
});



//define the variable here for query which show the status of conveyor 
var queryPalletID = {
    method: 'post',
    body: { }, // Javascript object payload.
    json: true,
    url: 'http://localhost:3000/RTU/SimCNV8/services/Z1',
    headers: {
        'Content-Type': 'application/json'
    }
};


// the function to test the status of conveyors
function testID(){

    request(queryPalletID,function(err,res,body){
        console.log(body);
    });
}

setInterval(testID,3000);


/*
function testID(){

request.post({url:'http://localhost:3000/RTU/SimCNV8/services/Z1', form: {key:'value'}}, function(err,httpResponse,body){

//obj = JSON.parse(body);
console.log(JSON.parse(body).PalletID) })
}
*/

