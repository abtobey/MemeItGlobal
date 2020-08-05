queryURL="https://api.imgflip.com/get_memes";
var memeSelect=document.getElementById("memeSelect");
//declare these as global variables because we need them outside the first API call
var memeObject="";
var template_id="";
let textBoxArray = [];
//this calls the imgflip API to get a list of the top 100 most popular memes
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
          $(`<div class="form-group" id="textBox">
            <label for="textBox${i}">Text Box #${i+1}</label>
            <input type="text" class="form-control memeTextInput" id="textBox${i}">
            </div>`).appendTo("#textBoxes");
        }
    });
  
  });

//this gets the final meme image from imgflip
var dataObject={username: "abtobey", password:"41River77$"};
  function getMeme(){
  dataObject.template_id=template_id;
  dataObject.boxes=textBoxArray;
  let queryURL="https://api.imgflip.com/caption_image"

  //imgflip POST request
  $.ajax({
    url: queryURL,
    method: "POST",
    data:dataObject
    }).then(function(response){
        console.log(response);
        $("#memeImage").attr("src",response.data.url)
    })
  }


  
  //google translate
  $("#submitButton").on("click", function(event){
    //requestsReturned counts the number of translate API requests that have been returned. This is to prevent the POST request from running until ALL lines have been translated
    let requestsReturned=0;
    textBoxArray = [];
   
    event.preventDefault();
    //loops through each line and sends API request to google translate
    for (let i = 0; i < document.querySelectorAll(".memeTextInput").length; i++) {
      const textBox = document.querySelectorAll(".memeTextInput")[i].value;  
      textBoxArray.push({"text":""})
  
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://google-translate1.p.rapidapi.com/language/translate/v2",
      "method": "POST",
      "headers": {
        "x-rapidapi-host": "google-translate1.p.rapidapi.com",
        "x-rapidapi-key": "2ca2214731msh175d550fc24141bp15c630jsne72e70687c11",
        "accept-encoding": "application/gzip",
        "content-type": "application/x-www-form-urlencoded"
      },
      "data": {
        "source": "en",
        "q": textBox,
        "target": "es"
      }
    }

  
    $.ajax(settings).then(function (response) {
      let esText = response.data.translations[0].translatedText
      textBoxArray[i].text = esText
      requestsReturned++;
      //once ALL requests have been returned, then call getMeme function to send POST request to imgflip
      if(requestsReturned==document.querySelectorAll(".memeTextInput").length){
        getMeme();
      }
      
    });
  }
  
  })
