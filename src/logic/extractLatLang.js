export const extractLatLngFromGoogleMapsLink = (link) => {
  if (link) {
    // Extract the latitude and longitude from the link
    // console.log("link", link);
    const regex = /!3d(-?\d+\.\d+)!2d(-?\d+\.\d+)/;
    const match = link.match(regex);

    // Check if the latitude and longitude were found
    if (match && match.length === 3) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      return { lat, lng };
    } else {
      return { lat: 18.5204, lng: 73.8567 };
    }
  } else {
    return { lat: 18.5204, lng: 73.8567 };
  }
};
