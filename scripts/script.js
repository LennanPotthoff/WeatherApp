var date, month, year, weekDay, currentDay;
var temp, weatherType, humidity, windSpeed;
var dayCounter;
var position;
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

$(document).ready(function(){
    
    //Set OnClickListeners
    $("#go-btn").click(function(e) {
        getWeatherData(false, null, null);
    });
    setDate();
    setForecastDates(currentDay);
    
    //Set Local weather
    requestCoordinates();
    
});

function requestCoordinates(){
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getLocalWeather);
    } else {
    console.log("Geolocation is not supported by this browser.");
    }
}

function getLocalWeather(position){
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    getWeatherData(true, position.coords.longitude, position.coords.latitude)
}

function fadeIn(){
    $("#upper-box-1").width(); // trigger a DOM reflow
    $("#upper-box-1").removeClass("fadeOut");
    $("#upper-box-2").removeClass("fadeOut");
    $("#upper-box-1").addClass("fadeIn");
    $("#upper-box-2").addClass("fadeIn");
}

function fadeOut(){
    $("#upper-box-1").width(); // trigger a DOM reflow
    $("#upper-box-1").removeClass("fadeIn");
    $("#upper-box-2").removeClass("fadeIn");
    $("#upper-box-1").addClass("fadeOut");
    $("#upper-box-2").addClass("fadeOut");
}

function setTopUI(temp, weatherType, humidity, windSpeed, city){
    
    //Hide UI
    fadeOut();
    
    //Set Weather values
    setTimeout(function(){
        $("#tempvalue").text(temp);
        $("#weather-type").text(weatherType);
        $("#humidity-value").text(humidity);
        $("#wind-value").text(windSpeed);
        $("#city").text(city);
        //Show UI
        fadeIn();
    },
               500);
   
    
}

function setForecastDates(currentDay){
    //Set Weekdays
    for(var j = 1, i = 1; i < 6; i++, j++){
        if(currentDay !== 6){
            $("#weekday-" + i).text(weekDays[currentDay+j]);
            console.log(weekDays[currentDay+j]);
        }
        else{
             $("#weekday-" + i).text("Monday");
            currentDay = 1;
            j = -1;
        }
        if(weekDays[currentDay+j] === "Sunday" || currentDay === 6){
            currentDay = 0;
            j = -1;
        }
    }
}

function setBottomUI(currentDay){
    
}

function ordinal(d){
 //Get appropriate ordinal for date
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  } 
}

function setDate(){
    
    //Get current date
    var datum = new Date();
    date = datum.getDate();
    month = datum.getMonth();
    weekDay = datum.getDay();

    //Set Current Date
    $("#month").text(" " + months[month]);
    $("#day").text(" " + date);
    $("#weekday").text(weekDays[weekDay-1]);
    $("#ordinal").text(ordinal(date));  
    currentDay = weekDay-1;
}

function getWeatherData(local, lon, lat){
    
    ///////////////////////////////////////////////////////////////
    //Get current weather
    ///////////////////////////////////////////////////////////////
    
    var temp;
    var weatherType
    
    if(local === false){
        
    //Check for valid input
    var city = $("#cityValue").val();
    if(city == ""){
        alert("Please enter a City!")
    }
    else{
    
    //API Call
    var req = new XMLHttpRequest();
    req.open("GET",'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=fdeb1baa605f39f36906817a457b70ed', true);   
    }
    }
    
    else{
    //API Call
    var req = new XMLHttpRequest();
    req.open("GET",'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=fdeb1baa605f39f36906817a457b70ed', true);
    }
    
    req.send();
    req.onload = function(){
        
    //Get Temperature
    var json = JSON.parse(req.responseText);
    temp = ((json.main.temp-273.15).toFixed(0));
    
    //Get Weather Type
    weatherType = json.weather[0].description;
        
    //Get Humidity
    humidity = json.main.humidity + "%";
        
    //Get Wind Speed
    windSpeed = ((((json.wind.speed) * 60) * 60) /1000).toFixed(0);
    
    ///////////////////////////////////////////////////////////////
    //Get Forecast
    ///////////////////////////////////////////////////////////////
    
    req.abort();
    if(!local){
       req = new XMLHttpRequest();
       req.open("GET", "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=fdeb1baa605f39f36906817a457b70ed", true); 
    }
    else{
        req = new XMLHttpRequest();
        req.open("GET", 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=fdeb1baa605f39f36906817a457b70ed', true);
    }
    req.send();
    req.onload = function(){

        //Get Weather
        json = JSON.parse(req.responseText);
        for(var i = 1, j = 8; i < 6; i++, j=j+8){
            if(j !== 40){
              $("#weather-description-" + i).text(json.list[j].weather[0].description);
              $("#weather-icon-" + i).attr("src", "images/icons/" + json.list[j].weather[0].icon + ".svg")  
              $("#temp-" + i).text((json.list[j].main.temp -273).toFixed(0));    
              
            }
            else{
              $("#weather-description-" + i).text((json.list[j-1].weather[0].description)); 
              $("#weather-icon-" + i).attr("src", "images/icons/" + json.list[j-1].weather[0].icon + ".svg");
              $("#temp-" + i).text((json.list[j-1].main.temp - 273.15).toFixed(0));
            }
            
        }
        
        //Set the UI for the Top Box
        setTopUI(temp, weatherType, humidity, windSpeed, json.city.name);
        
    };   
        
  };
        
     
        
    } 




