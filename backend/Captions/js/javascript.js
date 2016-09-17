function reqListener () {
	var x2js = new X2JS();
	var jsonObj = x2js.xml_str2json( this.responseText );
  	console.log(this.responseText);
  	console.log(jsonObj);
}
var oReq = new XMLHttpRequest();
var url = "https://video.google.com/timedtext?lang=en&v=" + searched_url;
oReq.addEventListener("load", reqListener);
oReq.open("GET", url);
oReq.send();
