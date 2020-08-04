var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://google-translate1.p.rapidapi.com/language/translate/v2",
	"method": "POST",
	"headers": {
		"x-rapidapi-host": "google-translate1.p.rapidapi.com",
		"x-rapidapi-key": "241e327413mshff46d0a3fc5647ep185311jsne86067773ada",
		"accept-encoding": "application/gzip",
		"content-type": "application/x-www-form-urlencoded"
	},
	"data": {
		"source": "en",
		"q": "Hello, world!",
		"target": "es"
	}
}

$.ajax(settings).done(function (response) {
	console.log(response);
});