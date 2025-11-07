console.log ("hi weather!")
const result = document.getElementById('result');
const hint = document.querySelector('h3'); // находим подсказку

document.getElementById('weather-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = e.target.city.value.trim();
  if (!city) return;

  const apiKey = '85c36bd9c5f37754f9698d0f764c9fec'; // твой ключ

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=ru`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Ошибка сети');
    const data = await response.json();
    console.log(data); // здесь уже получаем реальный объект с погодой
    
    result.innerHTML = 
      `
      <h3><span class="city-name">${data.name}</span></h3>
      <p><span class="weather-desc">${data.weather[0].description}</span></p>
      <p>Температура: <span class="temp">${data.main.temp}°C</span></p>
      <p>Ощущается как: <span class="feels-like">${data.main.feels_like}°C</span></p>
      <p>Влажность: <span class="humidity">${data.main.humidity}%</span></p>

      `;
      hint.remove();
      e.target.city.value = '';

  } catch (error) {
    console.error(error);
  }
});
