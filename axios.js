require('dotenv').config();
const axios = require('axios');

const INITIAL_USER_ID = process.env.INITIAL_USER_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const INSTAGRAM_BUSINESS_ID = process.env.INSTAGRAM_BUSINESS_ID;
const URLRoot = 'https://graph.facebook.com/v4.0/'
const fields = `?fields=`;
const URLAccessTokenInsert = `&access_token=${ACCESS_TOKEN}`;

// Anice little async/await for making our axios calls
const mediaURLGetter = async (mediaID) => {
  let json = await axios.get(`${URLRoot}${mediaID}${fields}media_url${URLAccessTokenInsert}`)
    .then(response => response.data.media_url)
    .catch(error => console.error(error));
  return json;
};

// This function gets the URLs for each of the media IDs
const mediaURLArrayBuilder = mediaIDArray => {
  let mediaURLPromises = [];
  mediaIDArray.forEach((mediaID, index) => {
    mediaURLPromises[index] = mediaURLGetter(mediaID);
  });
  Promise.all(mediaURLPromises)
    .then(response => console.log(response))
    .catch(error => console.error(error));
};

// This function will give you an array of objects with the media IDs
// If you will use this in conjunction with the ID getter functions, add in igramBusinessAccountID as a parameter, and change the
// INSTAGRAM_BUSINESS_ID in the axios URL to match the parameter
const mediaGetter = () => {
  axios.get(`${URLRoot}${INSTAGRAM_BUSINESS_ID}${fields}media${URLAccessTokenInsert}`)
    .then(response => {
      const results = response.data.media.data;
      let mediaIDArray = [];
      results.forEach(result => {
        let idOfResult = result.id
        mediaIDArray = [...mediaIDArray, idOfResult];
      });
      mediaURLArrayBuilder(mediaIDArray);
    })
    .catch(error => {
      console.log(error);
    });
};

// Once you have the FaceBook userID, this will give you the instagram business account ID associated with that FB page
// These are now deprecated due to having the Istagram business account ID in the .env. This saves calls in the long run, and is more akin
// to how this will behave in production.
const instaIDGetter = facebookID => {
  axios.get(`${URLRoot}${facebookID}${fields}instagram_business_account${URLAccessTokenInsert}`)
    .then(response => {
      mediaGetter(response.data.instagram_business_account.id);
    })
    .catch(error => {
      console.log(error);
    });
};

// If you have a user_id, this will get you the FaceBook ID for that user
const FBIDGetter = () => {
  axios.get(`${URLRoot}${INITIAL_USER_ID}${fields}accounts${URLAccessTokenInsert}`)
    .then(response => {
      instaIDGetter(response.data.accounts.data[0].id);
    })
    .catch(error => {
      console.log(error);
  });
};

mediaGetter();
