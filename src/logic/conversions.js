export const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const createPropertyHref = (city_id, location_slug, city_slug) => {
  return `/${
    city_id === 2209 ? "pune" : "mumbai"
  }/${location_slug}/${city_slug}`;
};

export const cityIdToName = (city_id) => {
  return city_id == 2126 ? "mumbai" : "pune";
};

export const cityNameToId = (city) => {
  return city == "mumbai" ? 2126 : 2209;
};
