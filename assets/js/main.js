//Set global variables
const apikey = "862d8de8876f6a203cf76dea7a7e3cec";
let artist = "Ed Sheeran";
let nameArr = JSON.parse(localStorage.getItem("artistHistory") || "[]");
const button = $("#submit-btn");

//Set up carousel
const glideConfig = {
  type: "carousel",
  perView: 5,
  gap: 10,
  length: 10,
  focusAt: "center",
  startAt: 1,
  // autoplay: 4000,
  breakpoints: {
    768: { perView: 1 },
    1200: { perView: 2 },
    1300: { perView: 3 },
    1700: { perView: 4 },
  },
};
//Display carousel
let glide = new Glide(".glide", glideConfig).mount();
const glidesList = $(".glide__slides");

loadHistory();

//Load past searches
function loadHistory() {
  const historyList = $(".list-group");
  historyList.empty();
  if (nameArr.length > 6) {
    for (i = 0; i < 6; i++) {
      historyList.append(
        `<li class="list-group-item" onclick="artistInfo(event)">${nameArr[i]}</li>`
      );
    }
  } else {
    nameArr.forEach((element) =>
      historyList.append(
        `<li class="list-group-item" onclick="artistInfo(event)">${element}</li>`
      )
    );
  }
}

//Find artist info from past searches
function artistInfo(event) {
  artist = event.target.textContent;
  findArtist(artist);
}

//Set up search box
button.on("click", function (event) {
  event.preventDefault();
  searchArtist();
});

//Find artist info from search box
function searchArtist() {
  const searchBox = $(".form-control");
  artist = searchBox.val();
  searchBox.val("");
  findArtist(artist);
}

//Set up modal
// const myModal = new bootstrap.Modal(document.getElementById("myModal"));
const modalBtn = document.getElementById("modal-button");
startSlide = $(".glide__slides");
startSlide.attr("data-bs-toggle", "modal");
startSlide.attr("data-bs-target", "#myModal");
//Display modal
startSlide.on("click", function () {
  searchAlbum(artist);
});

function findArtist(artist) {
  const endpoint = `http://ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=${artist}&api_key=${apikey}&format=json&limit=10`;

  fetch(endpoint)
    .then(function (response) {
      return response.json();
    })

    //Retrieve artist data
    .then(function (data) {
      for (let i = 0; i < 10; i++) {
        const liItem = $(`.glide-${i + 1}`);
        for (let x = 0; x < liItem.length; x++) {
          liItem[
            x
          ].innerHTML = `<img src="${data.topalbums.album[i].image[3]["#text"]}" /><p>${data.topalbums.album[i].name}</p>`;
        }
      }

      storeNames();
      //Store artist name is past searches
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

function searchAlbum(artist) {
  let currentSlide = $(".glide__slide--active");
  let album = currentSlide.children("p").text();
  let artistJoin = artist.split(" ").join("+");
  let albumJoin = album.split(" ").join("+");
  if (albumJoin === "+") {
    albumJoin = encodeURIComponent("+");
  }

  const target = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apikey}&artist=${artistJoin}&album=${albumJoin}&format=json`;

  console.log(target);

  fetch(target)
    .then(function (response) {
      return response.json();
    })

    //Retrieve artist data
    .then(function (data) {
      let albumTitle = $("#myModalLabel");
      let albumTrack = $("#album-tracks");
      albumTitle.text("");
      albumTrack.text("");
      albumTitle.text(data.album.name);
      for (i = 0; i < data.album.tracks.track.length; i++) {
        albumTrack.append($(`<li>`).text(data.album.tracks.track[i].name));
        console.log(`${data.album.tracks.track[i].name}`);
      }
    });
}
