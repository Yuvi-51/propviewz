export function fetchIPAddress(token) {
  if (!token) {
    return fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => data.ip)
      .catch((error) => {
        console.log(error);
        throw error; // Rethrow the error to handle it outside
      });
  } else {
    return Promise.resolve(null); // Return a resolved promise with null if token exists
  }
}
