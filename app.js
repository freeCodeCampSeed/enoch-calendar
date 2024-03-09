// const Calendar = require('./Calendar.js');
// const Calendar = require('./Universal.js');
// const express = require("express");
// const { spawn } = require('child_process');

import { Calendar } from './Calendar.js'; //'./public/Cal.js';
import express from 'express';
import { spawn } from 'child_process';
const dispatcher = spawn('node', ['dispatcher.js']);

dispatcher.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

dispatcher.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

dispatcher.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
const app = express();

app.use(express.static('public'));
app.use(express.json());

let PORT = process.env.PORT || 3333;
let cal = new Calendar(); //(new Date('Sep 24 2021 5:46:00'));

let today = cal.today;
let month = cal.month;
let day   = cal.day;
let date  = cal.date;
let sabbath = cal.isSabbath;
let holyday = date.holyday;//.name;
// let eng_today = {};
// [eng_today['day'], eng_today['month'], eng_today['date']] = today.split(' ');

// console.log('Today: ', eng_today)
console.log('This month: ' + month)
console.log('This day: ' + day)
console.log('This date: ' + date.number)
console.log('This Sabbath: ' + sabbath)
console.log('Is Holy day: ', holyday) //date.holyday.name)


function clearBraces(req, res, next) // let sRes = str.length > 2 ? str.substring(1, str.length-1) : '';
{
//    req.params.datestring = 'defined'; //!req.params.datestring || decodeURI(req.params.datestring) == '{datestring}' || !decodeURI(req.params.datestring).length <= 2 || decodeURI(req.params.datestring) === 'undefined'  ? 'undefined' : req.params.datestring;  // dt === undefined ? '' : dt; 
//    req.params.month      = 'defined'; //!req.params.month      || decodeURI(req.params.month)      == '{month}'      || !decodeURI(req.params.month).length <= 2      || decodeURI(req.params.month) 	 === 'undefined'  ? 'undefined' : req.params.month;   	   // mt === undefined ? '' : mt;
//    req.params.year       = 'defined'; //!req.params.year       || decodeURI(req.params.year) 	  == '{year}'       || !decodeURI(req.params.year).length <= 2       || decodeURI(req.params.year) 	     === 'undefined'  ? 'undefined' : req.params.year;   	   // yr === undefined ? '' : yr;

   next();
}

// app.use(clearBraces);
app.use(express.static('public'))

// app.get('/', (req, res) => {
//     res.send(`Enoch Calendar`);
// });

app.get('/date/:datestring?', clearBraces, (req, res) => {
    if ( req.params.datestring !== 'undefined' )
    {
	// console.log('typeof req.params.datestring: ' + typeof req.params.datestring);
	cal.atDate(new Date(req.params.datestring+'T05:46:00'));
        // cal.atDate(new Date(req.params.datestring+'T05:46:00'));
        res.send({'date': cal.date});
    }
    else
        res.send({date});
});

app.get('/month/:datestring?', clearBraces, (req, res) => {
    if ( req.params.datestring !== 'undefined' )
    {
        cal.atDate(new Date(req.params.datestring+'T05:46:00'));
        res.send({'month': cal.month});
    }
    else
        res.send({month});
});

app.get('/count-of-days/:datestring?', (req, res) => { // countofday
    if ( req.params.datestring ) // !== 'undefined' )
    {
        cal.atDate(new Date(req.params.datestring+'T05:46:00'));
        res.send({'day': cal.day});
    }
    else
        res.send({day});
});

app.get('/hebrew-date-from/:datestring?', clearBraces, (req, res) => {
    if ( req.params.datestring !== 'undefined' )
    {
        cal.atDate(new Date(req.params.datestring+'T05:46:00'));
        sabbathday = cal.date.number%7 ? false : true;
        res.send({'month': cal.month,'date': cal.date, sabbathday});
    }
    else
    {
        sabbathday = cal.date.number%7 ? false : true;
        res.send({month, date, sabbathday});
    }
});

app.get('/is-sabbath-day/:datestring?', clearBraces, (req, res) => {
    if ( req.params.datestring !== 'undefined' )
    {
        cal.atDate(new Date(req.params.datestring+'T05:46:00'));
        res.send({'sabbath': cal.isSabbath});
    }
    else
        res.send({sabbath});
});

app.get('/is-holyday/:datestring?', clearBraces, (req, res) => {
    if ( req.params.datestring !== 'undefined' )
    {
        cal.atDate(new Date(req.params.datestring+'T05:46:00'));
        res.send({'holyday': cal.date.holyday});
    }
    else
        res.send({holyday});
});

// app.get('/at', (req, res) => { // formatted, full date at
//     res.send({fulldate});
// });

function gregorian_calendar_date_from_enoch_first_day(day_num=null, month_num=null, format=null) // // toString, toISOString
{
  let startdays = [1,31,61,92,122,152,183,213,243,274,304,334];
  let day_milli = 86400000;
  let full_year = new Date().getFullYear()
  let date_str = full_year%4 ? full_year+'-03-17T05:46' : full_year+'-03-16T05:46'
  let d = new Date(date_str);
  let month_day_count = month_num%3 ? 30 : 31; 
  let enoch_day_num = month_num ? startdays[parseInt(month_num)-1] : day_num ? day_num : false;
  if ( !enoch_day_num ) return false;
  // console.log('Month day count ' + month_day_count)
  
  if ( !format )
    return new Date((d.getTime()-day_milli)+(day_milli*enoch_day_num))
  else
    return new Date((d.getTime()-day_milli)+(day_milli*enoch_day_num))[format](); 
}

