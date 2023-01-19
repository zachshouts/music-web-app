//Set global variables
const apikey = "862d8de8876f6a203cf76dea7a7e3cec";
let artist = "Ed Sheeran";

//Set up carousel
const glideConfig = {
  type: "carousel",
  perView: 5,
  gap: 10,
  length: 10,
  focusAt: "center",
  startAt: 1,
  autoplay: 4000,
  breakpoints: {
    768: { perView: 1 },
    1200: { perView: 2 },
    1300: { perView: 3 },
    1700: { perView: 4 },
  },
};
let glide = new Glide(".glide", glideConfig).mount();
const glidesList = $(".glide__slides");
const submitButton = $("#submit-btn");
const infoBtn = $("#info-btn");
const infoBox = $("#info-box");
const topTracks = $("#top-track-list");
const topAlbums = $("#top-albums-list");
const searchBox = $(".form-control");

let nameArr = JSON.parse(localStorage.getItem("artistHistory") || "[]");

displayHistory();

//Load past searches
function displayHistory() {
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
  findArtist();
}

//Set up search box
submitButton.on("click", function (event) {
  event.preventDefault();
  searchArtist();
});

//Find artist info from search box
function searchArtist() {
  const searchBox = $(".form-control");

  artist = searchBox.val();
  searchBox.val("");
  findArtist();
}

//Set up modal
startSlide = $(".glide__slides");
startSlide.attr("data-bs-toggle", "modal");
startSlide.attr("data-bs-target", "#myModal");

//Display modal
startSlide.on("click", function () {
  searchAlbum(artist);
});

function findArtist() {
  topAlbums.empty();
  setInfoBox();
  const endpoint = `http://ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=${artist}&api_key=${apikey}&format=json&limit=10`;

  fetch(endpoint)
    .then(function (response) {
      return response.json();
    })

    //Retrieve artist data
    .then(function (data) {
      artist = data.topalbums["@attr"].artist;
      for (let i = 0; i < 10; i++) {
        // Glide rendering
        const liItem = $(`.glide-${i + 1}`);
        for (let x = 0; x < liItem.length; x++) {
          liItem[
            x
          ].innerHTML = `<img src="${data.topalbums.album[i].image[3]["#text"]}" /><p>${data.topalbums.album[i].name}</p>`;
        }

        // Info box albums rendering
        const newRow = $("<div>").addClass("row");
        const bigCol = $("<div>").addClass("col-8");
        const smallCol = $("<div>")
          .addClass("col-4")
          .attr("style", "text-align: center;");

        bigCol.append(
          $("<p>").addClass("px-3").text(data.topalbums.album[i].name)
        );
        smallCol.append($("<p>").text(data.topalbums.album[i].playcount));
        newRow.append(bigCol, smallCol);
        topAlbums.append(newRow);
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
        nameArr.unshift(artistName);

        localStorage.setItem("artistHistory", JSON.stringify(nameArr));
        displayHistory();
      }
    });
}

//Retrive song information from album
function searchAlbum(artist) {
  let currentSlide = $(".glide__slide--active");
  let album = currentSlide.children("p").text();
  let artistJoin = artist.split(" ").join("+");
  let albumJoin = album.split(" ").join("+");
  if (albumJoin === "+") {
    albumJoin = encodeURIComponent("+");
  }

  const target = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apikey}&artist=${artistJoin}&album=${albumJoin}&format=json`;

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
      try {
        if (!Array.isArray(data.album.tracks.track)) {
          let listTag = $(`<li>`);
          listTag.append(
            $(`<a>`)
              .attr("href", data.album.tracks.track.url)
              .text(data.album.tracks.track.name)
              .attr("style", "text-decoration: none; color: #47FFBE;")
              .attr("target", "_blank;")
          );
          albumTrack.append(listTag);
        } else {
          for (i = 0; i < data.album.tracks.track.length; i++) {
            let listTag = $(`<li>`);
            listTag.append(
              $(`<a>`)
                .attr("href", data.album.tracks.track[i].url)
                .text(data.album.tracks.track[i].name)
                .attr("style", "text-decoration: none; color: #47FFBE;")
                .attr("target", "_blank;")
            );
            albumTrack.append(listTag);
          }
        }
      } catch (exceptionError) {
        albumTrack.append("<li>Tracks are unavailable for this album<li>");
      }
    });
}

//Display Info Box
function setInfoBox() {
  topTracks.empty();
  const endpoint = `http://ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&artist=${artist}&api_key=${apikey}&format=json&limit=10`;

  fetch(endpoint)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      for (let i = 0; i < 10; i++) {
        const newRow = $("<div>").addClass("row");
        const bigCol = $("<div>").addClass("col-8");
        const smallCol = $("<div>")
          .addClass("col-4")
          .attr("style", "text-align: center;");

        bigCol.append(
          $("<p>").addClass("px-3").text(data.toptracks.track[i].name)
        );
        smallCol.append($("<p>").text(data.toptracks.track[i].playcount));
        newRow.append(bigCol, smallCol);
        topTracks.append(newRow);
      }
    });
}

//More Info Button
infoBtn.on("click", function (e) {
  if (e.target.textContent === "View More") {
    e.target.textContent = "View Less";
    infoBox.attr("style", "visibility: visible;");
  } else {
    e.target.textContent = "View More";
    infoBox.attr("style", "visibility: hidden;");
  }
});

//Inital Page Display
findArtist();
