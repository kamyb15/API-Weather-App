



// When submitted
document.getElementById("search").addEventListener("submit", async (event) => {
 event.preventDefault();
 const searchInput = document.getElementById("search-bar").value;
 if (searchInput.trim() !== "") {
   await showWeatherForCity(searchInput);
 }
});

// Show default city
window.addEventListener("DOMContentLoaded", () => {
 const defaultCity = "Bonita Springs";
 showWeatherForCity(defaultCity);
})


const emojiImage = document.querySelector('#day-emoji');


async function showWeatherForCity(city) {
  const apiKey = "5ec0680ddc633560c01a326bbdd17e71";
 const statesAbbrv = {
   'Alabama': 'AL',
   'Alaska': 'AK',
   'Arizona': 'AZ',
   'Arkansas': 'AR',
   'California': 'CA',
   'Colorado': 'CO',
   'Conneticut': 'CT',
   'Delaware': 'DE',
   'District of Columbia': 'DC',
   'Florida': 'FL',
   'Georgia': 'GA',
   'Hawaii': 'HI',
   'Idaho': 'ID',
   'Illinois': 'IL',
   'Indiana': 'IN',
   'Iowa': 'IA',
   'Kansas': 'KS',
   'Kentucky': 'KY',
   'Louisiana': 'LA',
   'Maine': 'ME',
   'Maryland': 'MD',
   'Massachusetts': 'MA',
   'Michigan': 'MI',
   'Minnesota': 'MN',
   'Mississippi': 'MS',
   'Missouri': 'MO',
   'Montana': 'MT',
   'Nebraska': 'NE',
   'Nevada': 'NV',
   'New Hampshire': 'NH',
   'New Jersey': 'NJ',
   'New Mexico': 'NM',
   'New York': 'NY',
   'North Carolina': 'NC',
   'North Dakota': 'ND',
   'Ohio': 'OH',
   'Oklahoma': 'OK',
   'Oregon': 'OR',
   'Pennsylvania': 'PA',
   'Puerto Rico': 'PR',
   'Rhode Island': 'RI',
   'South Carolina': 'SC',
   'South Dakota': 'SD',
   'Tennessee': 'TN',
   'Texas': 'TX',
   'Utah': 'UT',
   'Vermont': 'VT',
   'Virginia': 'VA',
   'Washington': 'WA',
   'West Virginia': 'WV',
   'Wisconsin': 'WI',
   'Wyoming': 'WY'
   }


 const currentTemperature = document.getElementById("current-temp");
 const currentLocation = document.getElementById("current-location");
 const currentClear = document.getElementById("current-clear");
 const currentHighAndLow = document.getElementById("high-low");
 const forecast = document.getElementById("forecast");
 const fiveDay = document.getElementById("five-day");
 const wind = document.getElementById("wind");
 const uvIndex = document.getElementById("uv-index");
 const sunriseSunset = document.getElementById("sunrise-sunset");
 const airPollution = document.getElementById("air-pollution");
 const humidity = document.getElementById("humidity");


 async function getLonAndLat(searchInput) {
   const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)}&limit=1&appid=${apiKey}`;
   const response = await fetch(geocodeURL);


   if (!response.ok) {
     console.log("Bad response! ", response.status);
     return null;
   }


   const data = await response.json();
   if (data.length === 0) {
     console.log("No location found.");
     return null;
   }


   return {
     lat: data[0].lat,
     lon: data[0].lon,
     name: data[0].name,
     state: data[0].state || "", // default empty string
   };


 }






 async function getWeatherData(lat, lon, cityName) {
   const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
   const response = await fetch(weatherURL);
   
   if (!response.ok) {
     console.log("Bad response! ", response.status);
     return;
   }


   const data = await response.json();


   const description = data.weather[0].description.toLowerCase();
  
   // Display basic weather
   currentTemperature.innerHTML = `<p id="data-temp">${Math.round(data.main.temp)}°</p>`;
   currentClear.innerHTML = `<p id="data-description">${data.weather[0].description}</p>`;
   currentLocation.innerHTML = `<p id="data-name">${cityName}</p>`;
   currentHighAndLow.innerHTML = `<p id="data-high-low">H: ${Math.round(data.main.temp_max)}° L: ${Math.round(data.main.temp_min)}°</p>`;


   updateWeatherIcons(description, emojiImage);


  
   const weatherType = data.weather[0].main.toLowerCase();
  
 


   // Wind
   function getWindDirection(deg) {
     const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
     return directions[Math.round(deg / 45) % 8];
   }


   const gust = data.wind.gust ?? "N/A";
   wind.innerHTML = `
     <div id="speed-gust">
       <div id="windspeed"><p id="wind-speed">${data.wind.speed}</p><p id="mph-wind"><span>MPH</span><span>Wind</span></p></div>
       <hr id="hr-windgust">
       <div id="windgust"><p id="wind-gust">${gust}</p><p id="mph-gust"><span>MPH</span><span>Gusts</span></p></div>
     </div>
     <div id="wind-direction"><p id="compass">${getWindDirection(data.wind.deg)}</p><p id="degree">${data.wind.deg}°</p></div>
   `;


   // Feels like
   sunriseSunset.innerHTML = `
   <p id="feels-like-number">${Math.round(data.main.feels_like)}°</p>
   `;


   // Humidity
   humidity.innerHTML = `
     <p id="humidity-number">${data.main.humidity}%</p>
   `;


   // Sunrise / Sunset
   airPollution.innerHTML = `
     <div><p id="sunrise">${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p></div>
     <hr id="hr-sunrise-sunset">
     <div><p id="sunset">${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p></div>
   `;


   // Visibility
   uvIndex.innerHTML = `
     <p id="visibility-number">${(data.visibility / 1609).toFixed(1)}+ <span id="miles">miles</span></p>
   `;


 }


 async function getHourlyForecast(lat, lon) {
 const hourlyURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
 const response = await fetch(hourlyURL);
 const data = await response.json();


 const next12Hours = data.list.slice(0, 12);


 forecast.innerHTML = "";


 next12Hours.forEach(hour => {
   const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: 'numeric' });
   const temp = Math.round(hour.main.temp);
   forecast.innerHTML += `
     <div class="data-forecast">
       <p id="time">${time}</p>
       <p id="temp">${temp}°F</p>
     </div>`;
 });
}




async function getFiveDayForecast(lat, lon) {
 const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
 const response = await fetch(fiveDayURL);
 const data = await response.json();


 // Group forecasts by day
 const dailyTemps = {};


 data.list.forEach(item => {
   const date = new Date(item.dt_txt).toLocaleDateString(undefined, { weekday: 'short' });
   if (!dailyTemps[date]) dailyTemps[date] = [];
   dailyTemps[date].push(item.main.temp);
 });


 // Clear old 5-day forecast
 fiveDay.innerHTML = "";


 Object.entries(dailyTemps).slice(0, 5).forEach(([date, temps]) => {
   const min = Math.round(Math.min(...temps));
   const max = Math.round(Math.max(...temps));
   fiveDay.innerHTML += `
     <div class="date-temp">
       <p id="datefive">${date}</p>
       <p id="highlowfive">
         <span>${min}°</span>
         <span id="minmaxline"></span>
         <span>${max}°</span>
       </p>
     </div>
     <hr id="hrhigh">`;
 });
}




 const locationData = await getLonAndLat(city);
 if (locationData) {
   const stateAbbreviation = statesAbbrv[locationData.state] || locationData.state || "";
   const fullLocationName = stateAbbreviation
     ? `${locationData.name}, ${stateAbbreviation}`
     : locationData.name;


   // Call getWeatherData only once with fullLocationName
   await getWeatherData(locationData.lat, locationData.lon, fullLocationName);
   await getHourlyForecast(locationData.lat, locationData.lon);
   await getFiveDayForecast(locationData.lat, locationData.lon);
 }
 }


 function updateWeatherIcons(description, emojiImage) {
   if (description.includes("clear sky")) {
     document.body.style.backgroundImage = "linear-gradient(to top, #73a9e3, #286097)";
     document.getElementById("sun").style.display = "block";
     emojiImage.src="https://firebasestorage.googleapis.com/v0/b/codedex-io.appspot.com/o/buildAssets%2FgYlhLPHbJnREjvqhAGGY%2Fsun.png?alt=media&token=1c4d210f-01a1-483e-b700-364663f05cfb";
   } else if (description.includes("few clouds")) {
     document.body.style.backgroundImage = "linear-gradient(to top, #73a9e3, #286097)";
     document.getElementById("sun").style.display = "block";
     document.getElementById("cloud1").style.display = "block";
     document.getElementById("cloud2").style.display = "block";
     document.getElementById("cloud3").style.display = "block";
     document.getElementById("cloud4").style.display = "block";
     emojiImage.src="https://firebasestorage.googleapis.com/v0/b/codedex-io.appspot.com/o/buildAssets%2FgYlhLPHbJnREjvqhAGGY%2Fsun-cloud.png?alt=media&token=59906ad6-de15-44af-905f-dd02e1b3d85f";
   } else if (description.includes("scattered clouds")) {
     document.body.style.backgroundImage = "linear-gradient(to top, #73a9e3, #286097)";
     document.getElementById("sun-cloud").style.display = "block";
     document.getElementById("cloud1").style.display = "block";
     document.getElementById("cloud2").style.display = "block";
     document.getElementById("cloud5").style.display = "block";
     document.getElementById("cloud6").style.display = "block";
     document.getElementById("cloud9").style.display = "block";
     document.getElementById("cloud10").style.display = "block";
     emojiImage.src="https://firebasestorage.googleapis.com/v0/b/codedex-io.appspot.com/o/buildAssets%2FgYlhLPHbJnREjvqhAGGY%2Fsun-cloud.png?alt=media&token=59906ad6-de15-44af-905f-dd02e1b3d85f";
   } else if (description.includes("broken clouds")) {
     document.body.style.backgroundImage = "linear-gradient(to top, #5d5f65, #92a4bb)";
     document.getElementById("cloud1").style.display = "block";
     document.getElementById("cloud2").style.display = "block";
     document.getElementById("cloud3").style.display = "block";
     document.getElementById("cloud4").style.display = "block";
     document.getElementById("cloud5").style.display = "block";
     document.getElementById("cloud6").style.display = "block";
     document.getElementById("cloud7").style.display = "block";
     document.getElementById("cloud8").style.display = "block";
     document.getElementById("cloud9").style.display = "block";
     document.getElementById("cloud10").style.display = "block";
     emojiImage.src="https://firebasestorage.googleapis.com/v0/b/codedex-io.appspot.com/o/buildAssets%2FgYlhLPHbJnREjvqhAGGY%2Fcloud6.png?alt=media&token=963df261-b76b-4d1d-ad46-1d18520e0208";
   } else if (description.includes("shower rain")) {
     document.body.style.backgroundImage = "linear-gradient(to top, #73a9e3, #286097)";
     document.getElementById("sun").style.display = "block";
     document.getElementById("cloud1").style.display = "block";
     document.getElementById("cloud2").style.display = "block";
     document.getElementById("cloud3").style.display = "block";
     document.getElementById("cloud4").style.display = "block";
     document.getElementById("cloud5").style.display = "block";
     document.getElementById("cloud6").style.display = "block";
     document.getElementById("cloud7").style.display = "block";
     document.getElementById("cloud8").style.display = "block";
     document.getElementById("cloud9").style.display = "block";
     document.getElementById("cloud10").style.display = "block";
     //document.getElementById("rain").style.display = "block";
     emojiImage.src="https://firebasestorage.googleapis.com/v0/b/codedex-io.appspot.com/o/buildAssets%2FgYlhLPHbJnREjvqhAGGY%2Fsun-cloud.png?alt=media&token=59906ad6-de15-44af-905f-dd02e1b3d85f";
   } else if (description.includes("rain")){
     document.body.style.backgroundImage = "linear-gradient(to top, #73a9e3, #286097)";
     document.getElementById("sun-cloud").style.display = "block";
     document.getElementById("cloud1").style.display = "block";
     document.getElementById("cloud2").style.display = "block";
     document.getElementById("cloud3").style.display = "block";
     document.getElementById("cloud4").style.display = "block";
     document.getElementById("cloud5").style.display = "block";
     document.getElementById("cloud6").style.display = "block";
     document.getElementById("cloud7").style.display = "block";
     document.getElementById("cloud8").style.display = "block";
     document.getElementById("cloud9").style.display = "block";
     document.getElementById("cloud10").style.display = "block";
     //document.getElementById("rain").style.display = "block";
     emojiImage.src="https://firebasestorage.googleapis.com/v0/b/codedex-io.appspot.com/o/buildAssets%2FgYlhLPHbJnREjvqhAGGY%2Fsun-cloud.png?alt=media&token=59906ad6-de15-44af-905f-dd02e1b3d85f";
   } else if (description.includes("thunderstorm")) {
     document.body.style.backgroundImage = "linear-gradient(to top, #5d5f65, #92a4bb)";
     document.getElementById("cloud1").style.display = "block";
     document.getElementById("cloud2").style.display = "block";
     document.getElementById("cloud3").style.display = "block";
     document.getElementById("cloud4").style.display = "block";
     document.getElementById("cloud5").style.display = "block";
     document.getElementById("cloud6").style.display = "block";
     document.getElementById("cloud7").style.display = "block";
     document.getElementById("cloud8").style.display = "block";
     document.getElementById("cloud9").style.display = "block";
     document.getElementById("cloud10").style.display = "block";
      //document.getElementById("rain").style.display = "block";
      emojiImage.src="https://firebasestorage.googleapis.com/v0/b/codedex-io.appspot.com/o/buildAssets%2FgYlhLPHbJnREjvqhAGGY%2Fcloud6.png?alt=media&token=963df261-b76b-4d1d-ad46-1d18520e0208";
   } else if (description.includes("snow")) {
     document.body.style.backgroundImage = "linear-gradient(to top, #5c798f, #acb1bd)";
     document.getElementById("snow").style.display = "block";
     emojiImage.src="https://firebasestorage.googleapis.com/v0/b/codedex-io.appspot.com/o/buildAssets%2FgYlhLPHbJnREjvqhAGGY%2Fcloud6.png?alt=media&token=963df261-b76b-4d1d-ad46-1d18520e0208";
   } else {
     document.body.style.backgroundImage = "linear-gradient(to top, #5d5f65, #92a4bb)";
     document.getElementById("cloud1").style.display = "block";
     document.getElementById("cloud2").style.display = "block";
     document.getElementById("cloud3").style.display = "block";
     document.getElementById("cloud4").style.display = "block";
     emojiImage.src="https://firebasestorage.googleapis.com/v0/b/codedex-io.appspot.com/o/buildAssets%2FgYlhLPHbJnREjvqhAGGY%2Fcloud6.png?alt=media&token=963df261-b76b-4d1d-ad46-1d18520e0208";
   }
 }







