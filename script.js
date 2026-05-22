document.addEventListener("DOMContentLoaded", () => {
// const apiKey = '61337b4eb24f4830a75191505262903';
const apiKey = 'd61f326a8cc0ef57c9f7a059b84dd0d5'

let city = 'Austin';

console.log("dom loaded")

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
.then((res) => {
    console.log(res.status)
   return res.json()
})
.then((json) => {
    console.log(json)
    console.log(json.weather)
    console.log(json.weather[0])
   loadWeather(json)
})
.catch((error) => {
    console.error(error)
})


fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
  .then((res) => res.json())
  .then((json) => {
    console.log(json);
    weather = json.list
    weather.forEach((item) => {
      loadWeatherNow(item)
    })

    // loadWeatherNow(json.list)
  });

function loadWeather(json) {
   console.log(json)
   console.log(json.name, json.main.temp, json.weather.description)
   let weatherInfo = document.getElementById("weather-info")
   let weatherTitle = document.getElementById("weather-info-title")
   weatherTitle.textContent = json.name
   let weatherTemp = document.getElementById("weather-info-temp")
   weatherTemp.textContent = json.main.temp
   let weatherDesc = document.getElementById("weather-info-desc")
   weatherDesc.innerText = json.weather[0].description
   let weatherHigh = document.getElementById("weather-info-high")
   weatherHigh.innerText = `H: ${json.main.temp_min}° L: ${json.main.temp_max}° `
}

function loadWeatherNow(weather) {
    console.log(weather)
    console.log(weather.weather[0].icon)
   let iconCode = weather.weather[0].icon

    let weatherNow = document.getElementById("weather-now")
    let card = document.createElement("div")
    card.className = "card"
    let time = document.createElement("p")
    time.innerText = "hi"
    let icon = document.createElement("icon")
    let temp = document.createElement("p")
    temp.innerText = `${weather.main.temp}°`
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const iconimage = document.createElement("img")
    iconimage.src = iconUrl
    iconimage.alt = "image"


    card.appendChild(time)
    card.appendChild(iconimage)
    card.appendChild(temp)
    weatherNow.appendChild(card)
}


})