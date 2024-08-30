"use strict";

// Variabel
const forecastEl = document.getElementById("nextDay-container");
const contentMainEl = document.getElementById("content-main");
const search = document.querySelector("#nama-kota");
const content = document.querySelector("#content-data");
const infoEl = document.querySelector("#content-city");
const dailyEl = document.querySelector("#daily-report");
const loading = document.querySelector("#loading");

const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

let city = "";

// Variabel

// Function

//Menampilkan icon cuaca
const iconCuaca = function (params) {
  let word = "";

  if (params >= 0 && params <= 2) {
    return (word = "cerah0");
  } else if (params >= 3 && params <= 48) {
    return (word = "cerah1");
  } else if (params >= 51 && params <= 57) {
    return (word = "hujan0");
  } else if (params >= 58 && params <= 200) {
    return (word = "hujan1");
  }
};

// Mengambil hanya negara Indonesia saja
// function Country (params) {

//   if (params != "Indonesia")
// }

//Menampilkan deskripsi cuaca
const kondisiCuaca = function (params) {
  let word = "";

  if (params >= 0 && params <= 2) {
    return (word = "sangat cerah");
  } else if (params >= 3 && params <= 48) {
    return (word = "cerah berawan");
  } else if (params >= 51 && params <= 57) {
    return (word = "mendung");
  } else if (params >= 58 && params <= 82) {
    return (word = "hujan");
  }
};

