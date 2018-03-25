const yargs = require('yargs');
const request = require('request');

const argv = yargs
	.options({
		a:{
			alias:'address',
			demand:true,
			string:true,
			describe:"Address to fetch weather for"
		}
	})
	.help()
	.alias('help', 'h')
	.argv;

var encodedAddress = encodeURIComponent(argv.address);

console.log(argv.address);

request({
	url:`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyDv01JDb9Rbl7e7MnYQ8UBkQOVYQux-P6s`,
	json:true

}, (error, response, body)=>{
	console.log(`ADDRESS : ${body.results[0].formatted_address}`);
	console.log(`Latitude : ${body.results[0].geometry.location.lat}`);
	console.log(`Longitude : ${body.results[0].geometry.location.lng}`);
})