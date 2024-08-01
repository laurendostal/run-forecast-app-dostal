
const weatherForm = document.getElementById("weather_form")
const input = document.getElementById('weather_location')
const weatherSection = document.getElementById('weather')
weatherForm.onsubmit = fetchWeatherData

async function fetchWeatherData(e) {
    e.preventDefault()
    const searchTerm = input.value.trim()
    if(!searchTerm) return
    input.value = ""

    try {
        const weatherURL = "/weather?searchTerm=" + searchTerm
        const res = await fetch(weatherURL)  
        if(res.status !== 200) {
            throw new Error('Weather service not available')
        }
        const weatherData = await res.json()
        renderWeatherData(weatherData)
    } catch(err) {
        renderError(err)
    }
}

const renderError = (err) => {
    weatherSection.innerHTML = "<p>" + err.message + "</p>"
}

function renderWeatherData(weatherData) {
    const {name, main:{temp, feels_like, humidity}, dt, sys:{country}} = weatherData
    const weatherLastUpdated = dt
    const date = new Date(weatherLastUpdated * 1000)
    const timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    })
    const temp_int = Math.round(temp)
    const feels_like_temp_int = Math.round(feels_like)
    const humidity_int = Math.round(humidity)
    const cityCountry = name + ", " + country

    const header_row = "<tr><th>City</th><th>Time</th><th>Temperature</th><th>Feels Like</th><th>Humidity</th></tr>"
    const data_row = "<tr><td>" + cityCountry + "</td><td>" + timeString + "</td><td>" + temp_int + "</td><td>" + feels_like_temp_int + "</td><td>" + humidity_int + "</td></tr>"
    const wd_table = "<table class=\"center\">" + header_row + data_row + "</table>"
    const weatherDataTable = wd_table

    weatherSection.innerHTML = weatherDataTable
}