app.get('/date-elements/:month?/:year?', (req, res) => { // return a all the days, sabbaths, holy days and eng_day and eng_date in requested month

/* Get eng_date
let month = 9;
let daysofweek = ['sun','mon','tues','wed','thur','fri','sat'];
let day_milli = 86400000;
let startdays = [1,31,61,92,122,152,183,213,243,274,304,334];
let startdaycount = startdays[parseInt(month)-1] || null;
let yearOffset = month == 11 || month == 12 ? year-1 : year;
let dateFirstOfYear = new Date(yearOffset + '-03-17T05:46:00');
let sabbathday = daysofweek[dateFirstOfYear.getDay()-1]
let numberOfDays = startdaycount*day_milli;
let eng_date_from_hebrew_start_of_month = new Date(dateFirstOfYear.getTime()+(numberOfDays-day_milli));
let eng_date = eng_date_from_hebrew_start_of_month;
console.log(eng_date);
console.log(new Date(eng_date.getTime()+day_milli).toString(), eng_date.toString(), 'sabbath ' + sabbathday);
// Mon Feb 14 2022 04:00:00 GMT-0500 (Eastern Standard Time) 'Sun Feb 13 2022 04:00:00 GMT-0500 (Eastern Standard Time)' 'sabbath tues'
 */
 
    let date;
    let daysofweek = ['sun','mon','tue','wed','thu','fri','sat'];
    let startdays = [1,31,61,92,122,152,183,213,243,274,304,334];
    // this.day==91||this.day==182||this.day==273||this.day==364
    let month = req.params.month ? req.params.month : cal.month;
    let year  = req.params.year  ? req.params.year  : new Date().getFullYear();
    let out   = {};
    let day_milli = 86400000;
    let holydays = cal.holydays(month);
    let startdaycount = startdays[parseInt(month)-1] || null;
    let yearOffset = month == 11 || month == 12 ? year-1 : year;
    // let firstOfYear = new Date().getFullYear()%4 ? '-03-17T05:46:00' : '-03-16T05:46:00';
    let firstOfYear = yearOffset%4 ? '-03-17T05:46:00' : '-03-16T05:46:00';
    let dateFirstOfYear = gregorian_calendar_date_from_enoch_first_day(1) // new Date(yearOffset + firstOfYear);
    let sabbathday = daysofweek[dateFirstOfYear.getDay()-1]
    let numberOfDays = startdaycount*day_milli;
    let eng_date_from_hebrew_start_of_month = gregorian_calendar_date_from_enoch_first_day(null, month) // new Date(dateFirstOfYear.getTime()+(numberOfDays-day_milli));
    let eng_date = eng_date_from_hebrew_start_of_month;

    // let _date = "March 15 " + new Date().toDateString().split(' ')[3]
    // console.log(new Date(_date).toDateString())
    /*
        //const moonLanding = new Date('2021');
        // console.log(new Date('2021', 5).getFullYear());
        let day_milli = 86400000;
        // let days_15 = day_milli*15;
        let _date = "March 17 " + new Date().toDateString().split(' ')[3] + " 00:00:00"
        //let _date = new Date();
        let newyear = new Date(_date).getTime()/day_milli; 
        let ny      = new Date(_date).getTime();

        let intercal = day_milli*3
        // let target_date = new Date("Dec 25 2021 23:59:59").getTime();
        // let today_temp   = new Date(target_date+intercal).getTime();
        let today   = new Date().getTime(); //new Date("Sept 4 2021 23:59:59").getTime();
        let today_milli   = today/day_milli; // new Date(_date).getTime()/day_milli;
        let days_into_month = (((today_milli - newyear)/30.3333333)%1)*30; 
        // console.log(new Date().getTime()/day_milli);//.toDateString())
        console.log('Milli: ', (today-ny)); // milli sec from hebrew new year to today
console.log('ny: ', (ny)); // milli sec from javascript epoch to hebrew new year
console.log('newyear: ', (newyear)); // days from javascript epoch to hebrew new year

        console.log('Days into month:', days_into_month);
        // console.log( new Date(today-((0)+(day_milli*days_into_month))).toDateString() ) // eng_date. 19 = day into the month
        // console.log(new Date(_date).getTime()/day_milli);//.toDateString())
        console.log(new Date(today-((today_milli - newyear))).toDateString());
        console.log( ((today_milli - newyear)/30)+1 + ' month', (today_milli - newyear) + ' days' )
        console.log( ((today_milli - newyear)/30)+1 + ' months', (((today_milli - newyear)/30.3333333)%1)*30 + " days");
        console.log(new Date( today - (((today_milli - newyear)/30.3333333)%1)*30 ) )
       // console.log(new Date((today_milli - newyear)/30) )
    */

    // if ( parseInt(month)/3%1 )
    // {
    //     out = new Array(30); // "Thirty days";
    //     //date = new Date("March 17 " + year || new Date().toDateString().split(' ')[3])
    // }
    // else
    // {
    //     out = new Array(31); // "Thirty-one days";
    // }

    out = parseInt(month)/3%1 ? 30 : 31;

    res.send({'days': out, month, date: cal.date.number, day_milli, eng_start_date: eng_date, eng_start_date_milli: eng_date.getTime(), holydays, sabbathday});
});


app.listen(PORT, e => console.log(`Listen on port ${PORT}`));
