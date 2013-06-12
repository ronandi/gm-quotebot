
/*
 * GET home page.
 */
var mongo = require('mongoskin');
var db = mongo.db('herokuuser:lol123@ds029328.mongolab.com:29328/heroku_app16111613', { safe:true });
var lastMessages = new FixedBuffer(10);
var Array = require('../lib/randomize');
var request = require('request');

exports.index = function(req, res){
    res.render('index', { title: 'Express' });
};

exports.handleMessage = function(req, res) {
    if(!validMessage(req.body)) {
        return;
    }
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
                console.log("Quote added!");
            return;
        });
        res.end();
        return;
    }
    if (req.body.text == "!randomquote") {
        //get a random quote
        db.collection("quotes").find().toArray(function(err, list) {
            list.shuffle();
            console.log("Randomly selected: ", list[0]);
            sendMessage(list[0]);
        });
        res.end();
        return;
    }
    var msg = { user: req.body.name, text: req.body.text };
    lastMessages.add(msg);
    console.log("Message received");
    res.end();
}

function sendMessage(msg) {
    var data = { text: msg.name + ": " + msg.text, bot_id: BOT_ID };
    request.post("https://api.groupme.com/v3/bots/post", data, function(err, response, body) {

    }); 
}

function validMessage(body) {
    if(!body || !body.name || !body.text)
        return false;
    return true;
}

function FixedBuffer(size) {
    this.limit = size;
    this.buffer = [];
}

FixedBuffer.prototype.add = function(elem) {
    if(this.buffer.length == this.limit) {
        this.buffer.shift();
    }
    this.buffer.push(elem);
}

FixedBuffer.prototype.getLast = function() {
    return this.buffer[this.buffer.length-1];
}

FixedBuffer.prototype.isEmpty = function() {
    return this.buffer.length == 0;
}
