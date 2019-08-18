require('dotenv').config();
const axios = require('axios');

const INITIAL_USER_ID = process.env.INITIAL_USER_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const URLRoot = 'https://graph.facebook.com/v4.0/'
const fields = `?fields=`;
const URLAccessTokenInsert = `&access_token=${ACCESS_TOKEN}`;
// let mediaURLArray = [];



// This function gets the URLs for each of the media IDs
const mediaURLArrayBuilder = (mediaIDArray) => {
  let mediaIterator = 0;
  let mediaURLArray = [];
  const mediaURLGetter = () => {
    axios.get(`${URLRoot}${mediaIDArray[mediaIterator]}${fields}media_url${URLAccessTokenInsert}`)
      .then(response => {
        mediaURLArray = [...mediaURLArray, response.data.media_url];
        console.log(mediaURLArray);
      })
      .catch(error => {
        console.log(error);
    });
    if(mediaIterator < mediaIDArray.length - 1 || mediaIterator === 19) {
      mediaIterator++;
      mediaURLGetter();
    } else {
      console.log(mediaIterator);
      console.log(mediaURLArray);
    };
  };
  mediaURLGetter();
};

// This function will give you an array of objects with the media IDs
const mediaGetter = (igramBusinessAccountID) => {
  axios.get(`${URLRoot}${igramBusinessAccountID}${fields}media${URLAccessTokenInsert}`)
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
const instaIDGetter = (facebookID) => {
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

FBIDGetter();

// function completeURLArray() {
//   return new Promise((resolve, reject) => {
//     if(mediaURLArray.length ===)
//   });
// };

// async function asyncCall() {
//   let result = await completeURLArray();
//   console.log(result);
// }

// asyncCall();