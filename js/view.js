var wordMap;
$(document).ready(function() {

       wordMap = new Map();
    var videoId = parent.document.URL.substring(parent.document.URL.indexOf('?videoId=') + 9, parent.document.URL.indexOf('?videoId=') + 20);
    var videoHTML = getVideoHTML(videoId);
    calcWidth();

    $("#video").append(videoHTML);
    retrieveCaptions(videoId);

});
$(document).on("click", "i", function() {
  var audioElement = document.createElement('audio');
  audioElement.setAttribute('src', $(this).data("sound"));
  audioElement.play()
});

function makeItToASpan(){
  $('p').each(function() {
      var $this = $(this);
      $this.html($this.text().replace(/\b(\w+)\b/g, "<span rel='popover'  data-toggle='popover' data-content=''>$1</span>"));
  });

  $('p span').each(function(){
       if(wordMap.get($(this).text()) == null){
        queryDictionary($(this).text(),$(this));
      }else{
        var mainDef = wordMap.get($(this).text()).mainDef;
        var pr = wordMap.get($(this).text()).pronounciation;
        var speechPart = wordMap.get($(this).text()).speechPart;;
        var word = $(this.text())
        $(this).attr('data-content', '<div class="popup"><b>'+word+'</b></div>');
      }
  });



    $('p span').on('click',function(){
    $('p span').css('background-color','transparent');
       $(this).css('background-color','#ffff66');
       queryImages($(this).text());
       //translate($(this).text());
       queryTranslation($(this).text());
       console.log("CALLED_TRANSLATION")
       if(wordMap.get($(this).text()) == null){
        queryDictionary($(this).text(),$(this));
      }
    });
}
function getVideoHTML(videoId) {
    var html = "<iframe title='YouTube video player' class='youtube-player' height='100%'id='preview-frame' src='http://www.youtube.com/embed/" + videoId + "'allowFullScreen></iframe>"
    return html;
}



