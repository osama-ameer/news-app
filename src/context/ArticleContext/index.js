import React, { useState, createContext, useContext, useEffect } from "react";
import {
  API_SOURCES,
  GUARDIAN_API_KEY,
  NEWS_API_API_KEY,
  NY_TIMES_API_KEY,
} from "../../utils/constants";
import axios from "axios";
import { getCookie, setCookie } from "../../utils/storage";
import { categories } from "../../utils/categories";

export const defaultFilters = {
  source: null,
  query: "tesla",
  category: null,
  to: null,
  from: null,
};

export const defaultPrefrences = {
  sources: [
    API_SOURCES.NEWS_API,
    API_SOURCES.GUARDIAN_API,
    API_SOURCES.NEW_YORK_TIME_API,
  ],
  categories: ["buisness"],
  authors: [],
};

const initialState = {
  filters: getCookie("filters")
    ? JSON.parse(getCookie("filters"))
    : defaultFilters,
  prefrences: getCookie("userPrefrences")
    ? JSON.parse(getCookie("userPrefrences"))
    : defaultPrefrences,
  categories: categories?.map((cat) => {
    return { label: cat, value: cat };
  }),
  authors: [],
  loading: false,
  articles: [],
};

const ArticleContext = createContext(initialState);

export const ArticleProvider = ({ children }) => {
  const [filters, setFilters] = useState(initialState.filters);
  const [userPrefrences, setUserPrefrences] = useState(initialState.prefrences);

  const [categories, setCategories] = useState(initialState?.categories);
  const [authors, setAuthors] = useState(initialState?.authors);
  const [loading, setLoading] = useState(initialState?.loading);
  const [articles, setArticles] = useState(initialState?.articles);

  const updateFiltersInCookie = async (updatedFilters) => {
    setCookie("filters", updatedFilters);
  };

  const updatePrefrencesInCookie = async (userPrefrences) => {
    setCookie("userPrefrences", userPrefrences);
  };

  const updateArticles = async (filters) => {
    let filteredArticles = [...articles];

    if (filters?.source) {
      filteredArticles = filteredArticles.filter(
        (article) => article.news_source === filters.source
      );
    }
    if (filters?.category) {
      filteredArticles = filteredArticles.filter(
        (article) => article.category === filters.category
      );
    }

    setArticles(filteredArticles);
  };

  const handleChangeFilter = async (type, value) => {
    setFilters((prevFilters) => {
      let updatedFilters;
      if (type === "dateRange") {
        updatedFilters = {
          ...prevFilters,
          from: value?.length === 2 ? value[0]?.format("YYYY-MM-DD") : null,
          to: value?.length === 2 ? value[1]?.format("YYYY-MM-DD") : null,
        };
      } else {
        updatedFilters = {
          ...prevFilters,
          [type]: value,
        };
      }
      updateFiltersInCookie(updatedFilters);
      updateArticles(updatedFilters);
      return updatedFilters;
    });
  };

  const handlePrefrences = async (type, value) => {
    setUserPrefrences((prevPref) => {
      let updatedPref = {
        ...prevPref,
        [type]: value,
      };
      updatePrefrencesInCookie(updatedPref);
      return updatedPref;
    });
  };

  const fetchArticlesFromNewsAPI = async (filters, userPreferences) => {
    let url;

    const newsParams = new URLSearchParams();
    if (filters.query) newsParams.append("q", filters.query);
    if (filters.category) newsParams.append("category", filters.category);
    // if (filters.from) newsParams.append("from", filters.from);
    // if (filters.to) newsParams.append("to", filters.to);
    newsParams.append("apiKey", NEWS_API_API_KEY);
    url = `https://newsapi.org/v2/top-headlines?${newsParams.toString()}`;

    const response = await axios.get(url);

    let articles = response.data.articles
      ?.filter((item) => item?.source?.id)
      ?.map((article) => {
        return {
          ...article,
          article_img: article?.urlToImage,
          article_title: article?.title,
          article_description: article?.description,
          news_source: API_SOURCES.NEWS_API,
          publishedDate: article?.publishedAt,
          author_name: article?.author,
          url: article?.url,
        };
      })
      ?.filter((item) =>
        userPreferences?.authors?.length > 0
          ? userPreferences?.authors?.includes(item?.author_name)
          : item
      );

    const authors = response.data.articles
      ?.map((article) => {
        return {
          author_name: article?.author,
        };
      })
      ?.filter((author) => author?.author_name);

    if (filters?.from) {
      articles = articles?.filter(
        (article) => new Date(article.date) >= new Date(filters.from)
      );
    }

    if (filters?.to) {
      articles = articles?.filter(
        (article) => new Date(article.date) <= new Date(filters.to)
      );
    }
    return { articles, authors };
  };

  const fetchArticlesFromGuardianAPI = async (filters, userPreferences) => {
    let url;
    const guardianParams = new URLSearchParams();
    if (filters.query) guardianParams.append("q", filters.query);
    if (filters.category) guardianParams.append("section", filters?.category);
    if (filters.from) guardianParams.append("from-date", filters?.from);
    if (filters.to) guardianParams.append("to-date", filters?.to);

    guardianParams.append("show-fields", "all");
    guardianParams.append("show-elements", "image");
    guardianParams.append("show-references", "author");
    guardianParams.append("api-key", GUARDIAN_API_KEY);

    url = `https://content.guardianapis.com/search?${guardianParams.toString()}`;
    // url = `https://content.guardianapis.com/tags=?${guardianParams.toString()}`;

    const response = await axios.get(url);
    const articles = response?.data?.response?.results
      ?.map((article) => {
        return {
          ...article,
          article_img: article?.fields?.thumbnail,
          article_title: article?.fields?.headline,
          article_description: article?.fields?.trailText,
          news_source: API_SOURCES.GUARDIAN_API,
          publishedDate: article?.webPublicationDate,
          url: article?.webUrl,
          author_name: article?.fields?.byline,
        };
      })
      .filter((item) =>
        userPreferences?.authors?.length > 0
          ? userPreferences?.authors?.includes(item?.author_name)
          : item
      );

    const authors = response?.data?.response?.results
      ?.map((article) => {
        return {
          author_name: article?.fields?.byline,
        };
      })
      ?.filter((author) => author?.author_name);
    return { articles, authors };
  };

  const fetchArticlesFromNYTimesAPI = async (filters, userPreferences) => {
    let url;
    const nyTimesParams = new URLSearchParams();
    if (filters.query) nyTimesParams.append("q", filters.query);
    if (filters.category)
      nyTimesParams.append(
        "fq",
        `section_name.contains:("${filters.category}")`
      );
    if (filters.from) nyTimesParams.append("begin_date", filters.from);
    if (filters.to) nyTimesParams.append("end_date", filters.to);
    nyTimesParams.append("api-key", NY_TIMES_API_KEY);

    url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?${nyTimesParams.toString()}`;

    const response = await axios.get(url);

    const articles = response?.data?.response?.docs
      ?.map((article) => {
        return {
          ...article,
          article_img: article?.multimedia
            ? `https://nytimes.com/${article?.multimedia[0]?.url}`
            : "",
          article_title: article?.headline?.main,
          article_description: article?.lead_paragraph,
          author_name: article?.byline?.original,
          news_source: API_SOURCES.NEW_YORK_TIME_API,
          publishedDate: article?.pub_date,
          url: article?.web_url,
        };
      })
      ?.filter((item) =>
        userPreferences?.authors?.length > 0
          ? userPreferences?.authors?.includes(item?.author_name)
          : item
      );
    const authors = response?.data?.response?.docs
      ?.map((article) => {
        return {
          author_name: article?.byline?.original,
        };
      })
      ?.filter((author) => author?.author_name);
    return { articles, authors };
  };

  const fetchArticles = async (filters, userPreferences) => {
    setLoading(true);
    const promises = [];

    if (filters?.source) {
      switch (filters?.source) {
        case API_SOURCES.NEWS_API:
          promises.push(fetchArticlesFromNewsAPI(filters, userPreferences));
          break;
        case API_SOURCES.GUARDIAN_API:
          promises.push(fetchArticlesFromGuardianAPI(filters, userPreferences));
          break;
        case API_SOURCES.NEW_YORK_TIME_API:
          promises.push(fetchArticlesFromNYTimesAPI(filters, userPreferences));
          break;

        default:
          break;
      }
    } else {
      if (userPreferences?.sources?.includes(API_SOURCES.NEWS_API)) {
        promises.push(fetchArticlesFromNewsAPI(filters, userPreferences));
      }
      if (userPreferences?.sources?.includes(API_SOURCES.GUARDIAN_API)) {
        promises.push(fetchArticlesFromGuardianAPI(filters, userPreferences));
      }
      if (userPreferences?.sources?.includes(API_SOURCES.NEW_YORK_TIME_API)) {
        promises.push(fetchArticlesFromNYTimesAPI(filters, userPreferences));
      }
    }

    const results = await Promise.allSettled(promises);

    let allArticles = [];
    let allAuthors = [];

    results?.forEach((result) => {
      if (result.status === "fulfilled") {
        const { articles, authors } = result.value;

        allArticles = [...allArticles, ...articles];
        allAuthors = [...allAuthors, ...authors];
      }
    });

    setArticles(allArticles);
    setAuthors(allAuthors);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles(filters, userPrefrences);
  }, [filters, userPrefrences]);

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
        loading,
        articles,
        handleChangeFilter,
        userPrefrences,
        handlePrefrences,
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
