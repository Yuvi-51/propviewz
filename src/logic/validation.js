const apiHost = process.env.NEXT_PUBLIC_API_HOST;

export const validateImageUrl = (url) => {
  // return url;
  if (url?.includes(apiHost)) {
    return url;
  } else {
    return `${apiHost}${url}`;
  }
};

export const isPhoneNumberValid = (phoneNumber) =>
  /^[6-9][0-9]{9}$/.test(phoneNumber);

export const isNameValid = (name) => /^[a-zA-Z ]+$/.test(name);

export const isOtpValid = (otp) => /^[0-9]{6}$/.test(otp);

export const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const shortenResponseText = (response) => {
  const words = response?.split(" ");

  if (words?.length <= 10) {
    return response;
  } else {
    const shortenedWords = words?.slice(0, 10);
    const shortenedResponse = shortenedWords?.join(" ");
    return `${shortenedResponse}...`;
  }
};

export const isStringifiedValue = (value) => {
  let parsedValue = false;
  try {
    JSON.parse(value);
    parsedValue = true;
  } catch (error) {}
  return parsedValue;
};
