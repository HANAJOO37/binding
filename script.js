document.addEventListener('DOMContentLoaded', function() {
    // const locationDiv = document.querySelector('.location');
    const recommendationsDiv = document.querySelector('.recommendations');
    const apiKey = 'f744ac4d4b8a0079429652b5667a60c3';

    function fetchFashionRecommendations(temperatureCategory) {
        fetch('trendy.json')
            .then(response => response.json())
            .then(data => {
                const recommendationsDiv = document.querySelector('.recommendations');
                recommendationsDiv.innerHTML = ''; 

                const filteredRecommendations = data.filter(item => item.category === temperatureCategory);

                filteredRecommendations.forEach(item => {
                    const recommendationDiv = document.createElement('div');
                    recommendationDiv.classList.add('recommendation');

                    const imageElement = document.createElement('img');
                    imageElement.src = item.image_link;
                    imageElement.alt = item.clothes;
                    imageElement.className = 'clothes_img';
                    imageElement.onload = function() {
                        this.style.width = '300px';
                    };

                    const brandElement = document.createElement('p');
                    brandElement.textContent = `${item.brand}`;
                    brandElement.className = 'brand';

                    const clothesElement = document.createElement('p');
                    clothesElement.textContent = `${item.clothes}`;
                    clothesElement.className= 'clothes'; 

                    const purchaseLinkElement = document.createElement('a');
                    purchaseLinkElement.href = item.purchase_link;
                    purchaseLinkElement.textContent = 'Buy Now';
                    purchaseLinkElement.className = 'buynow';

                    recommendationDiv.appendChild(imageElement);
                    recommendationDiv.appendChild(brandElement);
                    recommendationDiv.appendChild(clothesElement);
                    recommendationDiv.appendChild(purchaseLinkElement);

                    recommendationsDiv.appendChild(recommendationDiv);
                });
            })
            .catch(error => console.error('Error fetching fashion recommendations:', error));
    }

    function determineWeatherCategory(temperature) {
    if (temperature < 4) {
        return 'Cold Weather';
    } else if (temperature >= 4 && temperature <= 8.9) {
        return 'Cool Weather';
    } else if (temperature >= 9 && temperature <= 13.9) {
        return 'Mild Cool Weather';
    } else if (temperature >= 14 && temperature <= 18) {
        return 'Mild Weather';
    } else if (temperature > 18) {
        return 'Warm Weather';
    } else {
        return 'Unknown'; 
    }
    }

    
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showWeather, showError);
        } else {
            document.querySelector('.recommendations').innerHTML = "<p>Geolocation is not supported by this browser.</p>";
        }
    }

    function showWeather(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        fetchWeatherData(latitude, longitude);
    }

    function searchWeather(location) {
        // locationDiv.innerHTML = "<p>Loading...</p>";

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const locationElement = document.createElement('p');
                locationElement.textContent = `Location: ${location}`;

                const temperature = data.main.temp - 273.15;

                const weatherCategory = determineWeatherCategory(temperature);

                displayWeather(location, temperature, weatherCategory, data.weather[0].description);

                fetchFashionRecommendations(weatherCategory);
            })
            .catch(error => {
                console.error('There was a problem fetching the weather data:', error);
                // locationDiv.innerHTML = "<p>Failed to fetch weather data.</p>";

                recommendationsDiv.innerHTML = "<p>Failed to fetch weather data.</p>";

            });
    }

    function displayWeather(location, temperature, weatherCategory, weatherDescription) {
        console.log("weather displayed!")
        recommendationsDiv.innerHTML = `<p>Location: ${location}</p><p>Temperature: ${temperature.toFixed(1)}°C</p><p>Weather Category: ${weatherCategory}</p><p>Weather Description: ${weatherDescription}</p>`;
    }

    function showError(error) {
        let errorMessage;
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = "An unknown error occurred.";
            break;
        default:
            errorMessage = "An error occurred.";
            break;
        }
        // locationDiv.innerHTML = `<p class="error-message">${errorMessage}</p>`;

        document.querySelector('.recommendations').innerHTML = `<p class="error-message">${errorMessage}</p>`;
    }

    function fetchWeatherData(latitude, longitude) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const locationElement = document.createElement('p');
                locationElement.textContent = `Location: ${location}`;

                const temperature = data.main.temp - 273.15;

                const weatherCategory = determineWeatherCategory(temperature);

                displayWeather(location, temperature, weatherCategory, data.weather[0].description);

                fetchFashionRecommendations(weatherCategory);
            })
            .catch(error => {
                console.error('There was a problem fetching the weather data:', error);
                document.querySelector('.recommendations').innerHTML = "<p>Failed to fetch weather data.</p>";
            });
    }


    const searchButton = document.getElementById('search');
    searchButton.addEventListener('click', function() {
        const locationInput = document.getElementById('location').value.trim();
        if (locationInput !== '') {
            searchWeather(locationInput);
        } else {
            // locationDiv.innerHTML = "<p>Please enter a location.</p>";

            document.querySelector('.recommendations').innerHTML = "<p>Please enter a location.</p>";
        }
    });

    function displayLoadingMessage() {
        document.querySelector('.recommendations').innerHTML = "<p>Loading... Please wait.</p>";
    }
    

    const currentLocationButton = document.getElementById('current');
    currentLocationButton.addEventListener('click', function() {
        displayLoadingMessage();
        getLocation();
    });
    
    
});