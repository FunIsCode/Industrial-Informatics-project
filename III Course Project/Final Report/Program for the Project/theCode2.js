// Main code for the assignment of the course III
// Carlos Guttormsen, 245621
// Qi Yuan, 267957

var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser') //parse the responses to json format
var fs=require('fs');
var localhost='127.0.0.1';
var port=4444;     //our own server
var EventEmitter = require('events').EventEmitter;
require('events').EventEmitter.defaultMaxListeners = 20;
var emitter = new EventEmitter();

app.use(bodyParser.json());// this is to parse the response from simulator(fastory line)
app.use(bodyParser.urlencoded({ extended: false }));// this is to parse the request from UI

//
// WEBUI starts here
//

// UI to KB
var UI2KB={

    method: 'post',
    body: { }, // Javascript object payload.
    // json: true,
    url: "http://localhost:3032/iii2017/update",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept':'application/sparql-results+json,*/*;q=0.9'
    }
};

// this is for updating the KB
function InsertKB(curr){
    //console.log(curr);
    UI2KB.body = curr; //Assembly of the new query
    //console.log(optionsKB);
    request(UI2KB, function (err, res, body) {
        if (err) {
            console.log('Error :', err);
            return;
        }
    });
}

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html"); // our UI is in file index.html
}); //give the UI

var productNumber=1;

app.post('/order', function (req, res) {// we set the method in UI as post and the action="/order"
    //console.log(req)
    console.log(req.body);
    // write to database to have a backup
    fs.appendFile("database.json", JSON.stringify(req.body) + "\n", 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        for (var i = 1; i <= req.body.quantity; i++) {

            var framerecipe=Number(req.body.frametype.split('')[5]);
            var screenrecipe=Number(req.body.screentype.split('')[6])+3;
            var keybodyrecipe=Number(req.body.keyboardtype.split('')[8])+6;
            var curr = "update=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> INSERT { sn:cellphone_" + productNumber + " sn:hasNeed sn:recipe_" + framerecipe + "_"+req.body.framecolor+";} WHERE{}";
            var curr1= "update=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> INSERT { sn:cellphone_" + productNumber + " sn:hasNeed sn:recipe_" + screenrecipe + "_"+req.body.screencolor+";} WHERE{}";
            var curr2= "update=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> INSERT { sn:cellphone_" + productNumber + " sn:hasNeed sn:recipe_" + keybodyrecipe + "_"+req.body.keyboardcolor+";} WHERE{}";
            var hasPaperLoaded="update=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> INSERT { sn:cellphone_" + productNumber + " sn:hasPaperLoaded  0;} WHERE{}";
            var hasPalletID="update=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> INSERT { sn:cellphone_" + productNumber+ " sn:hasPalletID  0;} WHERE{}";
            var createCustomer="update=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> INSERT { sn:customer_" + req.body.Name+ " sn:hasOrderPending " +"sn:cellphone_"+productNumber+";} WHERE{}";
            var master="update=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> INSERT { sn:master  sn:hasOrderPending sn:cellphone_"+productNumber+";} WHERE{}";

            productNumber=productNumber+1;

            // insert information to KB
            InsertKB(curr);
            InsertKB(curr1);
            InsertKB(curr2);
            InsertKB(hasPaperLoaded);
            InsertKB(hasPalletID);
            InsertKB(master);
            InsertKB(createCustomer);
        }
    });   // when sumbit the form, the information will be printed out on our own server
});


app.listen(port, function (err) {
    if (err) {
        console.log('ERROR');
    }
    console.log('server is running on:' + 'http://' + localhost + ':' + port + '\n');
});// run the server

//
// WEBUI ends here
//

//
// subscription starts here
//

var Client = require('node-rest-client').Client; //creat client

client = new Client();

client.get("http://localhost:3000/RTU", function(data, response) { //check system is online
    //console.log('hi')

    for (var WsNumber = 1; WsNumber < 13; WsNumber++) {

        client.post('http://localhost:3000/RTU/SimCNV' + WsNumber + '/events/Z1_Changed/notifs', argsForZ_changed, function (data, response) {
        });
        client.post('http://localhost:3000/RTU/SimCNV' + WsNumber + '/events/Z2_Changed/notifs', argsForZ_changed, function (data, response) {
        });
        client.post('http://localhost:3000/RTU/SimCNV' + WsNumber + '/events/Z3_Changed/notifs', argsForZ_changed, function (data, response) {
        });
        client.post('http://localhost:3000/RTU/SimCNV' + WsNumber + '/events/Z4_Changed/notifs', argsForZ_changed, function (data, response) {
        });
        client.post('http://localhost:3000/RTU/SimCNV' + WsNumber + '/events/Z5_Changed/notifs', argsForZ_changed, function (data, response) {
        });
        if (WsNumber == 2 || WsNumber == 3 || WsNumber == 4 || WsNumber == 5 || WsNumber == 6 || WsNumber == 8 || WsNumber == 9 || WsNumber == 10 || WsNumber == 11 || WsNumber == 12) {

            client.post('http://localhost:3000/RTU/SimROB' + WsNumber + '/events/DrawStartExecution/notifs', argsDrawingstations, function (data, response) {
            });
            client.post('http://localhost:3000/RTU/SimROB' + WsNumber + '/events/DrawEndExecution/notifs', argsDrawingstations, function (data, response){
            });
            client.post('http://localhost:3000/RTU/SimROB' + WsNumber + '/events/PenChanged/notifs', argsDrawingstations, function (data, response){
            });
        }
    }
    client.post('http://localhost:3000/RTU/SimROB1/events/PaperLoaded/notifs', argsForWS1, function (data, response) {
    });
    client.post('http://localhost:3000/RTU/SimROB1/events/PaperUnloaded/notifs', argsForWS1, function (data, response) {
    });
    client.post('http://localhost:3000/RTU/SimROB7/events/PalletLoaded/notifs', argsForWS7, function (data, response) {
    });
    client.post('http://localhost:3000/RTU/SimROB7/events/PalletUnloaded/notifs', argsForWS7, function (data, response) {
    });
});

//
// subscription ends here
//

var argsForZ_changed = {
    data: {"destUrl":"http://localhost:4444/location"},  //Here is my own IP address we use the local server to test
    headers:{"Content-Type": "application/json"}
};
var argsDrawingstations = {
    data: {"destUrl":"http://localhost:4444/Drawingstations"},  //Here is my own IP address we use the local server to test
    headers:{"Content-Type": "application/json"}
};

var argsForWS1 = {
    data: {"destUrl":"http://localhost:4444/ws1"},  //Here is my own IP address we use the local server to test
    headers:{"Content-Type": "application/json"}
};

var argsForWS7 = {
    data: {"destUrl":"http://localhost:4444/ws7"},  //Here is my own IP address we use the local server to test
    headers:{"Content-Type": "application/json"}
};

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

// set the pen colours for the ones we have decided
function calibratePens(i) {

    var workstationNumber = [0,8,9,10,11,12,2,3,4,5,6];

    var queryRobotPenColour = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
        "SELECT ?penColour " +
        "WHERE {sn:workStation_" + workstationNumber[i] + " sn:checkColour ?penColour.}";
    optionsKB.body = queryRobotPenColour;
    request(optionsKB, function (err, res, body) {
        request.post(JSON.parse(body).results.bindings[0].penColour.value, function (err, res, body) {
            if (i >= 1 && i <= 4) {
                if (penColourWS8_9_10_11 != JSON.parse(body).CurrentPen) {
                    // change pen
                    request.post("http://localhost:3000/RTU/SimROB" + workstationNumber[i] + "/services/ChangePen" +
                        penColourWS8_9_10_11, function (err, res, body) {
                    })
                }
            }
            else if (i >= 5 && i <= 7) {
                if (penColourWS12_2_3 != JSON.parse(body).CurrentPen) {
                    // change pen
                    request.post("http://localhost:3000/RTU/SimROB" + workstationNumber[i] + "/services/ChangePen" +
                        penColourWS12_2_3, function (err, res, body) {
                    })
                }
            }
            else {
                if (penColourWS4_5_6 != JSON.parse(body).CurrentPen) {
                    // change pen
                    request.post("http://localhost:3000/RTU/SimROB" + workstationNumber[i] + "/services/ChangePen" +
                        penColourWS4_5_6, function (err, res, body) {
                    })
                }
            }
        });
    });
}

// pen colours for workstations
var penColourWS8_9_10_11 = "RED";
var penColourWS12_2_3 = "GREEN";
var penColourWS4_5_6 = "BLUE";
// change the pens if needed
calibratePens(1);
calibratePens(2);
calibratePens(3);
calibratePens(4);
calibratePens(5);
calibratePens(6);
calibratePens(7);
calibratePens(8);
calibratePens(9);
calibratePens(10);

// how many pallets have we loaded
var palletNumber = 1;

// listen for pallet loading to assign IDs
app.post('/ws7',function (req,res) {
    var assignID = Number(req.body.payload.PalletID);
    var WSN = 7;
    var CNV = 3;
    emitter.emit('check pallet id',WSN,CNV,assignID);
});

// listen for location changed
app.post('/location',function (req,res) { // output the respose from the simulator

    if(req.body.id != "Z5_Changed" && req.body.payload.PalletID != "-1") {
        if (req.body.senderID.length == 8) {
            var WSN = req.body.senderID.slice(-2);
        }
        else {
            var WSN = req.body.senderID.split('')[6];
        }
        var CNV = req.body.id.split('')[1];
        // this cannot be done at each CNV in real manufacturing line
        var palletID = Number(req.body.payload.PalletID);

        console.log('Current location: ' + WSN + ', ' + CNV);

        if (WSN == 7 && CNV == 3 && palletNumber > 1) {
            emitter.emit('store pallet',WSN,CNV,palletID);
        }
        else if (WSN == 1 && CNV == 3) {
            emitter.emit('check for loading station needs',WSN,CNV,palletID);
        }
        else if (WSN != 7 && CNV == 3) {
            emitter.emit('perform drawing',WSN,CNV,palletID);
        }
        else {
            emitter.emit('get neighbours',WSN,CNV,palletID);
        }
    }
});

// store the pallet
emitter.on('store pallet',function storePallet(WSN,CNV,palletID) {
    var move = true;
    for (var i = 0; i < palletsToBeStored.length; ++i) {
        if (palletID == palletsToBeStored[i]) {
            request.post('http://localhost:3000/RTU/SimROB7/services/UnloadPallet',function (err,res,body) {});
            palletsToBeStored.splice(i,1);
            move = false;
        }
    }
    setTimeout(function () {
        if (move == true) {
            emitter.emit('get neighbours',WSN,CNV,palletID);
        }
    },1000);
});

// check pallet id and proceed to get neighbours after it
emitter.on('check pallet id',function checkPalletID(WSN, CNV, assignID) {
    var queryPalletID = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
        "SELECT ?palletID " +
        "WHERE {sn:cellphone_" + palletNumber + " sn:hasPalletID ?palletID.}";
    optionsKB.body = queryPalletID;

    request(optionsKB, function (err, res, body) {
        var queryUpdatePalletID = "update=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
            "DELETE WHERE {sn:cellphone_" + palletNumber + " sn:hasPalletID ?value;};" +
            "INSERT {sn:cellphone_" + palletNumber + " sn:hasPalletID " + assignID + ";} WHERE{}";
        InsertKB(queryUpdatePalletID);
        palletNumber = palletNumber + 1;
        emitter.emit('get neighbours',WSN,CNV,assignID);
    });
    console.log(palletNumber);
});

// get the neighbours
emitter.on('get neighbours',function getNeighbours(WSN,CNV,palletID) {

    if (WSN == 7) {
        var queryLocationManualStation = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
            "SELECT ?url1 ?url2 " +
            "WHERE {sn:manualStation_1 sn:hasConveyorURL ?url1. sn:conveyor_" + CNV + " sn:hasNeighbour ?url3. ?url3 sn:hasServiceURL ?url2.}";

        emitter.emit('checkNeighbourStatus',queryLocationManualStation,WSN,CNV,palletID);
        emitter.once('neighbours checked', function(){
            console.log('Neighbour free. Proceed with moving pallet...\n');
        })
    }

    else if (WSN == 1) {
        var queryLocationLoadingStation = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
            "SELECT ?url1 ?url2 " +
            "WHERE {sn:loadingStation_1 sn:hasConveyorURL ?url1. sn:conveyor_" + CNV + " sn:hasNeighbour ?url3. ?url3 sn:hasServiceURL ?url2.}";

        emitter.emit('checkNeighbourStatus',queryLocationLoadingStation,WSN,CNV,palletID);
        emitter.once('neighbours checked', function(){
            console.log('Neighbour free. Proceed with moving pallet...\n');
        })
    }
    else {
        var queryLocationWorkStation = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
            "SELECT ?url1 ?url2 " +
            "WHERE {sn:workStation_" + WSN + " sn:hasConveyorURL ?url1. sn:conveyor_" + CNV + " sn:hasNeighbour ?url3. ?url3 sn:hasServiceURL ?url2.}";

        emitter.emit('checkNeighbourStatus',queryLocationWorkStation,WSN,CNV,palletID);
        emitter.once('neighbours checked', function(){
            console.log('Neighbour free. Proceed with moving pallet...\n');
        })
    }
});

// movement of pallets when there is only one neighbour, else proceed to step 1
emitter.on('move pallet step 0', function movePallet0(neighbourStatusValues,WSN,CNV,productID) {

    var queryMovePalletWS = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
        "SELECT ?url1 ?url2 " +
        "WHERE {sn:workStation_" + WSN + " sn:hasConveyorURL ?url1. " +
        "sn:conveyor_" + CNV + " sn:hasCapability ?capability. " +
        "?capability sn:hasServiceURL ?url2.}";

    var queryMovePalletLS = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
        "SELECT ?url1 ?url2 " +
        "WHERE {sn:loadingStation_1 sn:hasConveyorURL ?url1. " +
        "sn:conveyor_" + CNV + " sn:hasCapability ?capability. " +
        "?capability sn:hasServiceURL ?url2.}";

    var queryMovePalletMS = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
        "SELECT ?url1 ?url2 " +
        "WHERE {sn:manualStation_1 sn:hasConveyorURL ?url1. " +
        "sn:conveyor_" + CNV + " sn:hasCapability ?capability. " +
        "?capability sn:hasServiceURL ?url2.}";

    if (neighbourStatusValues.length == 1) {
        if (WSN == 7) {
            emitter.emit('move the pallet',queryMovePalletMS);
        }
        else if (WSN == 1) {
            emitter.emit('move the pallet',queryMovePalletLS);
        }
        else {
            emitter.emit('move the pallet',queryMovePalletWS);
        }
        emitter.once('move the pallet', function (queryMovePallet) {
            optionsKB.body = queryMovePallet;
            request(optionsKB, function (err, res, body) {
                request.post(JSON.parse(body).results.bindings[0].url1.value+
                    JSON.parse(body).results.bindings[0].url2.value, function (err, res, body) {
                    //
                })
            })
        })
    }
    else {
        emitter.emit('move pallet step 1',neighbourStatusValues,WSN,CNV,productID,queryMovePalletWS);
    }
});

// first step: check if paper loaded -> if not move, if yes proceed to step 2
// this step is triggered only in CNV positions 1 of workstations
emitter.on('move pallet step 1', function movePallet1(neighbourStatusValues,WSN,CNV,productID,queryMovePalletWS) {
    // if robot has same color pen as any part in cellphone needs, try to proceed to cnv 2
    // else try to proceed to cnv 4 (also if cnv 2 is busy)

    var productUnderWork = "";

    var transportURL1;
    var transportURL2;

    // 123 should be replaced with productID after testing is done
    var queryProductUnderWork = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
        "SELECT ?products " +
        "WHERE {sn:master sn:hasOrderPending ?products. ?products sn:hasPalletID ?ID. " +
        "FILTER (?ID = " + productID + ")}";

    optionsKB.body = queryProductUnderWork;

    request(optionsKB, function (err, res, body) {
        productUnderWork = JSON.parse(body).results.bindings[0].products.value;
        var queryHasPaperLoaded = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
            "SELECT ?paperLoaded " +
            "WHERE {<" + productUnderWork + "> sn:hasPaperLoaded ?paperLoaded.}";
        optionsKB.body = queryHasPaperLoaded;

        // to test 'move pallet step 2' the value in the if statement below should be set to == true
        // to test this step set it to == false
        request(optionsKB, function (err, res, body) {
            if (JSON.parse(body).results.bindings[0].paperLoaded.value == false) {
                optionsKB.body = queryMovePalletWS;
                request(optionsKB, function (err, res, body) {
                    transportURL1 = JSON.parse(body).results.bindings[0].url1.value+
                        JSON.parse(body).results.bindings[0].url2.value;
                    transportURL2 = JSON.parse(body).results.bindings[1].url1.value+
                        JSON.parse(body).results.bindings[1].url2.value;
                    if (neighbourStatusValues[1] == -1) {
                        request.post(transportURL2, function (err, res, body) {
                            // move to CNV 4
                        })
                    }
                    else {
                        request.post(transportURL1, function (err, res, body) {
                            // move to CNV 2
                        })
                    }
                })
            }
            else {
                emitter.emit('move pallet step 2',neighbourStatusValues,WSN,CNV,productUnderWork,queryMovePalletWS)
            }
        })
    });
});


// second step: check if there are needs -> move accordingly (do need colours match pen colour?)
// this step is triggered only in CNV positions 1 of workstations
emitter.on('move pallet step 2', function movePallet2(neighbourStatusValues,WSN,CNV,productUnderWork,queryMovePalletWS) {

    // decide if to prioritize cnv 2 or cnv 4 depending on the needs and the relation of the need colours and the
    // colour of the pen that is equipped to the robot in the current workstation
    var queryCheckPenColour = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
        "SELECT ?colour " +
        "WHERE {sn:workStation_" + WSN + " sn:checkColour ?colour.}";

    var queryHasNeeds = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
        "SELECT ?needs " +
        "WHERE {<" + productUnderWork + "> sn:hasNeed ?needs.}";

    var robotPenColour = "";

    var transportURL1;
    var transportURL2;

    optionsKB.body = queryCheckPenColour;
    request(optionsKB, function (err, res, body) {
        request.post(JSON.parse(body).results.bindings[0].colour.value, function (err, res, body) {
            if (err) {
                console.log('Error: ', err);
            }
            robotPenColour = JSON.parse(body).CurrentPen;

            optionsKB.body = queryMovePalletWS;
            request(optionsKB, function (err, res, body) {
                transportURL1 = JSON.parse(body).results.bindings[0].url1.value +
                    JSON.parse(body).results.bindings[0].url2.value;
                transportURL2 = JSON.parse(body).results.bindings[1].url1.value +
                    JSON.parse(body).results.bindings[1].url2.value;

                optionsKB.body = queryHasNeeds;
                request(optionsKB, function (err, res, body) {
                    if (err) {
                        console.log('Error: ', err);
                    }
                    var productNeeds = JSON.parse(body).results.bindings;
                    if (productNeeds.length != 0) {
                        // move to neighbour -> priority set according to the needed colour
                        // in relation to the pen colour in current workstation
                        for (var i = 0; i < productNeeds.length; ++i) {
                            if (robotPenColour == productNeeds[i].needs.value.split("_").pop().toUpperCase()) {
                                request.post(transportURL1, function (err, res, body) {
                                    // move to CNV 2
                                });
                                break;
                            }
                            // no match in colours found
                            else if (i+1 == productNeeds.length) {
                                request.post(transportURL2, function (err, res, body) {
                                    // move to CNV 4
                                })
                            }
                        }
                    }
                    else {
                        request.post(transportURL2, function (err, res, body) {
                            // move to CNV 4
                        })
                    }
                });
            });
        })
    });
});

// this method should be called from the checkNeighbourStatus function
// when the pallet is at a workstation and in its conveyor 3
// here we execute a drawing (recipe) command for the product
emitter.on('perform drawing',function drawPart(WSN,CNV,productID) {
    // Find out which product is at the position CNV 3 (replace 123 with productID)
    var penColour = "";
    var queryCheckPenColour = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
        "SELECT ?colour " +
        "WHERE {sn:workStation_" + WSN + " sn:checkColour ?colour.}";
    optionsKB.body = queryCheckPenColour;

    request(optionsKB, function (err,res,body) {
        request.post(JSON.parse(body).results.bindings[0].colour.value, function (err, res, body) {
            penColour = JSON.parse(body).CurrentPen;
        });
        var queryProductUnderWork = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
            "SELECT ?products " +
            "WHERE {sn:master sn:hasOrderPending ?products. ?products sn:hasPalletID ?ID. " +
            "FILTER (?ID = " + productID + ")}";
        optionsKB.body = queryProductUnderWork;

        // Find out which recipe to draw (the colour needs to match with the robot pen)
        request(optionsKB, function (err,res,body) {
            var productUnderWork = JSON.parse(body).results.bindings[0].products.value;
            var queryProductNeeds = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
                "SELECT ?needs " +
                "WHERE {<" + productUnderWork + "> sn:hasNeed ?needs.}";
            optionsKB.body = queryProductNeeds;

            request(optionsKB, function (err,res,body) {
                var productNeeds = JSON.parse(body).results.bindings;
                var recipesToDraw = [];
                for (var i = 0; i < productNeeds.length; ++i) {
                    if (penColour == productNeeds[i].needs.value.split("_").pop().toUpperCase()) {
                        (function (i) {
                            setTimeout(function () {
                                var recipe = Number(productNeeds[i].needs.value.split("_")[2]);
                                var queryDeleteNeed = "update=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
                                    "DELETE " +
                                    "WHERE {<" + productUnderWork + "> sn:hasNeed sn:recipe_" + recipe + "_" + penColour.toLowerCase() + "}";
                                InsertKB(queryDeleteNeed);
                                recipesToDraw.push(recipe);
                            },i*150);
                        })(i)
                        /*
                        (function (i) {
                            setTimeout(function () {
                                console.log(i);
                                var recipe = Number(productNeeds[i].needs.value.split("_")[2]);
                                var queryDeleteNeed = "update=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
                                    "DELETE " +
                                    "WHERE {<" + productUnderWork + "> sn:hasNeed sn:recipe_" + recipe + "_" + penColour.toLowerCase() + "}";
                                InsertKB(queryDeleteNeed);
                                request.post('http://localhost:3000/RTU/SimROB' + WSN + '/services/Draw' + recipe,
                                    function (err, res, body) {});
                            },500+i*5000);
                        })(i)
                        */
                    }
                    /*
                    if (productNeeds.length == i+1) {
                        setTimeout(function () {
                            emitter.emit('get neighbours',WSN,CNV,productID)
                        },15000);
                    }
                    */
                }
                setTimeout(function () {
                    if (recipesToDraw.length == 1) {
                        request.post('http://localhost:3000/RTU/SimROB' + WSN + '/services/Draw' + recipesToDraw[0],
                            function (err, res, body) {});
                        setTimeout(function () {
                            emitter.emit('get neighbours',WSN,CNV,productID);
                        },5000);
                    }
                    else if (recipesToDraw.length == 2) {
                        request.post('http://localhost:3000/RTU/SimROB' + WSN + '/services/Draw' + recipesToDraw[0],
                            function (err, res, body) {});
                        setTimeout(function () {
                            request.post('http://localhost:3000/RTU/SimROB' + WSN + '/services/Draw' + recipesToDraw[1],
                                function (err, res, body) {});
                        },5000);
                        setTimeout(function () {
                            emitter.emit('get neighbours',WSN,CNV,productID);
                        },10000);
                    }
                    else {
                        request.post('http://localhost:3000/RTU/SimROB' + WSN + '/services/Draw' + recipesToDraw[0],
                            function (err, res, body) {});
                        setTimeout(function () {
                            request.post('http://localhost:3000/RTU/SimROB' + WSN + '/services/Draw' + recipesToDraw[1],
                                function (err, res, body) {});
                        },5000);
                        setTimeout(function () {
                            request.post('http://localhost:3000/RTU/SimROB' + WSN + '/services/Draw' + recipesToDraw[2],
                                function (err, res, body) {});
                        },10000);
                        setTimeout(function () {
                            emitter.emit('get neighbours',WSN,CNV,productID);
                        },15000);
                    }
                },500);
            });
        });
    });
});

