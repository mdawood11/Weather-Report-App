const ApiKey = "&appid=92930d5ff960bdb7b97014102764b4b1";
let historySearch = [];

function fetchItem() {
  const storedCities = JSON.parse(localStorage.getItem("historySearch"));
  if (storedCities !== null) {
    historySearch = storedCities;
    localStorage.clear();
  }
  for (i = 0; i < historySearch.length; i++) {
    if (i == 8) {
      break;
    }
    citiesList = $("<a>").attr({
      class: "list-group-item",
      href: "#",
    });

    citiesList.text(historySearch[i]);
    $(".group-list").append(citiesList);
  }
}
let city;
const cardMain = $(".card-body");
fetchItem();

function fetchData() {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" + city + ApiKey;
  cardMain.empty();
  $("#ForecastWeekly").empty();

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then((response) => {
    const dateFormat = moment().format(" MM/DD/YYYY");
    const iconCode = response.weather[0].icon;
    const URLIcone = "http://openweathermap.org/img/w/" + iconCode + ".png";
    const cityName = $("<h3>").html(city + dateFormat);
    cardMain.prepend(cityName);
    cardMain.append($("<img>").attr("src", URLIcone));
    const temp = Math.round((response.main.temp - 273.15) * 1.8 + 32);
    cardMain.append($("<p>").html("Temperature: " + temp + " &#8457"));
    const humidity = response.main.humidity;
    cardMain.append($("<p>").html("Humidity: " + humidity));
    const windSpeed = response.wind.speed;
    cardMain.append($("<p>").html("Wind Speed: " + windSpeed));
    const lat = response.coord.lat;
    const lon = response.coord.lon;
    $.ajax({
      url:
        `https://api.openweathermap.org/data/2.5/uvi?&lat= ${ApiKey}` +
        lat +
        "&lon=" +
        lon,
      method: "GET",
    }).then((response) => {
      cardMain.append(
        $("<p>").html("UV Index: <span>" + response.value + "</span>")
      );

      if (response.value <= 3) {
        $("span").attr("class", "btn btn-outline-success");
      }
      if (response.value > 3 && response.value <= 6) {
        $("span").attr("class", "btn btn-outline-warning");
      }
      if (response.value > 6) {
        $("span").attr("class", "btn btn-outline-danger");
      }
    });

    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ApiKey,
      method: "GET",
    }).then((response) => {
      for (i = 0; i < 5; i++) {
        const updateCard = $("<div>").attr(
          "class",
          "col fiveDay bg-primary text-white rounded-lg p-2"
        );
        $("#ForecastWeekly").append(updateCard);
        const date = new Date(response.list[i * 8].dt * 1000);
        updateCard.append($("<h4>").html(date.toLocaleDateString()));
        const icon = response.list[i * 8].weather[0].icon;
        const URLIcone = "http://openweathermap.org/img/w/" + icon + ".png";
        updateCard.append($("<img>").attr("src", URLIcone));
        const temp = Math.round(
          (response.list[i * 8].main.temp - 273.15) * 1.8 + 32
        );

        updateCard.append($("<p>").html("Temp: " + temp + " &#8457"));

        const humidity = response.list[i * 8].main.humidity;

        updateCard.append($("<p>").html("Humidity: " + humidity));
      }
    });
  });
}

$("#searchCity").click(() => {
  city = $("#city").val();
  fetchData();
  let checkAry = historySearch.includes(city);
  if (checkAry == true) {
    return;
  } else {
    historySearch.push(city);
    localStorage.setItem("historySearch", JSON.stringify(historySearch));
    const citiesList = $("<a>").attr({
      class: "list-group-item",
      href: "#",
    });
    citiesList.text(city);
    $(".group-list").append(citiesList);
  }
});

$(".list-group-item").click(function () {
  city = $(this).text();
  fetchData();
});