function reqListener () {
  x2js = new X2JS();
  var total_caption = "";
  jsonObj = x2js.xml_str2json( this.responseText );
  array_length = jsonObj.transcript.text.length;
  //filtered_data = JSON.parse(jsonObj);
    /*
  1. for loop to parse through each object (Obj. 1, 2, 3)
  2. append each _text property value to a "total" value
  */
  for (i = 0; i < array_length;i++){
    total_caption += jsonObj.transcript.text[i].__text;
  }
  //console.log(total_caption);
  $("#captions").append(total_caption);
  makeItToASpan();
  $('[data-toggle="popover"]').popover({html:true});


}
function retrieveCaptions(videoId){

  var x2js,
    jsonObj,
    array_length,
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

function queryImages(word){
    var xmlhttp = new XMLHttpRequest();
    //var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&tags=" + word + "&api_key=ff12a1da05f0667004a7c173cfeab461&per_page=5&format=rest";
var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&tags="+word+"&sort=relevance&api_key=ff12a1da05f0667004a7c173cfeab461&per_page=5&format=rest";
    xmlhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {

      var x2js = new X2JS();
      var jsonObj = x2js.xml_str2json( this.responseText );
      var photos = jsonObj.rsp.photos.photo;
      var photos_lng = jsonObj.rsp.photos.photo.length;
      for (i=0; i< photos_lng;i++){
        var photo = photos[i];
        //console.log(photo);
        var img_src = "https://farm"+photo["_farm"] + ".staticflickr.com/"+photo["_server"] + "/"+photo["_id"] + "_"+photo["_secret"]+".jpg";
        var img_tag = "<img src='"+img_src+"' height='200' width='200'>";
        $('.popup').append(img_tag);

        //console.log(img_src);
      }


   }

  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function queryDictionary(word, currentElement){
  var xmlhttp = new XMLHttpRequest();
  var url = "https://crossorigin.me/http://www.dictionaryapi.com/api/v1/references/learners/xml/"+word+"?key=eaf69752-c354-4489-8cc6-99948b85a285";

 xmlhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
         var x2js = new X2JS();
         var jsonObj = x2js.xml_str2json( this.responseText );
         if(jsonObj.entry_list.entry){
         var audioFile = jsonObj.entry_list.entry[0]?(jsonObj.entry_list.entry[0].sound?jsonObj.entry_list.entry[0].sound.wav:null):(jsonObj.entry_list.entry.sound?jsonObj.entry_list.entry.sound.wav:null);//null;//jsonObj.entry_list.entry[0]?(jsonObj.entry_list.entry.sound?jsonObj.entry_list.entry.sound.wav:jsonObj.entry_list.entry[0].sound.wav):jsonObj.entry_list.entry.sound.wav;
         var subDirectory = "";
         if(audioFile){
         if(audioFile.indexOf('bix') == 0){
           subDirectory = "bix";
         }else if (audioFile.indexOf('gg') == 0){
           subDirectory = "gg";
         }else if (/^\d\w/g.exec(audioFile) != null){
           subDirectory="number";
         }else{
           subDirectory = audioFile[0];
         }
       }
     }else{
       //console.warn(word);
     }
        if(subDirectory)
         var path =  "http://media.merriam-webster.com/soundc11/"+subDirectory.toLowerCase()+"/"+audioFile;
      // var audioElement = document.createElement('audio');
      // audioElement.setAttribute('src', path);
      // audioElement.play()

      var mapObject = {
        'sound':path,
        'pronounciation':jsonObj.entry_list.entry?(jsonObj.entry_list.entry[0]?jsonObj.entry_list.entry[0].pr:jsonObj.entry_list.entry.pr):null,
        'speechPart':jsonObj.entry_list.entry?(jsonObj.entry_list.entry[0]?jsonObj.entry_list.entry[0].fl:jsonObj.entry_list.entry.fl):null,
        'mainDef':jsonObj.entry_list.entry?(jsonObj.entry_list.entry[0]?(jsonObj.entry_list.entry[0].def.dt[0]?jsonObj.entry_list.entry[0].def.dt[0].__text:jsonObj.entry_list.entry[0].def.dt.__text):(jsonObj.entry_list.entry.def.dt.__text)):null,
        'word':word
      };
      wordMap.set(word,mapObject);
      $(currentElement).attr('data-content', '<div class="popup"><b>'+word+' | <span class="grey">n'+mapObject.pronounciation+'</span> <span class="speechPart">&nbsp;'+mapObject.speechPart+'&nbsp;&nbsp;<i data-sound="'+path+'"class="fa fa-volume-up test" aria-hidden="true"></i></span></b>&nbsp<span class="translation"></span><br/>&nbsp;&bull;&nbsp;<span class="definition">'+(mapObject.mainDef!=undefined?(mapObject.mainDef.split(':')[1]):null)+'</span></div>');

     }
 };
 xmlhttp.open("GET", url, true);
 xmlhttp.send();
}




function queryTranslation(word){
  console.log("ENTERED_TRANSLATION");
   var xmlhttp = new XMLHttpRequest();
   //replace the destination language with user's native language
   
   var url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160917T195632Z.2f34ef1b4e3cda55.b0ee170e6af547187486da49007ce5d938ddbe78&text="+word+"&lang=es";

   xmlhttp.onreadystatechange = function() {
    console.log("RECIEVED_RESULT")
     if (this.readyState == 4 && this.status == 200) {
        
        var responseText = this.responseText;
        console.log("responseText: " + responseText);

        var jsonObj = JSON.parse(this.responseText);
        var text = jsonObj.text
        console.log("yessir: " + text);

        $('.translation').text(text);
     }
     else{
      console.log("STATUS: " + this.status);
      console.log("TRANSLATION_ERR");
     }

   }

   xmlhttp.open("GET", url, true);
   xmlhttp.send();
}