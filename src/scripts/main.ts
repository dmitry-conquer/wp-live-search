import "../styles/main.scss";
import { ApiService } from "./services/ApiService";
import Search from "./components/Search";

document.addEventListener("DOMContentLoaded", () => {
  const loadLiveSearch = async () => {
    //@ts-expect-error ajax_obj is defined in the footer
    const response = await ApiService.get(`${ajax_obj.ajax_url}?action=get_search_data`);
    if (response.success) {
      const data = response.data;
      new Search({
        siteName: data.siteName,
        postTypes: data.postTypes,
        showItems: data.showItems,
      });
    } else return;
  };

  loadLiveSearch();
});
