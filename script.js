queryURL = "https://api.imgflip.com/get_memes";
var memeSelect = document.getElementById("memeSelect");
//checks if memeList exists in local storage and, if not, opens a new array in which to store them
let memeList = JSON.parse(localStorage.getItem("memeList"));
if (memeList === null) {
  memeList = [];
}
//wries the memes to the page
for (let i = 0; i < memeList.length; i++) {
  const imgURL = memeList[i];
  $(`<div id="savedImage${i}" class="img-fluid center col-12">
  <img src="${memeList[i].url}" class="storedImg img-fluid center col-12" alt="Responsive image" id="${i}"> <br> 
  <div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text">Image URL</span>
  </div>
  <input type="text" class="form-control" value="${memeList[i].url}">
  <div class="input-group-append">
    <button class="deleteBtn btn btn-outline-secondary" type="button" value="${i}" id="button-addon2">Delete</button>
  </div>
</div>
</div>
`).prependTo("#imgSlot");
}
//allow users to remove memes from their page
$(".deleteBtn").on("click", function(){
  // console.log(memeList[this.value]);
  document.getElementById("savedImage"+this.value).innerHTML=("");
  //remove element at index i from meme array
  memeList.splice(this.value,1);
  //send updated meme array to local storage
  localStorage.setItem("memeList", JSON.stringify(memeList));
})

$(".storedImg").on("dblclick", function(){
  loadMeme=memeList[this.id];
  $("#memeSelect")[0].value=loadMeme.template;
  loadBlankMeme(loadMeme.template);
  $("#fontSelect")[0].value=loadMeme.font;
  //loops through newly created text boxes and loads in meme text
  for (let i = 0; i < loadMeme.boxes.length; i++) {
    const currentBox = loadMeme.boxes[i];
    $("#textBox"+i)[0].value=currentBox.text;
  }
});

//declare these as global variables because we need them outside the first API call
var memeObject = "";
var template_id = "";
let textBoxArray = [];
//this calls the imgflip API to get a list of the top 100 most popular memes
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function (response) {
  // console.log(response);
  //saves response into global object so it can be referenced outside this function
  memeObject = response;
  //add memes to dropdown menu
  for (let i = 0; i < response.data.memes.length; i++) {
    const meme = response.data.memes[i];
    var option = document.createElement('option');
    option.text = meme.name;
    option.value = i;
    memeSelect.add(option, 0);
  }
  //creates event listener for dropdown box
  document.getElementById("memeSelect").addEventListener("change", function () {
    loadBlankMeme(this.value);
  });

});

//this loads the correct number of text boxes and load the image
function loadBlankMeme(memeID){
    template_id = memeObject.data.memes[memeID].id;
    $("#newMeme").attr("src", memeObject.data.memes[memeID].url)
    $("#newMeme").attr("alt", memeObject.data.memes[memeID].name)
    //create dropdown boxes
    document.getElementById("textBoxes").innerHTML = "";
    boxCount = memeObject.data.memes[memeID].box_count;
    for (let i = 0; i < boxCount; i++) {
      $(`<div class="form-group" id="textBox">
            <label for="textBox${i}">Text Box #${i + 1}</label>
            <input type="text" class="form-control memeTextInput" id="textBox${i}">
            </div>`).appendTo("#textBoxes");
    }
}

//this gets the final meme image from imgflip
var dataObject = { username: "abtobey", password: "41River77$" };
function getMeme() {
  dataObject.template_id = template_id;
  dataObject.boxes = textBoxArray;
  let queryURL = "https://api.imgflip.com/caption_image"

  //font selector 
  dataObject.font = $("#fontSelect")[0].value

  //imgflip POST request and pre-existing meme posts
  $.ajax({
    url: queryURL,
    method: "POST",
    data:dataObject
    }).then(function(response){
        // console.log(response);
        $("#newMeme").attr("src",response.data.url);
        memeList.push({"url":response.data.url, "boxes":textBoxArray, "font":dataObject.font, "template":$("#memeSelect")[0].value});
        localStorage.setItem("memeList", JSON.stringify(memeList));
    })
  }

//google translate
$("#submitButton").on("click", function (event) {
  let languageAbbr = document.getElementById("languageSelect").value;
  //requestsReturned counts the number of translate API requests that have been returned. This is to prevent the POST request from running until ALL lines have been translated
  let requestsReturned = 0;
  textBoxArray = [];

  event.preventDefault();
  //if language is english, no translation required, so don't waste an API call
  if (languageAbbr === "en") {
    for (let i = 0; i < document.querySelectorAll(".memeTextInput").length; i++) {
      const textBox = document.querySelectorAll(".memeTextInput")[i].value;
      textBoxArray.push({ "text": textBox })
    }
    getMeme();
  }
  else {
    //loops through each line and sends API request to google translate
    for (let i = 0; i < document.querySelectorAll(".memeTextInput").length; i++) {
      const textBox = document.querySelectorAll(".memeTextInput")[i].value;
      textBoxArray.push({ "text": "" })

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
          "target": languageAbbr
        }
      }


      $.ajax(settings).then(function (response) {
        let esText = response.data.translations[0].translatedText
        textBoxArray[i].text = esText
        requestsReturned++;
        //once ALL requests have been returned, then call getMeme function to send POST request to imgflip
        if (requestsReturned == document.querySelectorAll(".memeTextInput").length) {
          getMeme();
        }

      });
    }

  }

})

// Light/Dark Feature
document.addEventListener('DOMContentLoaded', () => {

  const themeStylesheet = document.getElementById('theme');
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
      // if it's light -> go dark
      if(themeStylesheet.href.includes('light')){
          themeStylesheet.href = 'dark-theme.css';
          themeToggle.innerText = 'Switch to light mode';
      } else {
          // if it's dark -> go light
          themeStylesheet.href = 'light-theme.css';
          themeToggle.innerText = 'Switch to dark mode';


      }
  })
})

