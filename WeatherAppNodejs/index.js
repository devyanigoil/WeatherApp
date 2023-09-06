//type nodemon index.js on terminal
//type localhost:8000 on web browser
const http = require('http');
const fs = require('fs');
var requests = require("requests");

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempval,orgval) => {
	let temperature = tempval.replace("{%tempval%}",(orgval.main.temp-273.15).toFixed(2));
	temperature = temperature.replace("{%tempmin%}",(orgval.main.temp_min-273.15).toFixed(2));
	temperature = temperature.replace("{%tempmax%}",(orgval.main.temp_max-273.15).toFixed(2));
	temperature = temperature.replace("{%location%}",orgval.name);
	temperature = temperature.replace("{%country%}",orgval.sys.country);
	temperature = temperature.replace("{%tempstatus%}",orgval.weather[0].main);

	return temperature;
};
const server = http.createServer((req,res) => {
	if(req.url=="/"){
		requests("https://api.openweathermap.org/data/2.5/weather?q=Ghaziabad&appid=322eb948758085cc1230f1eb24516130")
		.on('data', function (chunk){
			const objectdata = JSON.parse(chunk);
			const arr = [objectdata];
  			//console.log(arr[0].main.temp);
  			const realTimeData = arr.map(val=>replaceVal(homeFile,val)).join("");
			res.write(realTimeData);
			//console.log(realTimeData);
		})
		.on('end', function (err){
  			if (err) return console.log('connection closed due to errors', err);
 			res.end();
  			//console.log('end');
		});
	}
});

server.listen(8000,"127.0.0.1");