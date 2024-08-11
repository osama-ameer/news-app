import React, { Fragment } from "react";
import { Row, Col, Spin } from "antd";
import ArticleCard from "../../components/Articles/ArticleCard";
import "./index.css";
import useArticle from "../../context/ArticleContext";
import EmptyComponent from "../../components/UI/EmptyComponent";
import UserPrefrences from "../../components/UserPrefrences";
import CustomFilters from "../../components/CustomFilters";

const Articles = () => {
  const { filters, articles, loading } = useArticle();

  return (
    <Fragment>
      <div className="sticky">
        <UserPrefrences />

        <div className="justify-between">
          <h2>
            Articles for {filters?.query !== "" && `'${filters?.query}'...`}
          </h2>
          <CustomFilters />
        </div>
      </div>
      <Spin spinning={loading} className="spinner">
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
              <ArticleCard article={article} index={index} />
            </Col>
          ))}
        </Row>
        {articles?.length === 0 && <EmptyComponent />}
      </Spin>
    </Fragment>
  );
};

export default Articles;
