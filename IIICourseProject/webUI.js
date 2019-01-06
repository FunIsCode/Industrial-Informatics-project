function webUI(){

    var express = require('express');
    var app = express();
    var request = require('request');
    var bodyParser = require('body-parser') //parse the responses to json format
    var fs = require('fs');
    var localhost = '127.0.0.1';
    var port = 4444;     //our own server




    var optionsKB={

        method: 'post',
        body: { }, // Javascript object payload.
        // json: true,
        url: "http://localhost:3032/iii2017/update",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept':'application/sparql-results+json,*/*;q=0.9'
        }


    };


    function InsertKB(curr){
        //console.log(curr);
        optionsKB.body = curr; //Assembly of the new query
        //console.log(optionsKB);
        request(optionsKB, function (err, res, body) {
            if (err) {
                console.log('Error :', err);
                return;
            };
           // var json=JSON.parse(body);

          //  console.log(json.results.bindings[0]);



        });
    }


    app.use(bodyParser.json());// this is to parse the response from simulator(fastory line)
    app.use(bodyParser.urlencoded({extended: false}));// this is to parse the request from UI

    app.get('/', function (req, res) {
        res.sendFile(__dirname + "/index.html"); // our UI is in file index.html
    }); //give the UI

    app.post('/order', function (req, res) {// we set the method in UI as post and the action="/order"
        //console.log(req)
        console.log(req.body);
        fs.appendFile("database.json", JSON.stringify(req.body) + "\n", 'utf8', function (err) {
            if (err) {
                return console.log(err);

            }

            for (var i = 1; i <= req.body.quantity; i++) {

                  var framerecipe=Number(req.body.frametype.split('')[5]);
                  var  screenrecipe=Number(req.body.screentype.split('')[6])+3;
                  var keybodyrecipe=Number(req.body.keyboardtype.split('')[8])+6;
                  var curr = "update=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> INSERT { sn:cellphone_" + i + " sn:hasNeed: sn:recipe_" + framerecipe + "_"+req.body.framecolor+";} WHERE{}";
                  var curr1= "update=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> INSERT { sn:cellphone_" + i + " sn:hasNeed: sn:recipe_" + screenrecipe + "_"+req.body.screencolor+";} WHERE{}";
                  var curr2= "update=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> INSERT { sn:cellphone_" + i + " sn:hasNeed: sn:recipe_" + keybodyrecipe + "_"+req.body.keyboardcolor+";} WHERE{}";
                   InsertKB(curr);
                   InsertKB(curr1);
                   InsertKB(curr2);



                       //console.log("The information was saved!");


            }
        });   // when sumbit the form, the information will be printed out on our own server


    });


    app.listen(port, function (err) {
        if (err) {
            console.log('ERROR');
        }
        console.log('server is running on:' + 'http://' + localhost + ':' + port + '\n');
    });// run the server

}

module.exports = webUI();