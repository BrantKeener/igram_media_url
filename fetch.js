const URLRoot = 'https://graph.facebook.com/v4.0/'
const fields = `?fields=`;

const instagramBusinessID = ""/* insert instagram business ID here */;
const access_token = ""/* insert access token here */;
const URLAccessTokenInsert = `&access_token=${access_token}`;

// Error handling function
const handleErrors = (response) => {
  if(!response.ok) {
    throw Error(`${response.status}: ${response.statusText}`);
  }
  return response;
};

// An async call to allow us to properly bring over the media_urls
const mediaURLGetter = async (mediaID) => {
  let mediaURLJSON = await fetch(`${URLRoot}${mediaID}${fields}media_url${URLAccessTokenInsert}`)
    .then(handleErrors)
    .then(response => response.json()
    .then(mediaURLJson => mediaURLJson.media_url))
    .catch(error => console.error(error));
  return mediaURLJSON;
};

// This function gets the URLs for each of the media IDs
const mediaURLArrayBuilder = async mediaIDArray => {
  let mediaURLPromises = [];
  mediaIDArray.forEach((mediaID, index) => {
    mediaURLPromises[index] = mediaURLGetter(mediaID);
  });
  let mediaURLComplete = await Promise.all(mediaURLPromises)
    .then(response => response)
    .catch(error => console.error(error));
  return mediaURLComplete;
};

// This function will give you an array of objects with the media IDs
// If you will use this in conjunction with the ID getter functions, add in igramBusinessAccountID as a parameter, and change the
// INSTAGRAM_BUSINESS_ID in the axios URL to match the parameter
const mediaGetter = async () => {
  let builtArray = await fetch(`${URLRoot}${instagramBusinessID}${fields}media${URLAccessTokenInsert}`)
    .then(handleErrors)
    .then(response => response.json())
    .then(mediaJson => {
      const results = mediaJson.media.data;
      let mediaIDArray = [];
      results.forEach(result => {
        let idOfResult = result.id
        mediaIDArray = [...mediaIDArray, idOfResult];
      });
    return mediaURLArrayBuilder(mediaIDArray)
      .then(response => response)
      .catch(error => console.error(error))
    })
    .catch(error => {
      console.log(error);
    });
  return builtArray;
};

 
const buildTheImages = async () => {
  const imageDiv = document.getElementById('image-div');
  console.log(imageDiv)
  let imagesArray = await mediaGetter();
  imagesArray.forEach(image => {
    let imageElement = document.createElement('img')
    imageElement.src = image;
    // imageElement.setAttribute('alt', 'Instagram feed');
    imageDiv.appendChild(imageElement);
  });
};

buildTheImages();