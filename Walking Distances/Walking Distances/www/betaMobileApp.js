
    // initialize variables that start google maps
    var map;
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var marker = new Array();
    var  totalDistance = 0;
    var  totalDistanceMi = 0;
    var totalTimeMin = 0;
    var hrs = 0;
    var savedCustomItems = new Array();
    alert(savedCustomItems.length);

    

    function alert(message){
      var iframe = document.createElement("IFRAME");
      iframe.setAttribute("src", 'data:text/plain,');
      document.documentElement.appendChild(iframe);
      window.frames[0].window.alert(message);
      iframe.parentNode.removeChild(iframe);
    }

  //Builds map from google API
    function initialize() {
      geocoder = new google.maps.Geocoder();
      directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true,polylineOptions:{strokeColor:'#48036F'}});

      var mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(43.818907, -111.788508),
        mapTypeId: google.maps.MapTypeId.HYBRID,
        streetViewControl: false,
        zoomControl: false,
        mapTypeControl:false
      };

      var buildingBlocks;
    
      map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

      directionsDisplay.setMap(map);
      directionsDisplay.setPanel(document.getElementById('directions-panel'));


    // For loop that will iterate through the array and make the markers
    for (input = 0; input < 167;input++){
      var type = housingData[input][0];
      var name = housingData[input][1];
      var address = housingData[input][2];
      var building = housingData[input][3];
      var distance = housingData[input][4];
      var latitude = housingData[input][5];
      var longitude = housingData[input][6];

      createMarkers(type,name,address,building,distance,latitude,longitude,input);
    }
    //For loop that generates the boxes over campus buildings.
    for(poly = 0;poly < coords.length;poly++){

    buildingBlocks = new google.maps.Polygon({
      paths: coords[poly],
      strokeColor: "#1144AA",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#1144AA",
      fillOpacity: 0.35
    });
    buildingBlocks.setMap(map);
   }

    //inialize saved data
var checkStorage = JSON.parse(localStorage.getItem('customData'));
        alert(checkStorage.length)
        if (checkStorage != null){  
          for(var i = 0;i < checkStorage.length;i++){
            createCustomListItem(checkStorage[i]);
          }
        }
    
    populateList();
    
    
}
    
    google.maps.event.addDomListener(window, 'load', initialize);
    

    var newIcon = 'file:///Y:/02 Operations/IT/Facebook/walkapp/'

//calculates the distances and the time it takes between two points, uses the Distance Matrix API.
function calculateDistances() {
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.WALKING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      avoidHighways: true,
      avoidTolls: true
    }, callback);
}

//creates a route between two points, uses the Distance API.
function calcRoute() {
  var start = origin;
  var end = destination;
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.DirectionsTravelMode.WALKING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.suppressMarkers = true;
      directionsDisplay.setDirections(response);

    }
  });
}

//retrieves the distance matrixes callback and displays it on Interface.
function callback(response, status) {
  if (status != google.maps.DistanceMatrixStatus.OK) {
    alert('Error was: ' + status);
  } 
  else {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;


    var timeBox = document.getElementById('timeBox');
    var distanceBox = document.getElementById('distanceBox');
    var feetBox = document.getElementById('feetBox');
    var textBox = document.getElementById('textBox');
    var totalBox = document.getElementById('totalBox');
    var totalMiBox = document.getElementById('totalMiBox');
    var totalTimeBox = document.getElementById('totalTimeBox');



    timeBox.innerHTML = '';
    distanceBox.innerHTML = '';
    feetBox.innerHTML = '';
    textBox.innerHTML= '';
    totalBox.innerHTML = '';
    totalMiBox.innerHTML = '';
    totalTimeBox.innerHTML = '';

      var time = response.rows[0].elements[0].duration.text;
      var distances = response.rows[0].elements[0].distance.text
      //converts time tot a number.
      if (time.length == 7){
        var getTime = time.slice(0,3);
      }
      else if (time.length == 6){
        var getTime = time.slice(0,2);
      }
      else{
        var getTime = time.slice(0,1);
      }
          getTime *= 1;
      var totalTime = createTotalTime(getTime);
        if (60 < totalTime){
          totalTime = totalTime % 60;
          hrs++
        } 

      //converts distance to a number then to feet 
      var checkIfFeet = distances.slice(4,7);
      var distanceFeet = distances.slice(0,4);
          distanceFeet = Number(distanceFeet);

      var totalMi = createTotalDistanceMi(distanceFeet,checkIfFeet);
          totalMi = totalMi.toFixed(1);
          if (checkIfFeet != "ft"){
            distanceFeet *= 5280;
            distanceFeet = distanceFeet.toFixed(0);
          }
      var total = createTotalDistance(distanceFeet); 

      //Displays the following variables on the GUI.
        timeBox.innerHTML += time;
        distanceBox.innerHTML += distances;
        feetBox.innerHTML += distanceFeet + 'ft';
        textBox.innerHTML +=  "From " +  originName + " To " + destinationName;
        totalBox.innerHTML += total + 'ft';
        totalMiBox.innerHTML += totalMi + " mi";


        if (0 < hrs){
          totalTimeBox.innerHTML += hrs + " hr " + totalTimeMin + ' mins';
        }
        else{
          totalTimeBox.innerHTML += totalTimeMin + ' mins';
        }
        createHistory(time,distances,distanceFeet);
      }
    }

//adds the distances in feet of all the origins and destinations.
function createTotalDistance(getDistance){
     totalDistance += getDistance * 1;
      return totalDistance; 
}

//adds the distances in miles of all the origins and destinations.
function createTotalDistanceMi(getMiles,checkFeet){
    if(checkFeet == 'ft'){
      totalDistanceMi += getMiles / 5280;
    }
    else{
      totalDistanceMi += getMiles * 1;
    }
    return totalDistanceMi;
}

//adds the time of all the origins and destinations.
function createTotalTime(getTime){
         
  totalTimeMin += getTime;
  if (60 < totalTimeMin){
    totalTimeMin = totalTimeMin % 60;
    hrs++
  } 
  return totalTimeMin;
}

//clears the totals 
function totalClear(){
  totalDistance = 0;
  totalDistanceMi = 0;
  totalTimeMin = 0;
  hrs = 0;
  var totalBox = document.getElementById('totalBox');
  var totalMiBox = document.getElementById('totalMiBox');
  var totalTimeBox = document.getElementById('totalTimeBox');
  totalBox.innerHTML = 'Total(ft)';
  totalMiBox.innerHTML = 'Total(mi)';
  totalTimeBox.innerHTML = 'Total(mins)';
}

//creates the markers based on parameters and displays them based on type.
function createMarkers(type,name,address,building,distance,latitude,longitude,input){
  var set = new google.maps.LatLng(latitude,longitude);
  if (type == 'married'){
    marker[input] = new google.maps.Marker({
      map: map,
      clickable: true,
      icon: newIcon + 'marriedmarker2.png',
      title: name,
      position: set
    });
  }

  if(type == 'men'){
    marker[input] = new google.maps.Marker({
      map: map,
      clickable: true,
      icon: newIcon + 'menmarkertest.png',
      title: name,
      position: set
    });
  }

  if (type == 'women'){
    marker[input] = new google.maps.Marker({
      map: map,
      clickable: true,
      icon: newIcon + 'womenmarker2.png',
      title: name,
      position: set
    });
  }
}

