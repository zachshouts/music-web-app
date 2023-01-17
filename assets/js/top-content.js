const apikey = "862d8de8876f6a203cf76dea7a7e3cec";

const topTracksElement = $("#top-article-list");

function getTopArtists() {
  const endpoint = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apikey}&format=json&limit=10`;

  fetch(endpoint)
    .then(function (response) {
      return response.json();
    })
    //Retrieve top artists data
    .then(function (data) {
      const artistList = data.artists.artist;

      artistList.forEach((a, index) => {
        topTracksElement.append(
          $("<div/>", { id: `artist-img-${index}`, class: "col-4" }).append(
            $("<img/>", {}).attr("src", a.image[1]["#text"])
          )
        );

        $("<div/>", {
          id: `artist-name-${index}`,
          class: "col-8",
          text: `${a.name}`,
        }).appendTo(`#top-article-list`);
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
