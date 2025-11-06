console.log ("hi!")

document.getElementById('weather-form').addEventListener('submit', (e) => {
    console.log('я вижу форму')
    e.preventDefault(); 
    const city = e.target.city.value; // город из input
    

    fetch('https://samples.openweathermap.org/data/2.5/weather?q=London&appid=b6907d289e10d714a6e88b30761fae22')
      .then(response => response.json())
      .then(data => console.log(data)) // здесь можно потом вставлять в блок на странице
      .catch(error => console.error('Ошибка:', error));
});