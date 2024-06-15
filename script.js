let weather = {
    apiKey: "your weather api key",
    unsplashKey: 'unsplash api key',
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q="
            + city
            + "&units=metric&appid="
            + this.apiKey
        )
            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
        document.querySelector(".weather").classList.remove('loading');

        this.fetchUnsplashImage(name);
    },
    fetchUnsplashImage: function (city) {
        fetch(
            "https://api.unsplash.com/search/photos?page=1&query="
            + city
            + "&client_id="
            + this.unsplashKey
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.results && data.results.length > 0) {
                    const random = Math.floor(Math.random() * 10);
                    const imageUrl = data.results[random].urls.raw;
                    document.body.style.backgroundImage = "url('" + imageUrl + "')";
                    this.setCardBackgroundColor(imageUrl);
                } else {
                    console.log('No images found for', city);
                }
            })
            .catch((error) => {
                console.error('Error fetching Unsplash image:', error);
            });
    },
    setCardBackgroundColor: function (imageUrl) {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Needed to avoid CORS issues
        img.src = imageUrl;

        img.onload = function () {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(img);
            // const colorRGB = `rgb(${dominantColor.join(',')})`;
            const alphaValue = 0.6;
            const colorRGB = `rgba(${dominantColor.join(',')}, ${alphaValue})`;

            document.querySelector('input.search-bar').style.background = `rgb(${dominantColor.join(',')})`;
            document.querySelector('.card').style.background = colorRGB;
            document.querySelector('.card').style.backdropFilter = 'blur(8px) saturate(150%)'; 
            weather.setTextColorBasedOnBrightness(dominantColor);
        };
    },
    setTextColorBasedOnBrightness: function (rgbColor) {
        const brightness = (0.299 * rgbColor[0]) + (0.587 * rgbColor[1]) + (0.114 * rgbColor[2]);
        const textColor = brightness > 146 ? 'black' : 'white';

        document.querySelector('.card').style.color = textColor;
        document.querySelector('input.search-bar').style.color = textColor;
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
};

document.querySelector(".search button")
    .addEventListener('click', function () {
        weather.search();
    });

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key == 'Enter') {
        weather.search();
    }
});

weather.fetchWeather("Zurich");
