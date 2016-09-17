
$(document).ready(function() {
    var videoId = parent.document.URL.substring(parent.document.URL.indexOf('?videoId=') + 9, parent.document.URL.indexOf('?videoId=') + 20);
    var videoHTML = getVideoHTML(videoId);
    calcWidth();
    $("#video").append(videoHTML);
    //retrieveCaptions();
    console.log("VIDE0_ID " + videoId);
    retrieveCaptions(videoId);
});

function getVideoHTML(videoId) {
    var html = "<iframe title='YouTube video player' class='youtube-player' height='100%'id='preview-frame' src='http://www.youtube.com/embed/" + videoId + "'allowFullScreen></iframe>"
    return html;
}



function reqListener () {
  x2js = new X2JS();
  jsonObj = x2js.xml_str2json( this.responseText );
  //filtered_data = JSON.parse(jsonObj);
    console.log(jsonObj);
}
function retrieveCaptions(videoId){

var x2js,
  jsonObj,
  filtered_data;
var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "https://video.google.com/timedtext?lang=en&v=" + videoId);
oReq.send();
//var filtered_data = JSON.parse(jsonObj);
}

var calcWidth = function() {
    $('#preview-frame').width($('#video').width());
}
$(window).resize(function() {
    calcWidth();
}).load(function() {
    calcWidth();
});

function queryDictionary(word){
  var xmlhttp = new XMLHttpRequest();
  var url = "https://crossorigin.me/http://www.dictionaryapi.com/api/v1/references/learners/xml/"+word+"?key=eaf69752-c354-4489-8cc6-99948b85a285";

 xmlhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
         var x2js = new X2JS();
         var jsonObj = x2js.xml_str2json( this.responseText );
        //  console.warn(jsonObj.entry_list.entry);
         if(jsonObj.entry_list.entry)
         var audioFile = jsonObj.entry_list.entry.sound?jsonObj.entry_list.entry.sound.wav:jsonObj.entry_list.entry[0].sound.wav;
         var subDirectory = "";
         if(audioFile.indexOf('bix') == 0){
           subDirectory = "bix";
         }else if (audioFile.indexOf('gg') == 0){
           subDirectory = "gg";
         }else if (/^\d\w/g.exec(audioFile) != null){
           subDirectory="number";
         }else{
           subDirectory = audioFile[0];
         }
         var path =  "http://media.merriam-webster.com/soundc11/"+subDirectory.toLowerCase()+"/"+audioFile;
      var audioElement = document.createElement('audio');
      audioElement.setAttribute('src', path);
      audioElement.play();
     // console.log(this.responseText);
     }
 };
 xmlhttp.open("GET", url, true);
 xmlhttp.send();
}
