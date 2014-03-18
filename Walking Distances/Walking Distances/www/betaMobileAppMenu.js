
//Slides a tab up.
function slideTabUp(object) {
  object.children[0].onclick = function() {slideTabDown(object);};
  slideUp(object);
}

//Slides a tab down.
function slideTabDown(object) {
  object.children[0].onclick = function() {slideTabUp(object);};
  slideDown(object);
}

//Slides an object Up.
function slideUp(object) {
  $(function() {
    setZIndex(object, 300);
    $(object).stop();
    $(object).animate({'top': 0}, 300);
  });
}

//Slides an object Down
function slideDown(object) {
  $(function() {
    $(object).stop();
    $(object).animate({'top': 480}, 300);
    object;
    var t = setTimeout(function() {setZIndex(object, 100)}, 250);
  });
}
//set the Z-Index of the tabs.
function setZIndex(object, zindex) {
  $(object).css('z-index', zindex);
}

//creates the entries in the tabs menus.
function populateList(){
  var place = new Array();
  for (i = 0;i < housingData.length;i++){
    var type = housingData[i][0];
    var name = housingData[i][1];
    var address = housingData[i][2];
    var latitude = housingData[i][5];
    var longitude = housingData[i][6];
    var tab = null;

    place[i] = new createPlace(type,name,address,latitude,longitude,tab);

  createListItem(place[i]);

  }
}
//contructor for the places in the populateList function
function createPlace(type,name,address,latitude,longitude,tab){
  this.type = type;
  this.name = name;
  this.address = address;
  this.latitude = latitude;
  this.longitude = longitude;
  this.tab = tab;
}

var origin = null;
var destination = null ;
var originName = null;
var destinationName = null;
var clickCount = 0;

//appends the objects the tabs, and setting there onclick functions. 
function createListItem(place){

  var campusList = document.getElementById("cList");
  var mensList = document.getElementById("meList");
  var womensList = document.getElementById("wList");
  var marriedList = document.getElementById("mList");

      var placeItem = document.createElement('p');
          placeItem.innerHTML = place.name + "<br><span>" + place.address +"</span>";

  switch(place.type){

  case "married":
        place.tab  = document.getElementById('married');
        marriedList.appendChild(placeItem);
  break;

  case "men":
        place.tab  = document.getElementById('men');
        mensList.appendChild(placeItem);
  break;

  case "women":
        place.tab  = document.getElementById('women');
        womensList.appendChild(placeItem);
  break;

  case "campus":
        place.tab  = document.getElementById('campus');
        placeItem.innerHTML = place.name;
          campusList.appendChild(placeItem);
  break;

  default:
                alert('Error: Unable to Load Housing or Campus Data.');
  }
  placeItem.onclick = function(){
        if (clickCount == 0){
          origin = new google.maps.LatLng(place.latitude,place.longitude);
          slideTabDown(place.tab);
          originName = place.name;
          clickCount++;
        }
        else{
          destination = new google.maps.LatLng(place.latitude,place.longitude) ;
          destinationName = place.name;
          if (originName == destinationName){
            var textBox = document.getElementById('textBox');
                alert('Error: Please Select different Locations.')
            slideTabDown(place.tab);
          }
          else{
            calculateDistances();
            calcRoute()
            slideTabDown(place.tab);
            clickCount = 0;
          }
        }
      }
}

//appends what the user has clicked in the history tab
function createHistory(time,distances,feet){
    var historyList = document.getElementById('hList');
    var historyItem = document.createElement('p');

      if (historyList.childNodes.length == 10){
        historyList.removeChild(historyList.firstChild);
      }
        historyItem.innerHTML = "From<span> " + originName + "</span><br>To <span>" + destinationName + "</span> Time: <span>" + time + " </span>Distance: <span>" + distances + " , " + feet + "ft</span>";

         hList.appendChild(historyItem);
} 



//clears the history tab
function clearHistory(){
  var historyList = document.getElementById('hList');
    for(var i = 0;i < historyList.childNodes.length;i++ ){
      historyList.removeChild(historyList.lastChild);
    }
}

//create's a latlag from address and adds a list item that is personalized by the user.
function checkLine(){
  var getCords = document.getElementById('customAddress').value;
  var getName = document.getElementById('customName').value;
        document.getElementById('customName').value = '';
        document.getElementById('customAddress').value = '';

    if (getCords.indexOf("<") != -1 || getCords.indexOf("script") != -1){
      alert("Invalid address, Please enter a valid address.");
    }
    else if(getName.indexOf("<") != -1 || getName.indexOf("script") != -1){
      alert("Please enter in a proper name.");
    }
    else{
      createLatLang(getCords,getName);
    }
}

function createLatLang(Addresses,Names){
  var address = Addresses + ",Rexburg,Idaho"
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
        createCustomObject(results,Names,Addresses);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}



function createCustomObject(result,Names,address){
  var customObject = new customAddress(result,Names,address);
  createSaveData(customObject);
  createCustomListItem(customObject);
}

function createSaveData(Data){
  savedCustomItems.push(Data);
  alert(savedCustomItems.length);

  localStorage['customData'] = savedCustomItems;
  alert("saved");
  var cool = localStorage.getItem("customItems");
}

function customAddress(result,Names,address){
  this.type = "custom";
  this.name = Names;
  this.address = address;
  this.latitude = result[0].geometry.location.nb;
  this.longitude = result[0].geometry.location.ob;
  this.tab = document.getElementById('custom');
}

function createCustomListItem(place){
  var placeItem = document.createElement('p');
          placeItem.innerHTML = place.name + "<br><span>" + place.address +"</span>";
          placeItem.onclick = function(){
        if (clickCount == 0){
          origin = new google.maps.LatLng(place.latitude,place.longitude);
          slideTabDown(place.tab);
          originName = place.name;
          clickCount++;
        }
        else{
          destination = new google.maps.LatLng(place.latitude,place.longitude) ;
          destinationName = place.name;
          if (originName == destinationName){
                alert('Error: Please Select different Locations.')
            slideTabDown(place.tab);
          }
          else{
            calculateDistances();
            calcRoute()
            slideTabDown(place.tab);
            clickCount = 0;
          }
        }
      }
  var ctList = document.getElementById('ctList');
      ctList.appendChild(placeItem);
}









