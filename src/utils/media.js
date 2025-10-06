
export const imgFor = (type, uid) => {
  const t = type === "people" ? "characters" : type;
  return `https://starwars-visualguide.com/assets/img/${t}/${uid}.jpg`;
};
