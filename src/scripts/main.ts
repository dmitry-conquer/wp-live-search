import "../styles/main.scss";
import { get } from "./services/api";
import Search from "./components/search";

// ajax_obj is an object containing the ajax_url used for API requests
declare const ajax_obj: {
  ajax_url: string;
};

document.addEventListener("DOMContentLoaded", () => {
  const initializeSearch = async () => {
    const response = await get(`${ajax_obj.ajax_url}?action=get_search_data`);
    if (response.success) {
      const data = response.data;
      new Search({
        siteName: data.siteName,
        postTypes: data.postTypes,
        showItems: data.showItems,
      });
    } else {
      console.error(response.error);
      return;
    }
  };

  initializeSearch();
});
