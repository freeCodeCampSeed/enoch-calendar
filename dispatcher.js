// const cron = require('node-cron');
// const fetch = require('node-fetch');

import cron from 'node-cron';
import fetch from 'node-fetch';

let holydates = [
  ['New Year', '0 6 17 3 *'],
  ['Passover Begins Tomorrow', '0 6 29 3 *'],
  ['Passover', '0 6 30 3 *'],
  ['Feast of Unleavend Bread', '0 6 31 3 *'],
  ['Feast of Unleavend Bread', '0 6 1-6 4 *'],
  ['Feast of Trumpets Begins Tomorrow', '0 6 14 9 *'],
  ['Feast of Trumpets', '0 6 15 9 *'],
  ['Tonight, Day of Atonement Sabbath Begins. Day of Atonement Begins Tomorrow', '0 7 23 9 *'],
  ['Day of Atonement Sabbath Begins', '30 18 23 9 *'],
  ['Day of Atonement', '0 6 24 9 *'],
  ['Feast of Tabernacles Begins Tomorrow', '0 6 28 9 *'],
  ['Feast of Tabernacles', '0 6 29-30 9 *'],
  ['Feast of Tabernacles', '0 6 1-6 10 *'],
  ['New Month', '0 6 17 3 *'],
  ['New Month', '0 6 16 4-7 *'],
  ['New Month', '0 6 15 8-10,12 *'],
  ['New Month', '0 6 14 11,1 *'],
  ['New Month', '0 6 13 2 *'],
  ['Sabbath Day', '0 6 * * Wed'],
  ['Sabbath Day', '0 6 31 3 *'],
  ['Sabbath Day', '0 6 6 4 *'],
  ['Sabbath Day', '0 6 15 9 *'],
  ['Sabbath Day', '0 6 29 9 *'],
  ['Sabbath Day', '0 6 6 10 *'],
];

let offsets = [0,1,2,3,4,5,6,7,8,9,10,11,12,-1,-2,-3,-4,-5,-6,-7,-8,-9,-10,-11,-12,-13,-14];

holydates.forEach( date => {
  offsets.forEach( offset => {
    scheduleEvent(date[1], date[0], offset);
  })
})

function scheduleEvent(holydate, holyday, offset)
{
	let gmt_offset;

	if ( parseInt(offset) == 0 || parseInt(offset) == -13 || parseInt(offset) == -14 ) 
		gmt_offset = offset;
	else 
		gmt_offset = offset > 0  ? offset*-1+"" : "+"+offset*-1;

	// Schedule tasks to be run on the server.
	cron.schedule(holydate, async function() {
 	 // let params = `method=onHolyday&holydate=${holydate}&holyday=${holyday}&gmt_offset=${gmt_offset}`;
 	 // let service = "https://openvisionnetworks.com/service/api/v1/onholyday.php?"+ params;

         let params = `${holydate}/${holyday}/${gmt_offset}`;
         let service = `https://openvisionnetworks.com/notifications/api/v1/onholyday/${params}`;
	 const response = await fetch(service); //('https://github.com/');
 	 const body = await response.text();

    console.log(`${new Date()}: Event ${service} from Etc/GMT${gmt_offset} triggered.`);
    console.log(body);
	}, {
	 scheduled: true,
	 timezone: `Etc/GMT${gmt_offset}`
	});
}

console.log('Holy Day Event Dispatcher running.');
