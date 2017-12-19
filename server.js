/* This code will allow for data from your server to be sent through 
  Ably's Realtime channels to another device to be displayed */

const Ably = require("ably");

const ApiKey = "INSERT-API-KEY-HERE"; /* Add your API key here */
if (ApiKey.indexOf("INSERT") === 0) { throw("Cannot run without an API key. Add your key to server.js"); }

/* Instance the Ably library */
var realtime = new Ably.Realtime({ key: ApiKey });

/* Get a reference to the channel to use for site data */
var channel = realtime.channels.get("SiteData");

/* data contains all data to be sent to the client, activeUsers is one element of data */
var data
var activeUsers = Math.round(Math.random()*10000)

/* Get data into JSON format. Could try getting it from Google Analytics for example */
function getData() {
  activeUsers += Math.round((Math.random()*2-1)*10)
  data = {"activeUsers":activeUsers.toString()}
}

/* Create a function which will publish data to the channel */
function publishData() {
  getData() 
  channel.publish("ServerData", data);
}

/* Update data every 3 seconds */
setInterval(publishData, 3000);

/* Uncomment this to recieved messages in this code */
/*
channel.subscribe(function(msg) {
  console.log("Recieved: " + JSON.stringify(msg.data));
});
*/
