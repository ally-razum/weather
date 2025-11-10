console.log ("hi weather!")
const result = document.getElementById('result');
const hint = document.getElementById('hint'); // Введите город, чтобы узнать погоду 🌤️
const errorMessage = document.getElementById('error-message');

const countryNames = {
  RU: 'Россия',
  UA: 'Украина',
  BY: 'Беларусь',
  KZ: 'Казахстан',
  AM: 'Армения',
  GE: 'Грузия',
  AZ: 'Азербайджан',
  MD: 'Молдова',
  UZ: 'Узбекистан',
  KG: 'Киргизия',
  TJ: 'Таджикистан',
  TM: 'Туркменистан',
  EE: 'Эстония',
  LV: 'Латвия',
  LT: 'Литва',
  PL: 'Польша',
  DE: 'Германия',
  FR: 'Франция',
  IT: 'Италия',
  ES: 'Испания',
  GB: 'Великобритания',
  US: 'США',
  CA: 'Канада',
  CN: 'Китай',
  JP: 'Япония',
  KR: 'Южная Корея',
  IN: 'Индия',
  TR: 'Турция',
  IL: 'Израиль',
  EG: 'Египет',
  BR: 'Бразилия',
  AR: 'Аргентина',
  AU: 'Австралия',
  NZ: 'Новая Зеландия',
};


//функция очистки всех блоков текста
function clearInputAfterTime(input = null, errorBlock = null, time = 3000) {
  setTimeout(() => {
    if (errorBlock) errorBlock.textContent = '';
    if (input) {
      input.value = '';
      input.focus();
    }
  }, time);
}



document.getElementById('weather-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const input = e.target.city;
  const city = input.value.trim(); // теперь это строка

    // очищаем предыдущий результат перед новой попыткой
  result.innerHTML = 'Введите город, чтобы узнать погоду 🌤️';
  errorMessage.textContent = '';

  // регулярка для проверки: только буквы и дефисы (поддерживает кириллицу)
  const cityRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;

  if (!city) {   
    errorMessage.textContent = ('Введите название города! 🤔');
     clearInputAfterTime(input, errorMessage);
    return;
  }

   if (city.length < 2) {    
    errorMessage.textContent = ('Слишком короткое название города 😅');
     clearInputAfterTime(input, errorMessage);
    return;
  }

  if (!cityRegex.test(city)) {    
    errorMessage.textContent =('Название города может содержать только буквы!😏');
     clearInputAfterTime(input, errorMessage);
    return;
  }


  const apiKey = '85c36bd9c5f37754f9698d0f764c9fec'; // твой ключ

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=ru`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Город не найден 😕');
    const data = await response.json();
    console.log(data); // здесь уже получаем реальный объект с погодой

    const countryCode = data.sys.country;
    const countryName = countryNames[countryCode] || countryCode; // если нет в словаре — оставить код

    
    result.innerHTML = 
      `
      <h2> <span class="city-name">${data.name}, ${countryName}</span></h2>   
       <img 
      src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" 
      alt="${data.weather[0].description}" 
      class="weather-icon"
    >
      <p><span class="weather-desc">${data.weather[0].description}</span></p>
      <p>Температура: <span class="temp">${Math.round(data.main.temp)}°C</span></p>
      <p>Ощущается как: <span class="feels-like">${Math.round(data.main.feels_like)}°C</span></p>
      <p>Влажность: <span class="humidity">${data.main.humidity}%</span></p>
      <p>Ветер: <span class="wind">${data.wind.speed} м/с</span></p>

      

      `;

    hint.remove();
  } catch (error) {
    console.error(error);   
    errorMessage.textContent = error.message;

    hint.remove();
    result.innerHTML = `
      <h3><span class="city-name">Упс! Города ${city} нет... </span></h3>    
    `;

    setTimeout(() => {
      result.innerHTML = 'Введите город, чтобы узнать погоду 🌤️';
    }, 3000);
    
    clearInputAfterTime(input, errorMessage);    
 
  } finally {
    e.target.city.value = '';
  }
});
