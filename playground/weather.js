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
	url:`http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
	json:true

}, (error, response, body)=>{
	console.log(`ADDRESS : ${body.results[0].formatted_address}`);
	console.log(`Latitude : ${body.results[0].geometry.lat}`);
	console.log(`Longitude : ${body.results[0].geometry.lng}`);
})