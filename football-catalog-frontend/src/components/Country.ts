export enum Country {
  Russia = 0,
  Usa = 1,
  Italy = 2
}

export const Countries = ['Россия', 'США', 'Италия'];

export const getCountryName = (c: Country) => {
  return Countries[c];
}
