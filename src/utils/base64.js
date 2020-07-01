export function encode(data) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

//
// this returns a promise just for syntatic sugar 🤷
//
export function decode(data) {
  return new Promise((resolve, reject) => {
    try {
      resolve(JSON.parse(decodeURIComponent(escape(atob(data)))));
    } catch (e) {
      reject(e);
    }
  });
}
