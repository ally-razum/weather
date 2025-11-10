console.log ("hi weather!")
const result = document.getElementById('result');
const hint = document.getElementById('hint'); // Введите город, чтобы узнать погоду 🌤️
const errorMessage = document.getElementById('error-message');

const now = new Date();
const options = { 
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  hour: '2-digit', minute: '2-digit'
};
const formattedDate = now.toLocaleDateString('ru-RU', options);


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
  const city = input.value.trim(); 

  // очистка результата перед новой попыткой
  result.innerHTML = 'Введите город, чтобы узнать погоду 🌤️';
  errorMessage.textContent = '';

  // регулярка проверки только буквы и дефисы 
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


  const apiKey = '85c36bd9c5f37754f9698d0f764c9fec'; //  ключ который хз куда еще написать

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=ru`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Город не найден 😕');
    const data = await response.json();
    console.log(data); // здесь уже реальный объект с погодой =)

    const countryCode = data.sys.country;
    const countryName = countryNames[countryCode] || countryCode; // если нет в словаре — оставить код
    
    const countryCodeflag = data.sys.country.toLowerCase(); // ru тк для флага в юрл нужно ловеркейс
    const flagUrl = `https://flagcdn.com/w20/${countryCodeflag}.png`; // ширина 20px шоб мелкая была


    
    result.innerHTML = 
      `
      <h2> 
        <span class="city-name">${data.name}, ${countryName}</span>
        <img src="${flagUrl}" alt="${data.sys.country} флаг" class="country-flag">
      </h2>   
      <img 
      src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" 
      alt="${data.weather[0].description}" 
      class="weather-icon">
      <p class="weather-date">${formattedDate}</p>
      <p><span class="weather-desc">${data.weather[0].description}</span></p>


      <table class="weather-table">
          <tr>
            <td>Температура:</td>
            <td>${Math.round(data.main.temp)}°C</td>
          </tr>
          <tr>
            <td>Ощущается как:</td>
            <td>${Math.round(data.main.feels_like)}°C</td>
          </tr>
          <tr>
            <td>Влажность:</td>
            <td>${data.main.humidity}%</td>
          </tr>
          <tr>
            <td>Ветер:</td>
            <td>${data.wind.speed} м/с</td>
          </tr>
      </table>

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

