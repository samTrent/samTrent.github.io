console.log("TEST!");

var dataURL = "http://samshomepage.dx.am/myWalmartWebpage/data.txt";
var walmartlabsURL = "http://api.walmartlabs.com/v1/search?query=ipod&format=json&apiKey=cbdm5w2yfksg5nyxwaxwf92m";

//AJAX req
function ajaxReq()
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function()
  {
    //check to see if there was a success
    if(this.readyState == 4 && this.status == 200)
    {
      //load the data into the html section
      document.getElementById('ajaxSection').innerHTML = this.responseText;
      console.log(this.responseText);
    }
  };
  xhttp.open("GET", dataURL, true);
  xhttp.send(null);
}


function ajaxReqJSON()
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function()
  {
    //check to see if there was a success
    if(this.readyState == 4 && this.status == 200)
    {
      //load the data into the html section
      document.getElementById('ajaxSection').innerHTML = this.responseText;
      console.log(this.responseText);
    }
  };
  xhttp.open("GET", walmartlabsURL, true);
  xhttp.send(null);
}
