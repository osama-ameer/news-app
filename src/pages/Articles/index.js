import React, { Fragment, useEffect, useState } from "react";
import { NEWS_API_API_KEY } from "../../utils/constants";
import { Row, Col, Spin } from "antd";
import axios from "axios";
import ArticleCard from "../../components/Articles/ArticleCard";
import "./index.css";
const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNews = async () => {
    setLoading(true);
    try {
      let NEWS_API = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${NEWS_API_API_KEY}`;

      let res = await axios.get(NEWS_API);
      let data = res?.data;
      setArticles(data?.articles);
    } catch (error) {
      console.log("Err", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  return (
    <Fragment>
      <h2>Articles</h2>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {articles?.map((article, index) => (
            <Col
              key={index}
              xs={24}
              sm={12}
              md={12}
              lg={8}
              xl={6}
              className="card_wrapper_col"
            >
              <ArticleCard article={article} />
            </Col>
          ))}
        </Row>
      </Spin>
    </Fragment>
  );
};

export default Articles;
