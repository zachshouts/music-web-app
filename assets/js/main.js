const apikey = "862d8de8876f6a203cf76dea7a7e3cec";
const button = $(".btn");

let nameArr = JSON.parse(localStorage.getItem("artistHistory"));
if (nameArr === null) {
  nameArr = [];
}

function loadHistory() {}

button.on("click", function (event) {
  searchArtist();
  event.preventDefault();
});

function searchArtist() {
  let artist = "";
  const searchBox = $(".form-control");
  artist = searchBox.val();
  let artistData = findArtist(artist);
}

function findArtist(artist) {
  const endpoint = `http://ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=${artist}&api_key=${apikey}&format=json&limit=5`;

  fetch(endpoint)
    .then(function (response) {
      return response.json();
    })

    //Retrieve artist data
    .then(function (data) {
      console.log(data);

      storeNames();

      function storeNames() {
        let artistName = data.topalbums.attr.artist;
        nameArr.push(artistName);
        console.log(nameArr);
        localStorage.setItem("artistHistory", JSON.stringify(nameArr));
      }
    });
}
