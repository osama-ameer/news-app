import ArticleDetail from "../pages/ArticleDetail";
import Articles from "../pages/Articles";
import Home from "../pages/Home";

export const routes = [
  {
    path: "/",
    key: "",
    element: <Home />,
  },
  {
    path: "/articles",
    key: "articles",
    element: <Articles />,
  },
  {
    path: "/article/:id",
    key: "article",
    element: <ArticleDetail />,
  },
];
