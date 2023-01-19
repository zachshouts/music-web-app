const apikey = "862d8de8876f6a203cf76dea7a7e3cec";

const imgArtistArr = [
  "../assets/img/artists/taylorswift.png",
  "../assets/img/artists/kanye.png",
  "../assets/img/artists/lanadelray.png",
  "../assets/img/artists/arcticmonkeys.png",
  "../assets/img/artists/Drake.png",
  "../assets/img/artists/weeknd.png",
  "../assets/img/artists/ariana.png",
  "../assets/img/artists/kendricklamar.png",
  "../assets/img/artists/tyler.png",
  "../assets/img/artists/SZA.png",
];

const topArticlesElement = $("#top-article-list");

const imgTrackArr = [
  "../assets/img/tracks/killbill.png",
  "../assets/img/tracks/antihero.png",
  "../assets/img/tracks/asitwas.png",
  "../assets/img/tracks/badhabit.png",
  "../assets/img/tracks/lastchristmas.png",
  "../assets/img/tracks/alliwantforchristmas.png",
  "../assets/img/tracks/low.png",
  "../assets/img/tracks/creepin.png",
  "../assets/img/tracks/shirt.png",
  "../assets/img/tracks/nobodygetsme.png",
];

const w = window.innerWidth;

function getTopArtists() {
  const endpoint = `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apikey}&format=json&limit=10`;

  fetch(endpoint)
    .then(function (response) {
      return response.json();
    })
    //Retrieve top artists data
    .then(function (data) {
      const artistList = data.artists.artist;

      artistList.sort((prev, next) => next.playcount - prev.playcount);

      console.log("after sort", artistList);

      artistList.forEach((a, index) => {
        topArticlesElement.append(
          $("<div/>", {
            class:
              "col-12 col-sm-1 d-flex justify-content-center justify-content-sm-start align-items-center fs-1",
            text: `${index + 1}`,
          })
        );

        console.log(data);
        topArticlesElement.append(
          $("<div/>", {
            id: `artist-img-${index}`,
            class:
              "col-12 col-sm-2 d-flex justify-content-center justify-content-sm-start align-items-center",
          }).append(
            $("<img/>", { class: "artist-img" }).attr(
              "src",
              imgArtistArr[index]
            )
          )
        );

        topArticlesElement.append(
          $("<div/>", {
            id: `artist-name-${index}`,
            class:
              "col-12 col-sm-3 d-flex justify-content-center justify-content-sm-start align-items-center text-danger",
            text: `${a.name}`,
          })
        );

        topArticlesElement.append(
          $("<div/>", {
            class:
              "col-12 col-sm-3 d-flex justify-content-center justify-content-sm-start align-items-center text-warning",
            text: (w > 576 ? "" : "Listeners:") + ` ${a.listeners}`,
          })
        );

        topArticlesElement.append(
          $("<div/>", {
            class: `col-12 col-sm-3 d-flex justify-content-center justify-content-sm-start align-items-center text-playcount-${
              artistList.length - index
            }`,
            text: (w > 576 ? "" : "Playcount:") + ` ${a.playcount}`,
          })
        );

        topArticlesElement.append($("<hr />", {}));
      });
    });
}

const topTracksElement = $("#top-track-list");

function getTopTracks() {
  const endpoint = `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apikey}&format=json&limit=10`;

  fetch(endpoint)
    .then(function (response) {
      return response.json();
    })
    //Retrieve top artists data
    .then(function (data) {
      // Render HTML element to show top 10 tracks here
      console.log(data.tracks.track);

      const arrayList = data.tracks.track;

      arrayList.forEach((track, index) => {
        console.log("inside Array", track.name);

        topTracksElement.append(
          $("<div/>", {
            class: "col-2 mb-3",
          }).append(
            $("<img />", { class: "track-img" }).attr("src", imgTrackArr[index]) // Replace the imgArr to imgTrackArr
          )
        );

        topTracksElement.append(
          $("<div/>", {
            class: "col-2 mb-3 custom-font-color",
            text: `${track.name}`,
          })
        );

        topTracksElement.append(
          $("<div/>", {
            class: "col-2 mb-3",
            text: `${track.listeners}`,
          })
        );

        topTracksElement.append(
          $("<div/>", {
            class: "col-6 mb-3",
            text: `${track.playcount}`,
          })
        );

        topTracksElement.append($("<hr/>", {}));

        // const liElement = $("<li/>", {
        //   text: `${track.name}`
        // })

        // $("#top-track-list").append(liElement);
      });
    });
}

getTopArtists();
getTopTracks();
