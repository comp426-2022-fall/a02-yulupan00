#!/usr/bin/env node

import minimist from 'minimist';
import fetch from 'node-fetch';
import moment from 'moment-timezone';


const args = minimist(process.argv.slice(2));

if(args.h){
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE \n \
    -h            Show this help message and exit. \n \
    -n, -s        Latitude: N positive; S negative. \n \
    -e, -w        Longitude: E positive; W negative. \n \
    -z            Time zone: uses tz.guess() from moment-timezone by default. \n \
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1. \n \
    -j            Echo pretty JSON from open-meteo API and exit." 
    );
    process.exit();
}


const timezone = args.z ? args.z : moment.tz.guess()
var lat = args.n ? args.n : args.s;
var long = args.e ? args.e : args.w;
var day = args.d ? args.d : 1;
var start = moment().format("YYYY-MM-DD"); 
var end = moment().add(day,'days').format("YYYY-MM-DD");
var url = "https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+long+"&daily=precipitation_hours&temperature_unit=fahrenheit&timezone="+timezone+"&start_date="+start+"&end_date="+end+",precipitation_hours";
const response = await fetch(url);
const data = await response.json();
const days = args.d; 

if (data["daily"]["precipitation_hours"][days] != 0) {
    console.log("You might need your galoshes");
  } else {
    console.log("You will not need your galoshes");
}

if (days == 0) {
    console.log("today.");
  } else if (days > 1) {
    console.log("in " + days + " days.");
  } else {
    console.log("tomorrow.");
}

if(args.j) {
    console.log(data);
    process.exit();
}
console.log(data);