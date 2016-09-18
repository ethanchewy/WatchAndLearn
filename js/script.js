$(document).ready(function(){
  q = $('#query').val();
  if(q != ''){
    search();
  }
  $('#search-form').submit(function(e){
  	$( "#search-form" ).remove();
    e.preventDefault();
  });

//queryDictionary("chrysanthemum");

});




function search(){

	// Clear Results
	$('#results').html('');
	$('#buttons').html('');

	// Get Form Input
	q = $('#query').val();

	// Run GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{
			part: 'snippet, id',
			q: q,
			type:'video',
			key: 'AIzaSyDsi9fqDWrh_1uop8wcW8hWHMIuPNh3vZw'},
			function(data){
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;

				$.each(data.items, function(i, item){
					// Get Output
					var output = getOutput(item);
					// Display Results
					$('#results').append(output);
				});

				var buttons = getButtons(prevPageToken, nextPageToken);

				// Display Buttons
				$('#buttons').append(buttons);
			}
	);
}

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
         var path =  "http://media.merriam-webster.com/soundc11/"+subDirectory+"/"+audioFile;
      var audioElement = document.createElement('audio');
      audioElement.setAttribute('src', path);
      audioElement.play();
     // console.log(this.responseText);
     }
 };
 xmlhttp.open("GET", url, true);
 xmlhttp.send();
}

// Next Page Function
function nextPage(){
	var token = $('#next-button').data('token');
	var q = $('#next-button').data('query');

	// Clear Results
	$('#results').html('');
	$('#buttons').html('');

	// Get Form Input
	q = $('#query').val();
	// Run GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{
			part: 'snippet, id',
			q: q,
			pageToken: token,
			type:'video',
			key: 'AIzaSyDsi9fqDWrh_1uop8wcW8hWHMIuPNh3vZw'},
			function(data){
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;

				// Log Data
				//console.log(data);

				$.each(data.items, function(i, item){
					// Get Output
					var output = getOutput(item);

					// Display Results
					$('#results').append(output);
				});

				var buttons = getButtons(prevPageToken, nextPageToken);

				// Display Buttons
				$('#buttons').append(buttons);
			}
	);
}


// Prev Page Function
function prevPage(){
	var token = $('#prev-button').data('token');
	var q = $('#prev-button').data('query');

	// Clear Results
	$('#results').html('');
	$('#buttons').html('');

	// Get Form Input
	q = $('#query').val();

	// Run GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{
			part: 'snippet, id',
			q: q,
			pageToken: token,
			type:'video',
			key: 'AIzaSyDsi9fqDWrh_1uop8wcW8hWHMIuPNh3vZw'},
			function(data){
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;

				// Log Data
				//console.log(data);

				$.each(data.items, function(i, item){
					// Get Output
					var output = getOutput(item);

					// Display Results
					$('#results').append(output);
				});

				var buttons = getButtons(prevPageToken, nextPageToken);

				// Display Buttons
				$('#buttons').append(buttons);
			}
	);
}

// Build Output
function getOutput(item){
	var videoId = item.id.videoId;
	var title = item.snippet.title;
	var description = item.snippet.description;
	var thumb = item.snippet.thumbnails.high.url;
	var channelTitle = item.snippet.channelTitle;
	var videoDate = item.snippet.publishedAt;
	var date_length = item.snippet.publishedAt.length - 14;

	// Build Output String
	var output = '<li>' +
	'<div class="list-left">' +
	'<img src="'+thumb+'">' +
	'</div>' +
	'<div class="list-right">' +
	'<h3><a href="view.html?videoId='+videoId+'?query='+q+'">'+title+'</a></h3>' +
	'<small>By <span class="cTitle">'+channelTitle+'</span> on '+videoDate.substring(0, date_length)+'</smavll>' +
	'</br>' +
	'<p>'+description+'</p>' +
	'</div>' +
	'</li>' +
	'<div class="clearfix"></div>' +
	'';

	return output;
}

// Build the buttons
function getButtons(prevPageToken, nextPageToken){
	if(!prevPageToken){
		var btnoutput = '<div class="button-container">'+'<button id="next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'"' +
		'onclick="nextPage();">Next Page</button></div>';
	} else {
		var btnoutput = '<div class="button-container">'+
		'<button id="prev-button" class="paging-button" data-token="'+prevPageToken+'" data-query="'+q+'"' +
		'onclick="prevPage();">Prev Page</button>' +
		'<button id="next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'"' +
		'onclick="nextPage();">Next Page</button></div>';
	}

	return btnoutput;
}
