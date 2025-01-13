const apikey = "31a39766cec8ae9fe0a24eb6fa4f75a5";

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lon = position.coords.longitude;
      let lat = position.coords.latitude;
      const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          weatherReport(data);
        })
        .catch((error) => console.error("Error fetching weather data:", error));
    });
  }
});

function searchByCity() {
  const place = document.getElementById("input").value;
  const urlsearch = `http://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apikey}`;

  fetch(urlsearch)
    .then((res) => res.json())
    .then((data) => {
      weatherReport(data);
    })
    .catch((error) => console.error("Error fetching city weather:", error));

  document.getElementById("input").value = "";
}

function fetchCountryFlag(countryCode) {
  const url = `https://restcountries.com/v3.1/alpha/${countryCode}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const flagUrl = data[0].flags.svg;
      document.getElementById("flag").src = flagUrl;
      document.getElementById("flag").alt = `Flag of ${data[0].name.common}`;
    })
    .catch((error) => console.error("Error fetching country flag:", error));
}

function weatherReport(data) {
  const urlcast = `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}`;

  fetch(urlcast)
    .then((res) => res.json())
    .then((forecast) => {
      hourForecast(forecast);
      dayForecast(forecast);

      document.getElementById("city").innerText =
        data.name + ", " + data.sys.country;
      fetchCountryFlag(data.sys.country);

      document.getElementById("temperature").innerText =
        Math.floor(data.main.temp - 273) + " °C";
      document.getElementById("clouds").innerText = data.weather[0].description;

      const icon1 = data.weather[0].icon;
      const iconurl = `http://openweathermap.org/img/wn/${icon1}@2x.png`;
      document.getElementById("img").src = iconurl;

      // Change background if it rains
      changeBackground(data.weather[0].description);
    })
    .catch((error) => console.error("Error fetching forecast data:", error));
}

function changeBackground(weatherDescription) {
  const mainContainer = document.querySelector(".main-container");
  if (weatherDescription.toLowerCase().includes("rain")) {
    mainContainer.style.backgroundImage = "url('https://i.pinimg.com/originals/91/95/f4/9195f4dd1b69f90038f627c8af422429.gif')";
    mainContainer.style.backgroundSize = "cover";
    mainContainer.style.backgroundRepeat = "no-repeat";
    mainContainer.style.backgroundPosition = "center";
  }
  else if (weatherDescription.toLowerCase().includes("clear sky")){ mainContainer.style.backgroundImage = "url('https://media.istockphoto.com/id/1046851238/photo/sun-shining-on-blue-sky-background.jpg?s=612x612&w=0&k=20&c=p3dNi2lGR-MunSquZy-9ufnDkmRl2xH3YNrzd5tcWQQ=')";
    mainContainer.style.backgroundSize = "cover";
    mainContainer.style.backgroundRepeat = "no-repeat";
    mainContainer.style.backgroundPosition = "center";
  }  
  else if (weatherDescription.toLowerCase().includes("snow")){ mainContainer.style.backgroundImage = "url('https://img1.picmix.com/output/stamp/normal/3/9/0/4/1824093_8916c.gif')";
    mainContainer.style.backgroundSize = "cover";
    mainContainer.style.backgroundRepeat = "no-repeat";
    mainContainer.style.backgroundPosition = "center";
  }  
  
  else {
    mainContainer.style.backgroundImage = ""; // Reset to default
  }
}

function hourForecast(forecast) {
  document.querySelector(".templist").innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const date = new Date(forecast.list[i].dt * 1000);
    const hourR = document.createElement("div");
    hourR.setAttribute("class", "next");

    const div = document.createElement("div");
    const time = document.createElement("p");
    time.setAttribute("class", "time");
    time.innerText = date
      .toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })
      .replace(":00", "");

    const temp = document.createElement("p");
    temp.innerText =
      Math.floor(forecast.list[i].main.temp_max - 273) +
      " °C" +
      " / " +
      Math.floor(forecast.list[i].main.temp_min - 273) +
      " °C";

    div.appendChild(time);
    div.appendChild(temp);

    const desc = document.createElement("p");
    desc.setAttribute("class", "desc");
    desc.innerText = forecast.list[i].weather[0].description;

    hourR.appendChild(div);
    hourR.appendChild(desc);
    document.querySelector(".templist").appendChild(hourR);
  }
}

function dayForecast(forecast) {
  document.querySelector(".weekF").innerHTML = "";
  for (let i = 8; i < forecast.list.length; i += 8) {
    const div = document.createElement("div");
    div.setAttribute("class", "dayF");

    const day = document.createElement("p");
    day.setAttribute("class", "date");
    day.innerText = new Date(forecast.list[i].dt * 1000).toDateString();
    div.appendChild(day);

    const temp = document.createElement("p");
    temp.innerText =
      Math.floor(forecast.list[i].main.temp_max - 273) +
      " °C" +
      " / " +
      Math.floor(forecast.list[i].main.temp_min - 273) +
      " °C";
    div.appendChild(temp);

    const description = document.createElement("p");
    description.setAttribute("class", "desc");
    description.innerText = forecast.list[i].weather[0].description;
    div.appendChild(description);

    document.querySelector(".weekF").appendChild(div);
  }
}
 