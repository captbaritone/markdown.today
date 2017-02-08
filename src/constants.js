// TODO: Find an approach where dev values get removed by Uglify's dead code detection.
const devProd = (dev, prod) =>
  process.env.NODE_ENV === "development" ? dev : prod;
export const AUTH_REDIRECT_URL = devProd(
  "http://localhost:3000/auth/",
  "https://md.jordaneldredge.com/auth/"
);

export const DROPBOX_CLIENT_ID = devProd("pzasrphp12vfnt6", "pc9cssrvvmgo4bp");

export const TITLE_DATE_FORMAT = "dddd, MMMM Do, YYYY";
