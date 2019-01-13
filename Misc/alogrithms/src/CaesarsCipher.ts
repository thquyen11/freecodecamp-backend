function rot13(str: string) {
  // LBH QVQ VG!
  const SHIFTER:number = 13;
  let array: string[] = str.trim().split("");
  const ALPHABET:number = 26;
  for (let i: number = 0; i < array.length; i++) {
    if(array[i].charCodeAt(0)<65 || array[i].charCodeAt(0)> 122 || (array[i].charCodeAt(0)>90 && array[i].charCodeAt(0)<97)){
      continue;
    }
    if(array[i].charCodeAt(0)>=65 && array[i].charCodeAt(0)<=90){
      array[i] = String.fromCharCode(65+((array[i].charCodeAt(0)+SHIFTER - 65)%ALPHABET));
    } else if(array[i].charCodeAt(0)>=97 && array[i].charCodeAt(0)<=122){
      array[i] = String.fromCharCode(97+((array[i].charCodeAt(0)+SHIFTER - 97)%ALPHABET));
    }
  }
  return array.join("");
}

// Change the inputs below to test
rot13("SERR PBQR PNZC");
