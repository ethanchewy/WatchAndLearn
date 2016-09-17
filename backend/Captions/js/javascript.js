function reqListener () {
	x2js = new X2JS();
	jsonObj = x2js.xml_str2json( this.responseText );
	array_length = jsonObj.transcript.text.length;
	//filtered_data = JSON.parse(jsonObj);
  	console.log(this.responseText);
  	console.log(jsonObj);
  	console.log(jsonObj.length);
  	console.log(jsonObj.transcript.text.length);
  	/*
	1. for loop to parse through each object (Obj. 1, 2, 3)
	2. append each _text property value to a "total" value
	*/
	for (i = 0; i < array_length;i++){
		console.log(jsonObj.transcript.text[i].__text);
	}
}
var x2js,
	jsonObj,
	array_length,
	filtered_data;
var oReq = new XMLHttpRequest();
//var url = "https://video.google.com/timedtext?lang=en&v=" + searched_url;
oReq.addEventListener("load", reqListener);
oReq.open("GET", "https://video.google.com/timedtext?lang=en&v=apbSsILLh28");
oReq.send();
//var filtered_data = JSON.parse(jsonObj);

