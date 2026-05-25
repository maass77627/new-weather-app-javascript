document.addEventListener("DOMContentLoaded", () => {

const apiKey = 'd61f326a8cc0ef57c9f7a059b84dd0d5'

let city = 'Austin';
let lat
let lon
console.log("dom loaded")

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
.then((res) => {
    console.log(res.status)
   return res.json()
})
.then((json) => {
    console.log(json)
    console.log(json.weather)
    console.log(json.weather[0])
   loadWeather(json)
   lat = json.coord.lat
   lon = json.coord.lon


    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
  .then((res) => res.json())
  .then((json) => {
    console.log(json)
    loadAirQuality(json)
  })
   
})
.catch((error) => {
    console.error(error)
})


fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
  .then((res) => res.json())
  .then((json) => {
    console.log(json.list);
    weather = json.list
    weather.forEach((item) => {
      loadWeatherNow(item)
    })

  });

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
  .then((res) => res.json())
  .then((json) => {
    console.log(json)
    const dailyForeCasts = json.list.filter((item) => item.dt_txt.includes("12:00:00"))
    console.log(dailyForeCasts)
    dailyForeCasts.forEach((item) => {
        loadForecast(item)

    })
  })

//   fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
//   .then((res) => res.json())
//   .then((json) => {
//     console.log(json)
//     loadAirQuality(json)
//   })

function loadWeather(json) {
   let weatherInfo = document.getElementById("weather-info")
   let weatherTitle = document.getElementById("weather-info-title")
   weatherTitle.textContent = json.name
   let weatherTemp = document.getElementById("weather-info-temp")
   weatherTemp.textContent = json.main.temp
   let weatherDesc = document.getElementById("weather-info-desc")
   weatherDesc.innerText = json.weather[0].description
   let weatherHigh = document.getElementById("weather-info-high")
   weatherHigh.innerText = `H: ${String(json.main.temp_min).slice(0,-3)}° L: ${String(json.main.temp_max).slice(0, -3)}° `
}

function timeConverter(time) {
    if (time == 0) {
    return 12 + "am"
   }
   else if (time > 12) {
    return time - 12 + "pm"
   } else {
   return String(time).slice(1) + "am"
   }
}

function loadWeatherNow(weather) {
   let firsttime = weather.dt_txt.split(" ")[1].split(":")[0]
   let time = timeConverter(firsttime)
   let iconCode = weather.weather[0].icon
   let weatherNow = document.getElementById("weather-now")
   let card = document.createElement("div")
   card.className = "card"
   let timetext = document.createElement("p")
   timetext.innerText = time
   let temp = document.createElement("p")
   temp.innerText = `${parseInt(weather.main.temp)}°`
   const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
   const iconimage = document.createElement("img")
   iconimage.src = iconUrl
   iconimage.alt = "image"
    card.appendChild(timetext)
    card.appendChild(iconimage)
    card.appendChild(temp)
    weatherNow.appendChild(card)
}


function loadForecast(item) {
console.log(item)

  let tempmax =  item.main.temp_max
let tempbar = document.createElement("div")
tempbar.className = "tempbar"
// tempbar.appendChild(fillcolor)
let fillcolor = document.createElement("div")
if(tempmax < 70) {
    fillcolor.style.backgroundColor = "lightblue"
} else {
    fillcolor.style.backgroundColor = "lightcoral"
}
fillcolor.className = "fillcolor"
tempbar.appendChild(fillcolor)
let iconCode = item.weather[0].icon
let grid = document.getElementById("forecast")
let date = new Date(item.dt_txt.split(" ")[0])
console.log(date.toLocaleDateString([],{weekday: "short"}))
let day = date.toLocaleDateString([],{weekday: "short"})
let card = document.createElement("div")
card.className = "forecast-card"
let daytext = document.createElement("p")
daytext.innerText = day
let lowtext = document.createElement("p")
lowtext.innerText = parseInt(item.main.temp_min) + "°"
let hightext = document.createElement("p")
hightext.innerText = parseInt(item.main.temp_max) + "°"
const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
const iconimage = document.createElement("img")
   iconimage.src = iconUrl
   iconimage.alt = "image"
card.appendChild(daytext)
card.appendChild(iconimage)
card.appendChild(lowtext)
card.appendChild(tempbar)
card.appendChild(hightext)
grid.appendChild(card)
}


function loadAirQuality(data) {
    console.log(data)
    console.log(data.list[0].main.aqi)
    let airquality = data.list[0].main.aqi
    let p = document.getElementById("air-num")
    p.innerText = airquality
    let airsent = document.getElementById("air-sent")
    airsent.innerText = `Air quality index is ${airquality}, which is similar to yesterday at about this time.`
    

}



})