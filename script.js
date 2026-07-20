document.addEventListener("DOMContentLoaded", () => {

// const apiKey = 'd61f326a8cc0ef57c9f7a059b84dd0d5'

let city = 'Austin';
let savedWrapper = document.getElementById("saved-wrapper")

const map = L.map('map').setView([30.2672, -97.7431], 7);
L.tileLayer(
    `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    {
        opacity: 0.6
    }
).addTo(map);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);



let form = document.getElementById("search-form")
const input = document.getElementById("city-search")

// input.addEventListener("input", (e) => { 
//      console.log(e.target.value)
// }) 





form.addEventListener("submit", (event) => {
event.preventDefault()
//  let input = document.getElementById("city-search")
 city = input.value
 fetchWeather(city)
})

const state = {
    currentWeather: null,
    city: "Austin",
    coords: null,
    hourlyForecast: [],
    dailyForecast: [],
    airQuality: null,
    savedCities: []
}



const storedCities = JSON.parse(localStorage.getItem("cities") || "[]")


state.savedCities = storedCities

loadSavedCities(state.savedCities)

let savebutton = document.getElementById("save-city-btn")
savebutton.addEventListener(("click"), () => {
    console.log(state.savedCities)
    console.log(state.currentWeather.city)
    if (!state.savedCities.some((city) => city.city === state.currentWeather.city))
    {state.savedCities.push(state.currentWeather)}
    
    loadSavedCities(state.savedCities)
    console.log(state.savedCities)

    localStorage.setItem("cities", JSON.stringify(state.savedCities))
    
})



let toggle = document.getElementById("toggle-saved-btn")
toggle.addEventListener(("click"), () => {
   if (savedWrapper.classList.contains("hidden")) {
    savedWrapper.classList.remove("hidden")
   } else {
    savedWrapper.classList.add("hidden")
   }
console.log(savedWrapper)
})




console.log("dom loaded")



function fetchWeather(city) {


fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
.then((res) => {
    if (!res.ok) {
        throw new Error("Weather data not found")
    }
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



    loadBackground()
    loadWeather()

    fetchForeCast()
    fetchAirQuality()
    fetchWeatherNow()

     map.setView(
  [state.coords.lat, state.coords.lon],
  10
);
})
.catch((error) => console.error(error))

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
    weatherHigh.innerText = `H: ${state.currentWeather.high}° L: ${state.currentWeather.low}°`

}


function loadBackground() {
    console.log(state.currentWeather)
    const weather = state.currentWeather.description.toLowerCase()
     console.log(weather)
    if (weather.includes("sun")) {
                document.body.style.backgroundImage = "url('./images/sunny.webp')"
    } else if (weather.includes("rain")) {
              document.body.style.backgroundImage = "url('./images/rainy.webp')"
    } else if (weather.includes("cloud")) {
        document.body.style.backgroundImage = "url('./images/partlycloudy.webp')"

    } else if (weather.includes("snow")) {
        document.body.style.backgroundImage = "url('./images/snowy.webp')"
    }
    
    
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

        console.log(tempmax)

        let tempbar = document.createElement("div")
        tempbar.className = "tempbar"

        let fillcolor = document.createElement("div")
        let markertwo = document.createElement("div")
        markertwo.className = "markertwo"
        markertwo.id = "markertwo"

        markertwo.style.left = `${tempmax + "%"}`

       
        if (tempmax < 70) {
            fillcolor.style.backgroundColor = "lightblue"
        } else {
            fillcolor.style.backgroundColor = "lightcoral"
        }

        fillcolor.className = "fillcolor"


        fillcolor.appendChild(markertwo)
        tempbar.appendChild(fillcolor)

        let iconCode = item.weather[0].icon

        let date = new Date(item.dt_txt.split(" ")[0])

        let day = date.toLocaleDateString([], {weekday: "short"})

        let card = document.createElement("div")

        card.className = "forecast-card"

        let daytext = document.createElement("p")
        daytext.innerText = day

        let lowtext = document.createElement("p")
        lowtext.innerText = parseInt(item.main.temp_min) + "°"

        let hightext = document.createElement("p")
        hightext.innerText = parseInt(item.main.temp_max) + "°"

        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
        console.log(iconCode)
        //  const iconUrl = `https://openweathermap.org/payload/api/media/file/${iconCode}@2x.png`

        const iconimage = document.createElement("img")

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


  let marker = document.getElementById("marker")
    
    if (airquality === 1) {
        marker.style.left = "25%"
    } else if (airquality === 2) {
        marker.style.left ="50%"
    } else if (airquality === 3) {
        marker.style.left = "75%"
    } else if (airquality === 4) {
        marker.style.left = "80%"
    } else {
        marker.style.left = "100%"
    }



   

let airword = document.getElementById("air-word")
    airword.innerText = quality

}

function loadSavedCities(savedCities) {

     let savedContainer = document.getElementById("saved-container")
      savedContainer.innerHTML = ""
      savedCities.forEach((city) => {
      console.log(city)
       let div = document.createElement("div")
       div.addEventListener("click", () => {
        // loadSavedCities()
        fetchWeather(city.city)
        console.log(city)
       })
       div.className = "saved-city"
       div.innerText = city.city
       let del = document.createElement("button")
       del.innerText = "delete"
       del.className = "delete"
       del.addEventListener("click", () => {
        div.remove()
        state.savedCities = state.savedCities.filter((savedCity) => savedCity.city !== city.city)
        localStorage.setItem("cities", JSON.stringify(state.savedCities))
       
       })
       
       div.appendChild(del)
       savedContainer.appendChild(div)
       } )
    
   

    console.log(state.savedCities)

   

}



})