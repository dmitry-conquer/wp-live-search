import { get } from "../services/api";
import { Post, initialStateType, SearchOptions } from "../types";
import templates from "../templates";
import { SEARCH_MESSAGES } from "../messages";

class Search {
  private readonly selectors: Record<string, string> = {
    root: "[data-livesearch]",
    button: "[data-livesearch-button]",
    input: "[data-livesearch-input]",
    container: "[data-livesearch-container]",
    wrapper: "[data-livesearch-wrapper]",
  };
  private readonly attributes: Record<string, string> = {
    ariaExpanded: "aria-expanded",
  };
  private readonly stateClasses: Record<string, string> = {
    isActive: "is-active",
  };
  private options: SearchOptions = {
    siteName: window.location.host,
    postTypes: [],
    showItems: 6,
    excludeKeyWords: "",
  };
  private rootElement: HTMLElement | null;
  private wrapperElement: HTMLElement | null;
  private buttonElement: HTMLButtonElement | null;
  private inputElement: HTMLInputElement | null;
  private containerElement: HTMLElement | null;
  private timeout: number | null = null;
  private searchDelay: number = 500;
  private state: initialStateType;

  constructor(options?: SearchOptions) {
    this.rootElement = document.querySelector(this.selectors.root);
    this.buttonElement = this.rootElement?.querySelector(this.selectors.button) || null;
    this.inputElement = this.rootElement?.querySelector(this.selectors.input) || null;
    this.containerElement = this.rootElement?.querySelector(this.selectors.container) || null;
    this.wrapperElement = this.rootElement?.querySelector(this.selectors.wrapper) || null;
    this.options = { ...this.options, ...options };
    this.state = this.getResultsProxy({
      results: [],
    });

    if (!this.isReady) return;
    this.bindEvents();
  }

  private bindEvents() {
    this.inputElement?.addEventListener("input", this.onInput);
    this.buttonElement?.addEventListener("click", this.toggleSearch);
    document.documentElement.addEventListener("click", this.onClickOutside);
  }

  private isNotSearchRelated(event: MouseEvent) {
    return !this.wrapperElement?.contains(event.target as Node) && !this.buttonElement?.contains(event.target as Node);
  }

  private onClickOutside = (e: MouseEvent) => {
    if (this.isNotSearchRelated(e)) {
      this.wrapperElement?.classList.remove(this.stateClasses.isActive);
      this.buttonElement?.setAttribute(this.attributes.ariaExpanded, "false");
    }
  };

  private isReady(): boolean {
    return Boolean(
      this.rootElement && this.inputElement && this.buttonElement && this.containerElement && this.wrapperElement
    );
  }

  private toggleSearch = () => {
    if (!this.wrapperElement) return;
    const isOpen = this.wrapperElement?.classList.contains(this.stateClasses.isActive);
    this.wrapperElement?.classList.toggle(this.stateClasses.isActive, !isOpen);
    this.buttonElement?.setAttribute(this.attributes.ariaExpanded, (!isOpen).toString());
    this.inputElement?.focus();
  };

  onInput = () => {
    if (this.inputElement?.value === "") {
      this.state.results = [];
      this.showMessage(SEARCH_MESSAGES.startSearching);
      return;
    }

    this.showMessage(SEARCH_MESSAGES.searching);
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = window.setTimeout(() => {
      this.getData();
    }, this.searchDelay);
  };

  getResultsProxy(initialState: initialStateType) {
    return new Proxy(initialState, {
      get: (target: initialStateType, prop: keyof initialStateType) => {
        return target[prop];
      },
      set: (target: initialStateType, prop: keyof initialStateType, value: Post[]) => {
        target[prop] = value;
        this.updateUI();
        return true;
      },
    });
  }

  showMessage(message: string) {
    if (this.containerElement) {
      this.containerElement.innerHTML = templates.message(message);
    }
  }

  filterResults(): Post[] {
    let results = this.state.results;
    results = this.filterByTitle(results);
    results = this.filterByExcludeWords(results);

    return results.slice(0, this.options.showItems);
  }

  stringToArray(string: string): string[] {
    return string.split(",").map(value => value.trim());
  }

  filterByTitle(results: Post[]) {
    return results.filter((filteredItem: Post) =>
      filteredItem.title.rendered.toLowerCase().includes((this.inputElement?.value ?? "").toLowerCase())
    );
  }

  filterByExcludeWords(value: Post[]) {
    const rawExclude = this.options.excludeKeyWords?.trim();
    if (rawExclude) {
      return value.filter(
        (filteredItem: Post) =>
          !this.stringToArray(rawExclude).some((word: string) =>
            filteredItem.title.rendered.toLowerCase().includes(word.toLowerCase())
          )
      );
    } else return value;
  }

  updateUI() {
    const results = this.filterResults();
    if (results.length > 0) {
      const template = results.map((item: Post) => templates.resultItem(item, this.inputElement?.value ?? "")).join("");
      if (this.containerElement) {
        this.containerElement.innerHTML = template;
      }
    } else {
      this.showMessage(SEARCH_MESSAGES.noResults);
    }
  }

  async getData(): Promise<void> {
    const promises = this.options.postTypes.map((postType: string) => this.getPostTypeData(postType));
    const results = await Promise.all(promises);
    this.state.results = results.flat();
  }

  async getPostTypeData(postType: string): Promise<Post[]> {
    const url = new URL(`/wp-json/wp/v2/${postType}/`, `https://${this.options.siteName}`);
    if (this.inputElement?.value) {
      url.searchParams.set("search", this.inputElement.value);
    }
    const response = await get(url.toString());
    return response.success ? response.data : [];
  }
}

export default Search;
