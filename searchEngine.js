
/************************************************
* getSearchQuery()
*   This function preforms a search based on the
* given query.
*************************************************/
function preformSearch()
{
  var query = document.getElementById('searchInput').value;

  //dont let an emply value pass though
  if(query)
  {
    ajaxReqJQUERY(query);
  }
  else
  {
      alert("You must enter a value");
  }
}

/************************************************
* getSearchQuery()
*   This function returns a URL for an ajax request
*   to get the first 10 product for a queried item.
*************************************************/
function getSearchQuery(query)
{
  return "https://api.walmartlabs.com/v1/search?query=" + query + "&format=json&apiKey=cbdm5w2yfksg5nyxwaxwf92m&callback=?";
}

/************************************************
* lookUpQuery()
*   This function returns a URL for an ajax request
*   to get a given look up query for a selected item.
*************************************************/
function getlookUpQuery(itemID)
{
  return "https://api.walmartlabs.com/v1/items/" + itemID + "?format=json&apiKey=cbdm5w2yfksg5nyxwaxwf92m&callback=?";
}

/************************************************
* getRecommendationQuery()
*   This function returns a URL for an ajax request
*   to get the first 10 product recommendations for
*   a selceted item.
*************************************************/
function getRecommendationQuery(itemID)
{
  return "https://api.walmartlabs.com/v1/nbp?apiKey=cbdm5w2yfksg5nyxwaxwf92m&itemId=" + itemID + "&callback=?";
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
  //display back button
  document.getElementById("backButton").setAttribute('type','button');

  clearTable();

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

          //get recommened Items
          ajaxReqRecommenedStuff(itemID);

       },
       error: function(error)
       {
         console.log(error);
         alert("There was an error getting the Item information...");
       }


     });


}

/************************************************
* ajaxReqRecommenedStuff()
*   This function preforms a Jquery ajax request
*   and returns 10 product recommendations based
*   on the selected itemID.
*************************************************/
function ajaxReqRecommenedStuff(itemID)
{
  //let the user know we are processing their request
  var loadingText = $('<p>').text("Getting recommendations for item...").appendTo('#ajaxSection');

  console.log("starting ajax RecommendationQuery");
  console.log("The itemID is: " + itemID + " the query is: " + getRecommendationQuery(itemID));

  $.support.cors = true;
  $.ajax({
      type: 'GET',
      url: getRecommendationQuery(itemID),
      dataType: 'jsonp',
      crossDomain: true,

      success: function(JSONdata)
      {

           console.log(JSONdata);
          // console.log(JSONdata.items[0]);

      },
      error: function(error, text, et)
      {

        console.log("Recommendation Query error ", error);
        console.log(text);
        console.log(et);
        alert("There was an error getting the recommenedations...");
      }
    });

}





/************************************************
* ajaxReqJQUERY()
*   This function preforms a Jquery ajax request
*   and returns 10 products based on the users search
*   query.
*************************************************/
function ajaxReqJQUERY(query)
{
  document.getElementById("backButton").setAttribute('type','hidden');
  clearTable();

  //recreate tableheader
  createTableHeader();

  //let the user know we are processing their request
  var loadingText = $('<p>').text("Searching for items...").appendTo('#ajaxSection');

  console.log("starting ajax");

  $.ajax({
      url: getSearchQuery(query),
      dataType: 'jsonp',
      success: function(JSONData)
      {

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

              //make the image and name clickable.
              $("<td id='imageCell' class='clickableLink'>")
              .append(img)
              .on('click', function() { ajaxReqForSelectedItem(this.parentNode.id); }),
              $("<td id='nameCell' class='clickableLink'>").text(JSONData.items[i].name)
              .on('click', function() { ajaxReqForSelectedItem(this.parentNode.id); }),

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
