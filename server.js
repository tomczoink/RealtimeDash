/* This code will allow for data from your server to be sent through 
  Ably's Realtime channels to another device to be displayed */

const Ably = require("ably");

const ApiKey = "INSERT_API_KEY_HERE"; /* Add your API key here */
if (ApiKey.indexOf("INSERT") === 0) { throw("Cannot run without an API key. Add your key to server.js"); }

/* Instance the Ably library */
var realtime = new Ably.Realtime({ key: Apikey });
