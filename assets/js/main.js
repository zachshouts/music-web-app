const apikey = "862d8de8876f6a203cf76dea7a7e3cec";
let artist = "";
const glideConfig = {
  type: 'carousel',
  perView: 5,
  gap: 10,
  length: 10,
  focusAt: 'center',
  startAt: 1,
  // autoplay: 4000,
  breakpoints: {
    768: { perView: 1 },
    1200: { perView: 2 },
    1300: { perView: 3 },
    1700: { perView: 4 }
  }
}
let glide = new Glide('.glide', glideConfig).mount()
const glidesList = $('.glide__slides')
const button = $("#submit-btn");

let nameArr = JSON.parse(localStorage.getItem("artistHistory") || "[]");

loadHistory();

function loadHistory() {
  const historyList = $(".list-group");
  historyList.empty();
  if (nameArr.length > 6) {
    for (i = 0; i < 6; i++) {
      historyList.append(`<li class="list-group-item" onclick="artistInfo(event)">${nameArr[i]}</li>`);
    }
  } else {
    nameArr.forEach((element) =>
      historyList.append(`<li class="list-group-item" onclick="artistInfo(event)">${element}</li>`)
    );
  }
}

function artistInfo(event){
  artist = event.target.textContent;
  findArtist(artist);
}


button.on("click", function (event) {
  event.preventDefault();
  searchArtist();
});

function searchArtist() {
  
  const searchBox = $(".form-control");
  artist = searchBox.val();
  searchBox.val("");
  findArtist(artist);
  }


function findArtist(artist) {
  const endpoint = `http://ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=${artist}&api_key=${apikey}&format=json&limit=10`;

  fetch(endpoint)
    .then(function (response) {
      return response.json();
    })

    //Retrieve artist data
    .then(function (data) {
      for (let i = 0; i < 10; i++) {
        const liItem = $(`.glide-${i+1}`)
        for (let x = 0; x < liItem.length; x++) {
          liItem[x].innerHTML = `<img src="${data.topalbums.album[i].image[3]['#text']}" /><p>${data.topalbums.album[i].name}</p>`
        }
      }

      storeNames();

      function storeNames() {
        let artistName = data.topalbums["@attr"].artist;
        if (nameArr.length > 0) {
          const index = nameArr.findIndex((element) =>
            element.includes(artist)
          );
          if (index !== -1) {
            nameArr.splice(index, 1);
          }
        }
        nameArr.push(artistName);

        localStorage.setItem("artistHistory", JSON.stringify(nameArr));
        loadHistory();
      }
    });
}
