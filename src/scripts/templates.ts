import { Post } from "./types";
import { highlight } from "./utils";

const templates = {
  resultItem: (item: Post, search: string) => {
    return `
         <div class="wp-search-item"><a target="_blank" href="${item.link}">${highlight(item.title.rendered, search ?? "")}</a></div>
    `;
  },
  message: (message: string) => {
    return `
      <div class="wp-search-message">${message}</div>
    `;
  },
};

export default templates;
