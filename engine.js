console.log("TEST!");

var dataURL = "https://samtrent.github.io/data.txt";
var walmartlabsURL = "https://api.walmartlabs.com/v1/search?query=ipod&format=json&apiKey=cbdm5w2yfksg5nyxwaxwf92m&callback=?";

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

//jquery test
function ajaxReqJQUERY()
{
  console.log("starting ajax");
  $.ajax({
      url: walmartlabsURL,
      dataType: 'jsonp',
      success: function(dataWeGotViaJsonp){
      var text = '';

      var len = dataWeGotViaJsonp.length;
      console.log(len);
      for(var i=0;i<len;i++){
                twitterEntry = dataWeGotViaJsonp[i];
                text += '<p>' + twitterEntr +  '</p>';
                console.log(text);
      }
      $('ajaxSection').html(text);
       }
     });
}
