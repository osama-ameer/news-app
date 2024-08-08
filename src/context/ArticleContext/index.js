import React, { useState, createContext, useContext, useEffect } from "react";
import {
  API_SOURCES,
  GUARDIAN_API_KEY,
  NEWS_API_API_KEY,
  NY_TIMES_API_KEY,
} from "../../utils/constants";
import axios from "axios";
import { getCookie, setCookie } from "../../utils/storage";

export const defaultFilters = {
  source: API_SOURCES.NEWS_API,
  query: "",
  category: "",
};

const initialState = {
  filters: getCookie("filters")
    ? JSON.parse(getCookie("filters"))
    : defaultFilters,
  categories: [],
  authors: [],
  sources: [],
  loading: false,
  articles: [],
};

const ArticleContext = createContext(initialState);

export const ArticleProvider = ({ children }) => {
  const [filters, setFilters] = useState(initialState.filters);
  const [categories, setCategories] = useState(initialState?.categories);
  const [authors, setAuthors] = useState(initialState?.authors);
  const [sources, setSources] = useState(initialState?.filters);
  const [loading, setLoading] = useState(initialState?.loading);
  const [articles, setArticles] = useState(initialState?.articles);

  const updateFiltersInCookie = async (updatedFilters) => {
    setCookie("filters", updatedFilters);
  };

  const handleChangeFilter = async (type, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        [type]: value,
      };

      updateFiltersInCookie(updatedFilters);

      return updatedFilters;
    });
  };

  const handlePrefrences = async (type, value) => {
    setFilters();
  };

  const fetchArticles = async (filters) => {
    let URL = "";

    if (filters.query) {
      switch (filters?.source) {
        case API_SOURCES.NEWS_API:
          const newsParams = new URLSearchParams();
          if (filters.query) newsParams.append("q", filters.query);
          if (filters.category) newsParams.append("category", filters.category);
          newsParams.append("apiKey", NEWS_API_API_KEY);
          URL = `https://newsapi.org/v2/top-headlines?${newsParams.toString()}`;
          break;

        case API_SOURCES.GUARDIAN_API:
          const guardianParams = new URLSearchParams();
          if (filters.query) guardianParams.append("q", filters.query);
          if (filters.category) guardianParams.append("tag", filters.category);
          guardianParams.append("api-key", GUARDIAN_API_KEY);
          URL = `https://content.guardianapis.com/search?${guardianParams.toString()}`;
          break;

        case API_SOURCES.NEW_YORK_TIME_API:
          const nyTimesParams = new URLSearchParams();
          if (filters.query) nyTimesParams.append("q", filters.query);
          nyTimesParams.append("api-key", NY_TIMES_API_KEY);
          URL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?${nyTimesParams.toString()}`;
          break;

        default:
          break;
      }

      try {
        setLoading(true);
        const response = await axios.get(URL);
        if (filters.source === API_SOURCES.NEWS_API) {
          const articles = response.data.articles
            ?.filter((item) => item?.source?.id)
            ?.map((article) => {
              return {
                ...article,
                article_img: article?.urlToImage,
                article_title: article?.title,
                article_description: article?.description,
              };
            });
          setArticles(articles);
        } else if (filters.source === API_SOURCES.GUARDIAN_API) {
          const articles = response?.data?.response?.results?.map((article) => {
            return {
              ...article,
              article_img: article?.urlToImage,
              article_title: article?.webTitle,
              article_description: article?.description,
            };
          });
          setArticles(articles);
        } else if (filters.source === API_SOURCES.NEW_YORK_TIME_API) {
          // const articles = response.data.articles
          //   ?.filter((item) => item?.source?.id)
          //   ?.map((article) => {
          //     return {
          //       ...article,
          //       article_img: article?.urlToImage,
          //       article_title: article?.title,
          //       article_description: article?.description,
          //     };
          //   });
          setArticles(response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchArticles(filters);
  }, [filters]);

  return (
    <ArticleContext.Provider
      value={{
        filters,
        setFilters,
        fetchArticles,
        categories,
        setCategories,
        authors,
        setAuthors,
        sources,
        setSources,
        loading,
        articles,
        handleChangeFilter,
      }}
    >
      <>{children}</>
    </ArticleContext.Provider>
  );
};

const useArticle = () => {
  const context = useContext(ArticleContext);

  if (context === undefined) {
    throw new Error("useArticle must be used within a ArticleProvider");
  }
  return context;
};

export default useArticle;
