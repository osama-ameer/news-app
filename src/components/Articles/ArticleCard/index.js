import React from "react";
import { Card } from "antd";
import "./index.css";
const { Meta } = Card;
const ArticleCard = ({ article }) => (
  <Card
    className="fixed-size-card"
    hoverable
    cover={
      <img alt="example" src={article?.urlToImage} className="article-img" />
    }
  >
    <Meta
      title={<div className="two-line-title">{article?.title}</div>}
      description={
        <div className="three-line-description">{article?.description}</div>
      }
      className="meta-content"
    />
  </Card>
);
export default ArticleCard;
