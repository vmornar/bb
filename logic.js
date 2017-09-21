const app = require ("./app.js");
const items = require ("./items.js");
var http = require ('http');

function handle(cmd) {
    console.log(cmd);
    if (cmd.command == 'set') {
        var thing = items.things.findById (cmd.id);
        var box = items.boxes.findById (thing.boxid);
        if (thing.type == "espIOpin") {
            http.get('http://{0}/control?cmd=GPIO,{1},{2}'.format(box.ip, thing.pin, cmd.value)).on('error', (e) => { });
        } 
    } else if (cmd.command == 'status') {
        for (idx in cmd.data) {
            var value = cmd.data[idx];
            app.save (idx, value);
        }
    }
}

function pollBridge () {
    var box = items.boxes[2];
    var url = 'http://{0}:{1}/?cmd=\{api_id:{2},mac:%22{3}%22\}'.format(box.ip, box.port, 1011, box.mac);
    console.log (url);
    http.get(url, function (res) {
        res.on ("data", function(chunk) {
            var v = JSON.parse (chunk.toString());
            app.save (2011, v.temperature);
        });
    }).on('error', (e) => { });
}

function sendState (socket) {
    for (let i=0; i < items.things.length; i++) {
        if (items.things[i].value != undefined) {
            var command = '{"type":"command","param":"udevice","idx":"{0}","svalue":"{1}"}'.format (items.things[i].id, items.things[i].value);
            socket.send (command);
        }
    }
}

setInterval (pollBridge, 60000);

exports.handle = handle;
exports.sendState = sendState;
