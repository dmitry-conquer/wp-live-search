export type Post = {
  link: string;
  title: {
    rendered: string;
  };
};

export type initialStateType = {
  results: Post[];
};

export type SearchOptions = {
  siteName: string;
  postTypes: string[];
  showItems: number;
};