// Melakukan fetching data
const getData = async function () {
  content.style.display = "none";
  dailyEl.style.display = "none";
  infoEl.style.display = "none";
  city = search.value;
  if (city != "Jakarta" && city === "") {
    city = "Jakarta Pusat";
  } else if (city != "Jakarta") {
    city = search.value;
  } else {
    city = "Jakarta Pusat";
  }

  forecastEl.innerHTML = "";

  loading.innerHTML = `
        <span class="loader"></span>
        <h2>Sedang Memuat</h2>
      `;

  try {
    // Mengambil data latitide dan longitude kota
    const responseJCity = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`
    );
    let dataCity = await responseJCity.json();
    let nameCity = dataCity.results[0].name;
    let longitude = dataCity.results[0].longitude;
    let latitude = dataCity.results[0].latitude;

    // Mengambil data cuaca
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=14`
    );
    let dataWeather = await response.json();

    //daily
    let tanggal = dataWeather.daily.time;
    let tempMin = dataWeather.daily.temperature_2m_min;
    let tempMax = dataWeather.daily.temperature_2m_max;
    let weatherCode = dataWeather.daily.weather_code;

    //current
    let lembab = dataWeather.current.relative_humidity_2m;
    let wind = dataWeather.current.wind_speed_10m;
    let weatherCodeCurrent = dataWeather.current.weather_code;
    let tempCurrent = dataWeather.current.temperature_2m;

    let dateMain = new Date(tanggal[0]);
    let dayMain = dateMain.getDay();

    // Menambahahkan content current weather
    let syntaxMain = `
    <h2 id="tittle-kota">Kota<span id="span-kota"> ${nameCity}</span></h2>

          <div class="content-p">
            <p>
              Hari <span id="span-hari-main">${
                days[dayMain]
              }</span> ini cuaca di kota
              <span id="span-kota">${nameCity}</span> sedang
              <span id="span-temp">${kondisiCuaca(
                weatherCodeCurrent
              )}</span>, adapun suhu sekarang
              yaitu <span id="span-temp">${tempCurrent}</span>°C. Kelembapan
              tercatat menyentuh angka <span id="span-humidity">${lembab}%</span> dan
              kecepatan angin hingga <span id="span-wind">${wind}</span> Km/jam.
            </p>

            <div class="img-cuaca-container">
              <img
                id="img-cuaca"
                src="img/body/iconCuaca/${iconCuaca(weatherCodeCurrent)}.png"
                alt="icon"
              />
            </div>
            <div class="content-ui">
              <div class="hari">
                <img src="img/body/icon-hari-02.png" alt="hari" />
                <p>${days[dayMain]}</p>
              </div>
              <div class="suhu">
                <img src="img/body/icon-suhu-02.png" alt="icon" />
                <p>${Math.round(tempCurrent)}°C</p>
              </div>
              <div class="lembab">
                <img src="img/body/icon-humi-02.png" alt="icon" />
                <p>${lembab}%</p>
              </div>
              <div class="angin">
                <img src="img/body/icon-angin-02.png" alt="icon" />
                <p>${wind} Km/j</p>
              </div>
            </div>
            <div class="report">
              <p>
                Apabila terjadi keanehan pada informasi, silahkan berikan
                informasi kepada kami melalui tombol ini.
              </p>
              <button id="btn-report">Laporkan Masalah</button>
            </div>
    `;

    contentMainEl.innerHTML = syntaxMain;

    //Membuat content prediksi cuaca
    for (let i = 0; i < tanggal.length - 1; i++) {
      let date = new Date(tanggal[i + 1]);
      let month = date.getMonth();
      let year = date.getFullYear();
      let day = date.getDay();
      let dates = date.getDate();

      document.getElementById("span-kota-daily").textContent = nameCity;
      let syntax = `<div class="nextDay">
            <img src="img/body/iconCuaca/${iconCuaca(
              weatherCode[i + 1]
            )}.png" alt="icon" />
            <div class="nextDay-p">
              <h6>
                <span id="span-hari">${days[day]},</span>
                <span id="span-tgl"
                  >${dates} <span id="span-bulan">${
        months[month]
      }</span> ${year}</span
                >
              </h6>
              <div class="span-minMax">
                <div class="label-minMax">
                  <p>Suhu Min</p>
                  <p>Suhu Maks</p>
                </div>
                <div class="value-minMax">
                  <p id="temp-min">${tempMin[i]}°C</p>
                  <p id="temp-min">${tempMax[i]}°C</p>
                </div>
              </div>
            </div>
          </div>`;

      forecastEl.innerHTML += syntax;

      // Mendapatkan content budaya dari kota terpilih
      let information = "";
      switch (nameCity) {
        case "Jakarta Pusat":
          information =
            "Tugu Monumen Nasional, atau biasa dikenal dengan Monas, adalah ikon utama kota Jakarta. Monas dirancang sebagai simbol perjuangan kemerdekaan bangsa Indonesia. Monumen ini memiliki tinggi sekitar 132 meter, dengan puncak yang dikelilingi oleh api perunggu berlapis emas, melambangkan semangat kemerdekaan yang abadi. Pembangunan dimulai pada 17 Agustus 1961 dan diresmikan untuk umum pada tanggal 12 Juli 1975.";
          break;

        case "Palembang":
          information =
            "Jembatan Ampera dibangun dengan nama awal Jembatan Soekarno pada April 1962. Baru pada 1966, jembatan ini berganti nama menjadi Jembatan Ampera yang memiliki kepanjangan Amanat Penderitaan Rakyat. Jembatan Ampera berfungsi sebagai penghubung antara daerah Seberang Ulu dan Seberang Ilir. Panjang Jembatan Ampera 1.117 m, lebar 22 m (bagian tengah 71,90 m, berat 944 ton dan dilengkapi pembandul seberat 500 ton).";
          break;

        case "Surabaya":
          information =
            "Patung Sura dan Baya adalah sebuah patung yang merupakan lambang kota Surabaya dan menjadi icon dari kota ini. Patung ini berada di depan Kebun Binatang Surabaya. Patung ini terdiri atas dua hewan yaitu buaya dan hiu yang menjadi inspirasi nama kota Surabaya: ikan sura (hiu) dan baya (buaya). Patung ini dibangun pada tahun 1988 oleh pemahat yang bernama Sigit Margono dengan bahan semen dan di arsiteki oleh Sutomo Kusnadi.";
          break;

        case "Bandung":
          information =
            "Gedung sate mulai dibangun pada tahun 1920 dan selesai pada tahun 1924, merupakan salah satu peninggalan bersejarah dari zaman Hindia Belanda. Dirancang oleh arsitek terkemuka pada masanya, Ir. J. Gerber, gedung ini awalnya dibangun untuk menjadi markas pemerintahan Hindia Belanda di Jawa Barat. Nama “Gedung Sate” sendiri berasal dari ornamen unik yang menonjol di bagian atas gedung, yang menyerupai tusuk sate tradisional.";
          break;

        case "Medan":
          information =
            "Sejarah Istana Maimun dimulai tahun 1888, di mana pada tahun tersebut istana ini mulai dibangun oleh pemerintahan Sultan Ma'moen Al Rasyid Perkasa Alamsyah. Istana ini akhirnya selesai dibangun tahun 1891. Nama Maimun sendiri diambil dari nama permaisuri Sultan yang bernama Siti Maimunah. Bangunan ini memiliki arsitektur yang mencerminkan perpaduan dari berbagai budaya, seperti Melayu, India, Timur Tengah, dan Eropa.";
          break;

        case "Semarang":
          information =
            "Gedung Marba dibangun dan dimiliki oleh seorang saudagar kaya dari Yaman yang bernama Marta Badjunet. Nama gedung ini merupakan akronim dari nama pemiliknya. Fungsi gedung ini awalnya ada dua yaitu sebagai kantor urusan pelayaran dan toko dagang. Nama kantor pelayaran tersebut adalah Ekspedisi Muatan Kapal Laut. Gedung Marba dibangun dan dimiliki oleh seorang saudagar kaya dari Yaman yang bernama Marta Badjunet.";
          break;

        case "Makasar":
          information =
            "Monumen Mandala adalah suatu tugu yang di bangun di Tanah Makassar tepatnya di Jl. Jenderal Soedirman. Salah satu cara mensosialisasikan Monumen Mandala melalui berbagai media baik media cetak, media sosial atau media Visual lainnya. Dahulu merupakan Sekolah guru (kweekschool), lalu seiring berjalannya waktu di tahun 1946 menjadi Hoofdkwartier van de Koninklijke Marine atau Markas Angkatan Laut Kerajaan Belanda.";
          break;

        case "Batam":
          information =
            "Jembatan Barelang (Batam, Rempang, dan Galang) adalah sekumpulan jembatan yang menghubungkan pulau-pulau yaitu Pulau Batam, Pulau Tonton, Pulau Nipah, Pulau Rempang, Pulau Galang dan Pulau Galang Baru di daerah Batam, provinsi Kepulauan Riau, Indonesia. Jembatan Barelang merupakan ikon Kota Batam yang populer, khususnya bagi masyarakat Kepulauan Riau. Jembatan ini menjadi tujuan utama berwisata di Batam.";
          break;

        case "Balikpapan":
          information =
            "Tempat ini sering disebut sebagai Monpera yang merupakan sisa peninggalan sejarah pertama di Balikpapan. Monumen pertama tahun 1983 adalah prajurit Dayak yang terbuat dari kayu ulin, sedang menggenggam bendera di depan kolam ikan. Monumen Perjuangan Rakyat Balikpapan di dalamnya memiliki sebuah ruang diorama yang dibuka untuk umum dan panggung terbuka untuk pertunjukan seni-budaya atau pentas kreativitas para remaja.";
          break;

        case "Samarinda":
          information =
            "Taman Samarendah berada di pusat kota Samarinda. Dinamakan Samarendah karena Masyarakat pada zaman dulu sering menyebut Samarinda dengan pelafalan 'Samarendah' (e-nya dibaca seperti menyebut e dikata 'bemo'). Selain itu Samarendah merupakan salah satu karakteristik Kota Samarinda yang memiliki dataran-dataran yang sama rendah. Adapun arti nama sebenarnya adalah taman yang tampak samar dari kejauhan tapi indah dipandang.";
          break;

        default:
          information =
            "Kota yang Anda masukan tidak berada di negara Indonesia";
      }

      const syntaxInfo =
        await `<img id="jakarta" src="img/body/kota/${nameCity}.jpg" alt="Content" />
        <p>${information}</p>`;

      infoEl.innerHTML = syntaxInfo;
      // document.querySelector("#loading").remove();
    }
    content.style.display = "block";
    infoEl.style.display = "block";
    dailyEl.style.display = "block";
    // }
    //Handling error
  } catch (error) {
    alert("Error");
  }
};

// Pemanggilan function
getData();
