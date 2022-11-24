var ws;
var wsUri = "ws:";
var loc = window.location;
console.log(loc);
if (loc.protocol === "https:") { wsUri = "wss:"; }
// This needs to point to the web socket in the Node-RED flow
// ... in this case it's ws/simple
wsUri += "//" + loc.host + loc.pathname.replace("vr_pedana","ws/vr_webpage");

console.log("connecting...", wsUri);

window.onload = function () {
    console.log("on load");
    wsConnect(); 
}

function wsConnect() {
    console.log("connect: ",wsUri);
    ws = new WebSocket(wsUri);
    //var line = "";    // either uncomment this for a building list of messages
    ws.onmessage = function(msg) {
        //console.log("on message, messaggio ricevuto: ",msg);

        let myObj = JSON.parse(msg.data);
        switch (myObj.function) {

			case 'rotazione':
                //in radianti
                globalObject.giunto_bracci = myObj.value.giunto_bracci;
                globalObject.giunto_piattaforma = myObj.value.giunto_piattaforma;
                break;
			
			case 'messages':
				break;
        }

    }
    ws.onopen = function() {
        // update the status div with the connection status
        //document.getElementById('status').innerHTML = "WebSocket Connessa";
        
        //ws.send("Open for data");
        console.log("connesso");
    }
    ws.onclose = function() {
        // update the status div with the connection status
        //document.getElementById('status').innerHTML = "WebSocket NON Connessa";
        // in case of lost connection tries to reconnect every 3 secs
        setTimeout(wsConnect,3000);
    }

}