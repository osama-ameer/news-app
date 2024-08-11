import React from "react";
import "./index.css";
import { Input, Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import useArticle from "../../context/ArticleContext";

const { Header } = Layout;
const { Search } = Input;

const items = [{ key: "/", label: "Articles" }];

const AppHeader = () => {
  const { filters, handleChangeFilter, articles, loading } = useArticle();

  const navigate = useNavigate();
  const pathname = useLocation()?.pathname;

  return (
    <Header className="app-header">
      <div className="align-center">
        <p className="demo-logo">News App</p>
        <Search
          className="search-bar"
          placeholder="Search articles.."
          loading={false}
          enterButton
          defaultValue={filters?.query}
          onSearch={(text) => handleChangeFilter("query", text)}
          allowClear
        />
      </div>
      <div className="menu-items">
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items}
          selectedKeys={[pathname]}
          onClick={(e) => navigate(e?.key)}
        />
      </div>
    </Header>
  );
};

export default AppHeader;
