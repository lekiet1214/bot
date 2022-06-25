// keepAlive.js
const fetch = require('node-fetch')

// globals
const interval = 25 * 60 * 1000 // interval in milliseconds - {25mins x 60s x 1000}ms
const url = 'https://nhobot.herokuapp.com/'
let handler = null
function wake () {
  try {
    handler = setInterval(() => {
      fetch(url)
        .then(res => console.log(`response-ok: ${res.ok}, status: ${res.status}`))
        .catch(err => console.error(`Error occured: ${err}`))
    }, interval)
  } catch (err) {
    console.error('Error occured: retrying...')
    clearInterval(handler)
    return setTimeout(() => wake(), 10000)
  };
};

module.exports = {
  wake
}
