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
const infoBtn = $('#info-btn');
const infoBox = $('#info-box');
const topTracks = $('#top-track-list');
const topAlbums = $('#top-albums-list');
const searchBox = $(".form-control");

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
  
  artist = searchBox.val();
  searchBox.val("");
  findArtist(artist);
  }


function findArtist(artist) {
  topAlbums.empty();
  setInfoBox();
  const endpoint = `http://ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=${artist}&api_key=${apikey}&format=json&limit=10`;

  fetch(endpoint)
    .then(function (response) {
      return response.json();
    })

    //Retrieve artist data
    .then(function (data) {
      for (let i = 0; i < 10; i++) {
        // Glide rendering
        const liItem = $(`.glide-${i+1}`)
        for (let x = 0; x < liItem.length; x++) {
          liItem[x].innerHTML = `<img src="${data.topalbums.album[i].image[3]['#text']}" /><p>${data.topalbums.album[i].name}</p>`
        }

        // Info box albums rendering
        const newRow = $('<div>').addClass('row');
        const bigCol = $('<div>').addClass('col-8');
        const smallCol = $('<div>').addClass('col-4').attr('style', 'text-align: center;');

        bigCol.append($('<p>').addClass('px-3').text(data.topalbums.album[i].name));
        smallCol.append($('<p>').text(data.topalbums.album[i].playcount));
        newRow.append(bigCol, smallCol);
        topAlbums.append(newRow);
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

function setInfoBox() {
  topTracks.empty();
  const endpoint = `http://ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&artist=${artist}&api_key=${apikey}&format=json&limit=10`
  
    fetch(endpoint)
      .then(function(response) {
        return response.json();
      })
  
      .then(function(data) {
        for (let i = 0; i < 10; i++){
          const newRow = $('<div>').addClass('row');
          const bigCol = $('<div>').addClass('col-8');
          const smallCol = $('<div>').addClass('col-4').attr('style', 'text-align: center;');
  
          bigCol.append($('<p>').addClass('px-3').text(data.toptracks.track[i].name));
          smallCol.append($('<p>').text(data.toptracks.track[i].playcount));
          newRow.append(bigCol, smallCol);
          topTracks.append(newRow);
        }
      })
}

infoBtn.on('click', function(e) {
  if (e.target.textContent === 'View More') {
    e.target.textContent = "View Less";
    infoBox.attr('style', 'visibility: visible;');
    
  } else {
    e.target.textContent = "View More";
    infoBox.attr('style', 'visibility: hidden;');
  }

})