var palletsToBeStored = [];

// this method should be called from the checkNeighbourStatus function
// when the pallet is at the loadingstation and in its conveyor 3
// here we check if a paper should be loaded to the pallet or
// if a ready product should be unloaded
emitter.on('check for loading station needs',function loadingStationNeeds(WSN,CNV,productID) {
    // Find out which product is at the position WSN 1, CNV 3 (replace 123 with productID)
    var queryProductUnderWork = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
        "SELECT ?products " +
        "WHERE {sn:master sn:hasOrderPending ?products. ?products sn:hasPalletID ?ID. " +
        "FILTER (?ID = " + productID + ")}";
    optionsKB.body = queryProductUnderWork;

    // The logic here is to check if pallet has a paper loaded (-> if not load it)
    // Then to check if the product has any needs (-> if not unload)
    request(optionsKB, function (err, res, body) {
        var productUnderWork = JSON.parse(body).results.bindings[0].products.value;
        var queryHasPaperLoaded = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
            "SELECT ?paperLoaded " +
            "WHERE {<" + productUnderWork + "> sn:hasPaperLoaded ?paperLoaded.}";
        optionsKB.body = queryHasPaperLoaded;

        request(optionsKB, function (err, res, body) {
            if (JSON.parse(body).results.bindings[0].paperLoaded.value == false) {
                // load paper
                request.post('http://localhost:3000/RTU/SimROB1/services/LoadPaper', function (err, res, body) {
                    var querySetPaperLoadedTrue = "update=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
                        "DELETE  " +
                        "WHERE {<" + productUnderWork + ">  sn:hasPaperLoaded ?value}; " +
                        "INSERT {<" + productUnderWork + ">  sn:hasPaperLoaded 1;} " +
                        "WHERE {}";
                    InsertKB(querySetPaperLoadedTrue);
                    setTimeout(function () {
                        emitter.emit('get neighbours',WSN,CNV,productID);
                    },4300)
                });
            }
            else {
                // check if paper should be unloaded (optional: and make sure to delete it from the order
                // (contains products under work, so when it's empty the order is ready))
                var queryProductNeeds = "query=PREFIX sn:<http://www.ontologies.com/G7_fastory.owl#> " +
                    "SELECT ?needs " +
                    "WHERE {<" + productUnderWork + "> sn:hasNeed ?needs.}";
                optionsKB.body = queryProductNeeds;
                request(optionsKB, function (err,res,body) {
                    if (typeof(JSON.parse(body).results.bindings[0]) === typeof undefined) {
                        request.post('http://localhost:3000/RTU/SimROB1/services/UnloadPaper', function (err, res, body) {
                            // delete completed cellphone
                            setTimeout(function () {
                                emitter.emit('get neighbours',WSN,CNV,productID);
                            },2500)
                        });
                    }
                });
                palletsToBeStored.push(productID);
            }
        });
    });
});

