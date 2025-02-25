import { get } from "../services/api";
import { Post, initialStateType, SearchOptions } from "../types";
import templates from "../templates";

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
  private readonly messages: Record<string, string> = {
    startSearching: "Please enter a search term.",
    noResults: "No results found.",
    searching: "Searching...",
  };
  private options: SearchOptions = {
    siteName: window.location.host,
    postTypes: [],
    showItems: 6,
  };
  private rootElement: HTMLElement | null;
  private wrapperElement: HTMLElement | null;
  private buttonElement: HTMLButtonElement | null;
  private inputElement: HTMLInputElement | null;
  private containerElement: HTMLElement | null;
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

    this.bindEvents();
  }

  bindEvents() {
    this.inputElement?.addEventListener("input", this.onInput);
    this.buttonElement?.addEventListener("click", this.onButtonClick);
  }

  onButtonClick = () => {
    this.wrapperElement?.classList.toggle(this.stateClasses.isActive);
    this.buttonElement?.setAttribute(
      this.attributes.ariaExpanded,
      this.wrapperElement?.classList.contains(this.stateClasses.isActive) ? "true" : "false"
    );
    this.inputElement?.focus();
  };

  onInput = () => {
    if (this.inputElement?.value === "") {
      this.state.results = [];
      this.showMessage(this.messages.startSearching);
      return;
    }
    this.getData();
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
    const filteredIResults = this.state.results
      .filter((filteredItem: Post) =>
        filteredItem.title.rendered.toLowerCase().includes((this.inputElement?.value ?? "").toLowerCase())
      )
      .slice(0, this.options.showItems);

    return filteredIResults;
  }

  updateUI() {
    const results = this.filterResults();
    if (results.length > 0) {
      const template = results.map((item: Post) => templates.resultItem(item, this.inputElement?.value ?? "")).join("");
      if (this.containerElement) {
        this.containerElement.innerHTML = template;
      }
    } else {
      this.showMessage(this.messages.noResults);
    }
  }

  async getData(): Promise<void> {
    this.showMessage(this.messages.searching);
    const promises = this.options.postTypes.map((postType: string) => this.getPostTypeData(postType));
    const results = await Promise.all(promises);
    this.state.results = results.flat();
  }

  async getPostTypeData(postType: string): Promise<Post[]> {
    const response = await get(
      `https://${this.options.siteName}/wp-json/wp/v2/${postType}/?search=${this.inputElement?.value}`
    );
    if (response.success) {
      return response.data;
    } else {
      return [];
    }
  }
}

export default Search;
