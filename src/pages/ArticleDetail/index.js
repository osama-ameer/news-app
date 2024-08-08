import React from "react";
import { useLocation } from "react-router-dom";

const ArticleDetail = () => {
  const state = useLocation()?.state;

  console.log("state", state);
  return <div>ArticleDetail</div>;
};

export default ArticleDetail;
