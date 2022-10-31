import city from './data/weatherbycity.js'
import paises from './data/allcountries.js'

const current = document.querySelector('#current');
const addCity = document.querySelector('.addCity');
const add = document.querySelector('#add');
const capitals = document.querySelector('#capitals');
const ul = capitals.querySelector('ul');
const center = document.querySelector('.center');

var arrayCidades = [];

window.addEventListener('load', e => {

    if (localStorage.getItem(localStorage.getItem('cidades')) != "") {
        arrayCidades = [...JSON.parse(localStorage.getItem('cidades'))]
        arrayCidades.forEach(cidade => {
            current.insertAdjacentHTML('afterend', `<div class="gradient-border current" id="${cidade}"></div>`);
            createTable(cidade, document.getElementById(cidade))
        })
    }

    paises().then(data => {
        data.forEach((cidade) => {
            ul.innerHTML += `<li draggable="true" id="${cidade.capital}, ${cidade.name.common}">${cidade.capital}, ${cidade.name.common}</li>`
            ul.ondragstart = e => {
                e.dataTransfer.setData("text/plain", e.target.id);
            }
        })
    })

    ul.setAttribute('style', 'height: 700px; overflow: auto')
})

//adicionar cidade pela dropzone
const dropzone = document.querySelector('[dropzone')
dropzone.ondragover = e => e.preventDefault();
dropzone.ondrop = e => {
    const cidade = e.dataTransfer.getData("text");
    addTempoCidade(cidade)
}

//abre e fecha modal com form
add.addEventListener('click', e => {
    addCity.classList.remove('hide')
})
document.addEventListener('keydown', e => {
    if (e.key === "Escape") {
        addCity.classList.add('hide')
    }
})

//adicona cidade pelo form
addCity.addEventListener('submit', e => {
    e.preventDefault();
    const city = addCity.querySelector('#city');
    addTempoCidade(city.value)
    addCity.classList.add('hide')
})



//adiciona tempo e cidade
function addTempoCidade(cidade) {
    arrayCidades.push(cidade);
    localStorage.setItem('cidades', JSON.stringify(arrayCidades))
    current.insertAdjacentHTML('afterend', `<div class="gradient-border current" id="${cidade}"></div>`);
    createTable(cidade, document.getElementById(cidade))
}



//Geolocation 
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition,
        showError);
} else {
    current.innerHTML = "Geolocation is not supported by this browser.";
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            current.innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            current.innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            current.innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            current.innerHTML = "An unknown error occurred.";
            break;
    }
}

var q;
function showPosition(position) {
    q = `${position.coords.latitude},${position.coords.longitude}`;
    createTable(q, current)
}

//cria tabela com tempo e ciade atual
function createTable(q, idTabela) {
    city(q).
        then(data => {

            idTabela.innerHTML += ` 
    <p id="close">X</p>
    <p>${data.location.region}, ${data.location.country}<img class="condition" src="${data.current.condition.icon}"><br>
    <span class="condition">${data.current.condition.text}, ${data.current.is_day == 1 ? 'day' : 'night'}</span>, ${data.current.temp_c}º<br><br>   
    <span class="condition">${verdia(data.forecast.forecastday[1].date)}  <img class="condition"src="${data.forecast.forecastday[1].day.condition.icon}"
                 >${data.forecast.forecastday[1].day.condition.text}</span><br>
                 <span class="condition">${verdia(data.forecast.forecastday[2].date)}  <img class="condition"src="${data.forecast.forecastday[2].day.condition.icon}"
                 >${data.forecast.forecastday[2].day.condition.text}</span><br>
                 <span class="condition">${verdia(data.forecast.forecastday[3].date)}  <img class="condition"src="${data.forecast.forecastday[3].day.condition.icon}"
                 >${data.forecast.forecastday[3].day.condition.text}</span><br>
    `;
        })
        .catch(err => {
            console.log('Erro', err.message)
        });
}



function verdia(dia) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    var dataAno = new Date(dia)
    var dia = dataAno.getDay()
    return weekdays[dia];
}

center.addEventListener('click', e => {
    if (e.target.id == 'close') {
        var nome = (e.target).parentElement
        center.removeChild(nome)
        arrayCidades = arrayCidades.filter(list => list != nome.id)
        localStorage.setItem('cidades', JSON.stringify(arrayCidades))
    }
})