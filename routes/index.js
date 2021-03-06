
/*
 * GET home page.
 */
var request = require('request');
var mongo = require('mongoskin');
var FixedBuffer = require('../lib/fixed_buffer');
var Array = require('../lib/randomize');
var db = mongo.db('herokuuser:lol123@ds029328.mongolab.com:29328/heroku_app16111613', { safe:true });
var lastMessages = new FixedBuffer(10);
var BOT_ID = "3fbb4f691e4e00ab72c3c5bdd7";

exports.index = function(req, res){
    res.render('index', { title: 'Express' });
};

exports.handleMessage = function(req, res) {
    if(!validMessage(req.body)) {
        return;
    }
    console.log(req.body);
    if (req.body.text == "!quotelast") {
        if (lastMessages.isEmpty()) {
            res.end();
            return;
        }
        var lastMsg = lastMessages.getLast();
        db.collection("quotes").insert(lastMsg, function(err) {
            if (err)
                console.log(err);
            else 
                console.log("[DEBUG] Quote added to database!");
            return;
        });
        res.end();
        return;
    }
    if (req.body.text == "!randomquote") {
        //get a random quote
        db.collection("quotes").find().toArray(function(err, list) {
            list.shuffle();
            sendMessage(list[0]);
        });
        res.end();
        return;
    }
    var msg = { user: req.body.name, text: req.body.text };
    lastMessages.add(msg);
    console.log("[DEBUG] Message received");
    res.end();
}

function sendMessage(msg) {
    var data = { form: { text: msg.user + ": " + msg.text, bot_id: BOT_ID } };
    console.log("SENDING: ");
    console.log(data);
    request.post("https://api.groupme.com/v3/bots/post", data, function(err, response, body) {
      if(err)
        console.log("[DEBUG] An error has occured sending a message");
      else {
        console.log(body);
      }
    }); 
}

function validMessage(body) {
    if(!body || !body.name || !body.text)
        return false;
    return true;
}

