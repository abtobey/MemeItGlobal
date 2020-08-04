queryURL="https://api.imgflip.com/get_memes";
var memeSelect=document.getElementById("memeSelect");
var memeObject=""
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
        $("#memeImage").attr("src",response.data.memes[this.value].url)
        $("#memeImage").attr("alt",response.data.memes[this.value].name)
        //create dropdown boxes
        boxCount=response.data.memes[this.value].box_count;
        console.log(boxCount);
        for (let i = 0; i < boxCount; i++) {
            $(`<label for="textBox${i}">Text Box #${i+1}</label><input type="text" id="textBox${i}"><br>`).appendTo("#textBoxes");
        }
    });
  
  });
  function getMeme(){
  $.ajax({
    url: queryURL,
    method: "POST",
    data:{username: "abtobey", password:"41River77$"}
    }).then(function(response){
        
    })
  }

  