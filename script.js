document.addEventListener("DOMContentLoaded", () => {

const apiKey = 'd61f326a8cc0ef57c9f7a059b84dd0d5'

let city = 'Austin';
let lat
let lon


const state = {
    city: "Austin",
    currentWeather: null,
    coords: null,
    hourlyForecast: [],
    dailyForecast: [],
    airQuality: null
}

let button = document.getElementById("submit")
button.addEventListener("click", () => {
let input = document.getElementById("city-search")
console.log(input.value)
city = input.value
fetchWeather(city)
})






console.log("dom loaded")


// function fetchWeather(data) {

// fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
// .then((res) => {
//     console.log(res.status)
//    return res.json()
// })
// .then((json) => {
//     console.log(json)
// })

// loadWeather()

// }



function fetchWeather(city) {

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
.then((res) => {
    console.log(res.status)
   return res.json()
})
.then((json) => {
    

 state.currentWeather = {
        city: json.name,
        temp: parseInt(json.main.temp),
        description: json.weather[0].description,
        high: parseInt(json.main.temp_max),
        low: parseInt(json.main.temp_min),
        icon: json.weather[0].icon,
        hourlyForecast: [],
        dailyForecast: []
    }

     state.coords = {
        lat: json.coord.lat,
        lon: json.coord.lon
    }

    loadWeather()

fetchForeCast()
fetchAirQuality()
fetchWeatherNow()


   
})
.catch((error) => {
    console.error(error)
})

}


function fetchAirQuality() {
     fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${state.coords.lat}&lon=${state.coords.lon}&appid=${apiKey}`)
  .then((res) => res.json())
  .then((json) => {
    console.log(json)

    state.airQuality = json.list[0].main.aqi

        
    loadAirQuality()
  })
}

function fetchWeatherNow() {
fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
  .then((res) => res.json())
  .then((json) => {
    state.hourlyForecast = json.list

     loadWeatherNow()

  });

}

  function fetchForeCast() {

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
  .then((res) => res.json())
  .then((json) => {
   state.dailyForecast =
   json.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
)
    
    loadForecast()
  })
}

fetchWeather(city)



function loadWeather() {

   let weatherTitle = document.getElementById("weather-info-title")
   weatherTitle.textContent = state.currentWeather.city
   let weatherTemp = document.getElementById("weather-info-temp")
   weatherTemp.textContent =  `${state.currentWeather.temp}°`

   let weatherDesc = document.getElementById("weather-info-desc")
   weatherDesc.innerText = state.currentWeather.description
   let weatherHigh = document.getElementById("weather-info-high")
    weatherHigh.innerText =
      `H: ${state.currentWeather.high}° L: ${state.currentWeather.low}°`

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

function loadWeatherNow() {

  let weatherNow =
        document.getElementById("weather-now")
        weatherNow.innerHTML = ""
     state.hourlyForecast.forEach((item) => {

        let firsttime = item.dt_txt.split(" ")[1].split(":")[0]

        let time = timeConverter(firsttime)

        let iconCode = item.weather[0].icon

        let card = document.createElement("div")

        card.className = "card"

        let timetext = document.createElement("p")

        timetext.innerText = time

        let temp = document.createElement("p")

        temp.innerText = `${parseInt(item.main.temp)}°`

        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

        const iconimage = document.createElement("img")

        iconimage.src = iconUrl

        iconimage.alt = "image"

        card.appendChild(timetext)
        card.appendChild(iconimage)
        card.appendChild(temp)

        weatherNow.appendChild(card)
    })
}


function loadForecast() {


 let grid = document.getElementById("forecast")

    grid.innerHTML = ""

    state.dailyForecast.forEach((item) => {

        let tempmax = item.main.temp_max

        let tempbar = document.createElement("div")
        tempbar.className = "tempbar"

        let fillcolor = document.createElement("div")

        if (tempmax < 70) {
            fillcolor.style.backgroundColor = "lightblue"
        } else {
            fillcolor.style.backgroundColor = "lightcoral"
        }

        fillcolor.className = "fillcolor"

        tempbar.appendChild(fillcolor)

        let iconCode = item.weather[0].icon

        let date = new Date(item.dt_txt.split(" ")[0])

        let day =
            date.toLocaleDateString([], {
                weekday: "short"
            })

        let card = document.createElement("div")

        card.className = "forecast-card"

        let daytext = document.createElement("p")
        daytext.innerText = day

        let lowtext = document.createElement("p")
        lowtext.innerText =
            parseInt(item.main.temp_min) + "°"

        let hightext = document.createElement("p")
        hightext.innerText =
            parseInt(item.main.temp_max) + "°"

        const iconUrl =
            `https://openweathermap.org/img/wn/${iconCode}@2x.png`

        const iconimage =
            document.createElement("img")

        iconimage.src = iconUrl

        iconimage.alt = "image"

        card.appendChild(daytext)
        card.appendChild(iconimage)
        card.appendChild(lowtext)
        card.appendChild(tempbar)
        card.appendChild(hightext)

        grid.appendChild(card)
    })
}


function loadAirQuality() {
    
    
    let airquality = state.airQuality

    let p = document.getElementById("air-num")
    p.innerText = state.airQuality
    let airsent = document.getElementById("air-sent")
    airsent.innerText = `Air quality index is ${airquality}, which is similar to yesterday at about this time.`
    
    let quality

if (airquality === 1) {
    quality = "Good"
} else if (airquality === 2) {
    quality = "Fair"
} else if (airquality === 3) {
    quality = "Moderate"
} else if (airquality === 4) {
    quality = "Poor"
} else {
    quality = "Very Poor"
}


let airword = document.getElementById("air-word")
    airword.innerText = quality

}



})