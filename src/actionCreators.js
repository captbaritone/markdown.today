import { getAsDataURI } from "./utils";
import { getMarkdown } from "./acessors";

export const downloadMarkdown = () => {
  return (dispatch, getState) => {
    const md = getMarkdown(getState());
    // TODO: Force download
    console.log(getAsDataURI(md));
  };
};
