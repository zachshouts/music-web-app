const apikey = '862d8de8876f6a203cf76dea7a7e3cec'
const artist = 'cher'

const endpoint = `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artist}&api_key=${apikey}&format=json`

fetch(endpoint)
.then(function (response){
  return response.json()
})

//Retrieve artist data
.then(function(data){
  console.log(data)})
