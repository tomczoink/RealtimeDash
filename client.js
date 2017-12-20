const Ably = require("ably");

const blessed = require('blessed'),
  contrib = require('blessed-contrib'),
  screen = blessed.screen();

const ApiKey = "INSERT-API-KEY-HERE"; /* Add your API key here */
if (ApiKey.indexOf("INSERT") === 0) { throw("Cannot run without an API key. Add your key to client.js"); }

/* Instance the Ably library */
var realtime = new Ably.Realtime({ key: ApiKey });

/* Get a reference to the channel to use for site data */
var channel = realtime.channels.get("SiteData");

/* Create grid through blessed, adding line chart for active users */
var grid = new contrib.grid({rows: 13, cols: 13, screen: screen})
var activeUsersLine = grid.set(0, 0, 8, 6, contrib.line,
  { label: 'Active Users',
		wholeNumbersOnly : true
});

/* Data structure for the active users line graph */
var activeUsersData = {
  style: {line: 'red'},
  x : [],
  y : []
};


/* Add gauge displaying platform being used by users to grid view */
var platformUsersGauge = grid.set(9, 0, 4, 6, contrib.gauge,
	{ label : "User Platform: Browser/iPhone/Android",
		percent : [30, 35, 35], 
		showLegend : true
});
/* Add active users to blessed screen element, add the data for the line, then render the screen */
screen.append(activeUsersLine);
screen.append(platformUsersGauge);
activeUsersLine.setData([activeUsersData]);
screen.render();

/* Ably's subscribe functionality. Recieves data, interprets it, and then updates dashboard */
channel.subscribe(function(msg) {
  var data = JSON.parse(JSON.stringify(msg.data));
  var activeUsers = data.activeUsers;
  var time = getTime(msg.timestamp);

/* Add data to respective data structures */
  activeUsersData.y.push(activeUsers);
  activeUsersData.x.push(time.toString());
  
/* Cap number of data elements being shown */
	if(activeUsersData.y.length >= 40) {
		activeUsersData.y.shift();
    activeUsersData.x.shift();
	}

/* Update data visualised on screen */
  activeUsersLine.setData([activeUsersData]);
  platformUsersGauge.setData([data.browserUsers, data.iPhoneUsers, data.androidUsers]);
  screen.render();
});

/* Function to convert Ably's timestamp into a time of day */
function getTime(timeS) {
  var date = new Date(timeS);
	var h = "0" + date.getHours();
	var m = "0" + date.getMinutes();
	var s = "0" + date.getSeconds();

	var returnTime = h.substr(-2) + ':' + m.substr(-2) + ':' + s.substr(-2);
	return returnTime;
}

screen.on('resize', function() {
	activeUsersLine.emit('attach');
});
