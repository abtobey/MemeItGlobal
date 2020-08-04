$("translateIt").on("click", function(event){

	event.preventDefault();

	var enText = $("#textArea").val().trim();
	

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
		// console.log(response);
		let esText = $("newText").text(respone.data.translations[0].translatedText)
		textArea.append(esText)

	});

})

queryURL="https://api.imgflip.com/get_memes";
var memeSelect=document.getElementById("memeSelect");
//declare these as global variables because we need them outside the first API call
var memeObject=""
var template_id=""
$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
      console.log(response);
      //saves response into global object so it can be referenced outside this function
      memeObject=response;
      //add memes to dropdown menu
      for (let i = 0; i < response.data.memes.length; i++) {
        const meme = response.data.memes[i];
        var option = document.createElement('option');
        option.text = meme.name;
        option.value = i;
        memeSelect.add(option, 0);
      }
      //creates event listener for dropdown box
      document.getElementById("memeSelect").addEventListener("change",function() {
        console.log(this.value);
        template_id=response.data.memes[this.value].id;
        $("#memeImage").attr("src",response.data.memes[this.value].url)
        $("#memeImage").attr("alt",response.data.memes[this.value].name)
        //create dropdown boxes
        document.getElementById("textBoxes").innerHTML="";
        boxCount=response.data.memes[this.value].box_count;
        console.log(boxCount);
        for (let i = 0; i < boxCount; i++) {
          $(`<div class="form-group" id="textArea">
            <label for="textBox${i}">Text Box #${i+1}</label>
            <input type="text" class="form-control memeTextInput" id="textBox${i}">
            </div>`).appendTo("#textBoxes");
        }
    });
  
  });
$("#submitButton").on("click",function(){
  
  getMeme();
})
let boxes=[];
var dataObject={username: "abtobey", password:"41River77$"};
  function getMeme(){
  dataObject.template_id=template_id;
  for (let i = 0; i < document.querySelectorAll(".memeTextInput").length; i++) {
    let textBox = document.querySelectorAll(".memeTextInput")[i].value;
    boxes.push({"text":textBox})
    console.log(boxes);
  }
  dataObject.boxes=boxes;
  console.log(dataObject);
  let queryURL="https://api.imgflip.com/caption_image"
  // $.ajax({
  //   url: queryURL,
  //   method: "POST",
  //   data:dataObject
  //   }).then(function(response){
  //       console.log(response);
  //       $("#memeImage").attr("src",response.data.url)
  //   })
  }

  
