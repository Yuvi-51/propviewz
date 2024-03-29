export const formatTransactionAmount = (value) => {
  if (!value || value === undefined) {
    return "";
  }
  let formattedValue;
  let unit;

  if (value >= 10000000) {
    formattedValue = Math.floor(value / 10000000);
    unit = "Cr.";
  } else {
    formattedValue = Math.floor(value / 100000);
    unit = "L";
  }
  const formattedValueString = formattedValue.toString();
  if (formattedValueString?.length === 1) {
    let maskedValue = `${formattedValueString[0]}.XX`;
    return `${maskedValue} ${unit}`;
  } else {
    let maskedValue = `${formattedValueString[0]}X.XX`;

    return `${maskedValue} ${unit}`;
  }
};

export const formatOfferTransactionAmount = (value) => {
  if (!value || value === undefined) {
    return "";
  }
  let formattedValue;
  let unit;

  if (value >= 10000000) {
    formattedValue = Math.floor(value / 10000000);
    unit = "Cr.";
  } else {
    formattedValue = Math.floor(value / 100000);
    unit = "L";
  }
  const formattedValueString = formattedValue.toString();
  return `${formattedValueString} ${unit}`;
};

export const formatIndianRupees = (amount) => {
  let rupees = String(amount);
  let rupeesParts = [];

  // Separating the last three digits
  if (rupees.length > 3) {
    rupeesParts.unshift(rupees.slice(-3));
    rupees = rupees.slice(0, -3);
  }

  // Splitting the remaining amount into groups of two digits
  while (rupees.length > 0) {
    rupeesParts.unshift(rupees.slice(Math.max(rupees.length - 2, 0)));
    rupees = rupees.slice(0, Math.max(rupees.length - 2, 0));
  }

  // Joining the parts with commas
  const formattedRupees = rupeesParts.join(",");

  return formattedRupees;
};

export const formatTotalImpressions = (number) => {
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + "B";
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number.toString();
  }
};
