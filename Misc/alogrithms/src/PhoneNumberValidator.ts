function telephoneCheck(str: string): boolean {
  // Good luck!
  const array: string[] = str.trim().match(/\d/g);

  if (array.length > 11 || (array.length === 11 && array[0] !== "1")) {
    return false;
  }
  if (array.length < 10) {
    return false;
  } else {
    if (str.match(/(?<!\()\d{3}(?=\))|(?<=\()\d{3}(?!\))/)) {
      return false;
    } else if (!str.match(/^[\d\(]/) || str.match(/\?/)) {
      return false;
    } else {
      return true;
    }
  }
}

telephoneCheck("555-555-5555");
