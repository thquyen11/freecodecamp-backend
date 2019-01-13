function palindrome(str:string):boolean{
  let arr: string[] = str.trim().toLowerCase().replace(/\W/g,"").replace(/_/g, "").split("");
  let isPalidrome:boolean = true;
  for(let i:number=0; i< arr.length/2; i++){
    if(arr[i]!=arr[arr.length-1-i]){
      isPalidrome = false;
      break;
    }
  }

  return isPalidrome;
}
  
  
palindrome("eye");
