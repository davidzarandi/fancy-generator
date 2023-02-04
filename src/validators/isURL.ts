const isValidURL = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch (err) {
    return false;
  }
}

export default isValidURL;
