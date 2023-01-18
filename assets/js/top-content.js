const apikey = "862d8de8876f6a203cf76dea7a7e3cec";

const topTracksElement = $("#top-article-list");

const imgArr = [
  "../assets/img/weeknd.png",
  "../assets/img/taylorswift.png",
  "../assets/img/SZA.png",
  "../assets/img/kendricklamar.png",
  "../assets/img/Drake.png",
  "../assets/img/kanye.png",
  "../assets/img/arcticmonkeys.png",
  "../assets/img/ariana.png",
  "../assets/img/lanadelray.png",
  "../assets/img/tyler.png",
];

function getTopArtists() {
  const endpoint = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apikey}&format=json&limit=10`;

  fetch(endpoint)
    .then(function (response) {
      return response.json();
    })
    //Retrieve top artists data
    .then(function (data) {
      const artistList = data.artists.artist;
      const updatedArtistList = artistList.map((a, index) => {
        a.image[1]["#text"] = imgArr[index];
        return a;
      });

      console.log("updatedArtistList", updatedArtistList);

      updatedArtistList.forEach((a, index) => {
        topTracksElement.append(
          $("<div/>", {
            id: `artist-img-${index}`,
            class: "col-4 d-flex align-items-center",
          }).append(
            $("<img/>", { class: "artist-img" }).attr(
              "src",
              // a.image[1]["#text"],
              imgArr[index]
            )
          )
        );

        topTracksElement.append(
          $("<div/>", {
            id: `artist-name-${index}`,
            class: "col-8 d-flex align-items-center",
            text: `${a.name}`,
          })
        );
      });
    });
}

function getTopTracks() {
  const endpoint = `http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apikey}&format=json&limit=10`;

  fetch(endpoint)
    .then(function (response) {
      return response.json();
    })
    //Retrieve top artists data
    .then(function (data) {
      // Render HTML element to show top 10 tracks here
      console.log(data.tracks.track);

      const arrayList = data.tracks.track;

      arrayList.forEach((track) => {
        console.log("inside Array",track.name);
        
        const liElement = $("<li/>", {
          text: `${track.name}`
        })

        $("#top-track-list").append(liElement);
      })

    });
}

getTopArtists();
getTopTracks();
