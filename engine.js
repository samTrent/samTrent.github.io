'use strict';

var walmartlabsURLSearchQuery = "";
var walmartlabsURLLookUpQuery = "";
var walmartlabsURLRecommendationQuery = "";

/************************************************
* getSearchQuery()
*   This function preforms a search based on the
* given query.
*************************************************/
function getSearchQuery()
{
  var query = document.getElementById('searchInput').value;

  //dont let an emply value pass though
  if(query)
  {
    walmartlabsURLSearchQuery = "https://api.walmartlabs.com/v1/search?query=" + query + "&format=json&apiKey=cbdm5w2yfksg5nyxwaxwf92m&callback=?";
    ajaxReqJQUERY(walmartlabsURLSearchQuery);
  }
  else
  {
      alert("You must enter a value");
  }
}


/************************************************
* lookUpQuery()
*   This function returns a URL for a given look up
* query.
*************************************************/
function getlookUpQuery(itemID)
{
  return walmartlabsURLLookUpQuery = "https://api.walmartlabs.com/v1/items/" + itemID + "?format=json&apiKey=cbdm5w2yfksg5nyxwaxwf92m&callback=?";
}

/************************************************
* lookUpQuery()
*   This function returns a URL for a given look up
* query.
*************************************************/
function getRecommendationQuery(itemID)
{
  return walmartlabsURLRecommendationQuery = "https://api.walmartlabs.com/v1/nbp?apiKey=cbdm5w2yfksg5nyxwaxwf92m&itemId=" + itemID + "&callback=?";
}

/************************************************
* createTableHeader()
*   This function creates a table header when
* displaying multiple items at a time.
*************************************************/
function createTableHeader()
{
  var $tr = $('<tr>').append(
      $('<th>').text("Product Image"),
      $('<th>').text("Product Name"),
      $('<th>').text("Product Description"),
      $('<th>').text("Price")
    ).appendTo('#ajaxSection');
}

/************************************************
* singleItemTableHeader()
*   This function creates a table header when
* displaying for a single item.
*************************************************/
function singleItemTableHeader(itemName)
{
  var $tr = $('<tr>').append(
      $('<th>').text(itemName),
      $('<th>').text("Description"),
      $('<th>').text("Price"),
      $('<th>').text("Customer Rating")
    ).appendTo('#ajaxSection');
}


/************************************************
* getStockAvailbity()
*   This function returns a what the availbity
* is for a given item and sets a the color attribute
* based on availbity
*************************************************/
function getStockAvailbity(stockAvailbity)
{
  switch(stockAvailbity)
  {
    case "Available":
    return "<p class='stockAvailbity' style='color: green'>"+ stockAvailbity +"</p>";
    case "Last Few Items":
    return "<p class='stockAvailbity' style='color: yellow'>"+ stockAvailbity +"</p>";
    default:
    return "<p class='stockAvailbity' style='color: red'>"+ stockAvailbity +"</p>";
  }


}


/************************************************
* clearTable()
*   This function clears all data in the table
* so that new data can be appended.
*************************************************/
function clearTable()
{
  //erase the old search results...
  document.getElementById('ajaxSection').innerHTML = "";
}


/************************************************
* ajaxReqForSelectedItem()
*   This function preforms an AJAX request to get
* data for the request item.
*************************************************/
function ajaxReqForSelectedItem(itemID)
{
  document.getElementById("backButton").setAttribute('type','button');
  clearTable();

  //get recommened Items
  ajaxReqRecommenedStuff(itemID);

  //let the user know we are processing their request
  var loadingText = $('<p>').text("Loading Item Info...").appendTo('#ajaxSection');

  $.ajax({
      url: getlookUpQuery(itemID),
      dataType: 'jsonp',
      success: function(JSONData){

      //remove the loading text
      loadingText.remove();

        //set up our image tag
        var img = $('<img id="dynamic" >'); //Equivalent: $(document.createElement('img'))
        img.attr('src', JSONData.mediumImage);

        var rateingImg = $('<img id="dynamic" >');
        rateingImg.attr('src', JSONData.customerRatingImage);

        var customerRating = JSONData.customerRating;
        if(typeof(customerRating) === 'undefined')
        {
          customerRating = "";
        }

        var numOfReviews = JSONData.numReviews;
        if(typeof(numOfReviews) === 'undefined')
        {
          numOfReviews = "No ";
        }

        var stockAvailbity = getStockAvailbity(JSONData.stock);


        singleItemTableHeader(JSONData.name);

        //append to HTML table
        var $tr = $('<tr>').append(
            $('<td style="background-color:white">')
            .append(stockAvailbity + "<br><br>")
            .append(img),
            $('<td class="descriptionText">').text(JSONData.shortDescription),
            $('<td>').text("$" + JSONData.salePrice),
            $('<td>').text(customerRating + "   ").append("<br>")
            .append(rateingImg)
            .append("<br><br>(" + numOfReviews + " Reviews)")
          ).appendTo('#ajaxSection');
       },
       error: function(error)
       {
         console.log(error);
         alert("There was an error getting the Item information...");
       }


     });


}


function ajaxReqRecommenedStuff(itemID)
{
  //let the user know we are processing their request
  var loadingText = $('<p>').text("Searching for items...").appendTo('#ajaxSection');
  var newURL = getRecommendationQuery(itemID);

  console.log("starting ajax RecommendationQuery");
  console.log("The itemID is: " + itemID + " the query is: " + newURL);


    $.ajax({
      url: newURL,
      dataType: 'jsonp',
      success: function(data)
      {

           console.log(data[0]);
           console.log(data.items[0]);

      },
      error: function(error)
      {
        console.log(error);
        alert("There was an error getting the recommenedations...");
      }
    });

}





/************************************************
* ajaxReqJQUERY()
*   This function preforms a Jquery ajax request
*   and gets the products based on the users search
*   query.
*************************************************/
function ajaxReqJQUERY(URLQuery)
{
  document.getElementById("backButton").setAttribute('type','hidden');
  clearTable();

  //recreate tableheader
  createTableHeader();

  //let the user know we are processing their request
  var loadingText = $('<p>').text("Searching for items...").appendTo('#ajaxSection');

  console.log("starting ajax");

  $.ajax({
      url: URLQuery,
      dataType: 'jsonp',
      success: function(JSONData){

      console.log(JSONData); // go though each item

      //remove the loading text
      loadingText.remove();

      //generate 10 rows here
      for(var i = 0; i < 10; i++)
      {
        //set up our image tag
        var img = $('<img id="dynamic" >'); //Equivalent: $(document.createElement('img'))
        img.attr('src', JSONData.items[i].mediumImage);

        //append to HTML table
        var $tr = $("<tr id="+JSONData.items[i].itemId+">").append(
            $("<td id='imageCell' class='clickableLink'>").append(img).on('click', function() { ajaxReqForSelectedItem(this.parentNode.id); }),
            $("<td id='nameCell' class='clickableLink'>").text(JSONData.items[i].name).on('click', function() { ajaxReqForSelectedItem(this.parentNode.id); }),
            $('<td class="descriptionText">').text(JSONData.items[i].shortDescription),
            $('<td>').text("$" + JSONData.items[i].salePrice)
          ).appendTo('#ajaxSection');


      }

    },
    error: function(error)
    {
      console.log(error);
      alert("There was an error getting the search results...");
    }
   });
}
