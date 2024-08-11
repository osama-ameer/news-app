import React from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import useArticle from "../../../context/ArticleContext";
import placeholder_image from "../../../assets/images/placeholder_image.jpg";
import dayjs from "dayjs";
import "./index.css";

const { Meta } = Card;

const ArticleCard = ({ article, index }) => {
  const navigate = useNavigate();
  const { loading } = useArticle();

  return (
    <Card
      onClick={(e) => window.open(article.url, "_blank")}
      className="article-card"
      hoverable
      loading={loading}
      cover={
        <img
          alt="article-img"
          src={article?.article_img ? article?.article_img : placeholder_image}
          className="article-img"
        />
      }
    >
      <Meta
        title={<div className="two-line-title">{article?.article_title}</div>}
        description={
          <>
            <p className="details m-0">{article?.author_name}</p>
            <p className="details">
              {dayjs(article?.publishedDate).format("DD, MMM, YYYY")}
            </p>

            <div className="three-line-description">
              {article?.article_description}
            </div>
          </>
        }
        className="meta-content"
      />
    </Card>
  );
};
export default ArticleCard;