// here we check which neighbours are free and proceed to move the pallets accordingly
emitter.on('checkNeighbourStatus',function checkNeighbourStatus(query,WSN,CNV,productID){

    optionsKB.body = query;     //Assembly of the new query
    request(optionsKB, function (err, res, body) {
        if (err) {
            console.log('Error :', err);
            return;
        }

        var neighbourStatusValues = [];
        var json=JSON.parse(body);
        var neighbour1;
        var neighbour2;

        if (json.results.bindings.length == 2 && WSN != 7 && WSN != 1) {
            neighbour1 = json.results.bindings[0].url1.value+json.results.bindings[0].url2.value;
            neighbour2 = json.results.bindings[1].url1.value+json.results.bindings[1].url2.value;

            var interval = setInterval(function () {
                if (neighbourStatusValues.length == 2) {
                    clearInterval(interval);
                    clearInterval(interval1);
                    clearInterval(interval2);
                    emitter.emit('neighbours checked');
                    emitter.emit('move pallet step 0',neighbourStatusValues,WSN,CNV,productID);
                }
            },600);

            var interval1 = setInterval(function () {
                request.post(neighbour1, function (error, response, body) {
                    neighbourStatusValues[0]=Number(JSON.parse(body).PalletID);
                });
            },750);

            var interval2 = setInterval(function () {
                request.post(neighbour2, function (error, response, body) {
                    neighbourStatusValues[1]=Number(JSON.parse(body).PalletID);
                });
            },750);
        }
        else {
            neighbour1 = json.results.bindings[0].url1.value+json.results.bindings[0].url2.value;
            var interval3 = setInterval(function () {
                request.post(neighbour1, function (error, response, body) {
                    neighbourStatusValues[0]=Number(JSON.parse(body).PalletID);
                    if (neighbourStatusValues[0] == -1) {
                        clearInterval(interval3);
                        emitter.emit('neighbours checked');
                        emitter.emit('move pallet step 0',neighbourStatusValues,WSN,CNV,productID);
                    }
                });
            },750);
        }
    });
});