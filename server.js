/* This code will allow for data from your server to be sent through 
  Ably's Realtime channels to another device to be displayed */

const Ably = require("ably");

const ApiKey = "INSERT-API-KEY-HERE"; /* Add your API key here */
if (ApiKey.indexOf("INSERT") === 0) { throw("Cannot run without an API key. Add your key to server.js"); }

/* Instance the Ably library */
var realtime = new Ably.Realtime({ key: ApiKey });

/* Get a reference to the channel to use for site data */
var channel = realtime.channels.get("SiteData");

/* data contains all data to be sent to the client */
var data;

/* There variables are fake data, but easily replaced by real values */
var activeUsers = 10 + Math.round(Math.random()*10);
var browserUsers = Math.round(Math.random()*100);
var iPhoneUsers = Math.round((100 - browserUsers) * Math.random());
var androidUsers = 100 - browserUsers - iPhoneUsers;

/* Get data into JSON format. Could try getting it from Google Analytics for example */
function getData() {
  activeUsers += Math.round((Math.random()*2-1));
	var change = Math.round(2* ((Math.random()*2 - 1)));
	if(browserUsers + change > 100 || browserUsers + change < 0 
		|| iPhoneUsers - change > 100 || iPhoneUsers - change < 0) {
		change *= -1;
	}
  browserUsers += change;
	iPhoneUsers -= change;
  data = {"activeUsers": + activeUsers, 
					"browserUsers": + browserUsers,
					"iPhoneUsers": + iPhoneUsers,
					"androidUsers": + androidUsers
				 };
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
  var dataClient = JSON.parse(JSON.stringify(msg.data));
  console.log("Recieved: " + dataClient.activeUsers);
	console.log("Browser users: " + dataClient.browserUsers);
	console.log("iPhone users: " + dataClient.iPhoneUsers);
	console.log("Android users: " + dataClient.androidUsers);

});
*/

