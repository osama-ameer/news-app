import React from "react";
import "./index.css";
import { Layout, Menu, Input, Select } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import useArticle from "../../context/ArticleContext";
import { API_SOURCES } from "../../utils/constants";

const { Header } = Layout;
const { Search } = Input;

const items = [{ key: "/", label: "Articles" }];

const AppHeader = () => {
  const { filters, handleChangeFilter } = useArticle();
  const navigate = useNavigate();
  const pathname = useLocation()?.pathname;

  return (
    <Header className="app-header">
      <div className="first-section">
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
        <Search
          className="search-bar"
          placeholder="Type category.."
          loading={false}
          enterButton
          defaultValue={filters?.category}
          onSearch={(text) => handleChangeFilter("category", text)}
          allowClear
        />

        <Select
          defaultValue={filters?.source}
          style={{ width: 120 }}
          allowClear
          onChange={(value) => handleChangeFilter("source", value)}
          options={[
            { value: API_SOURCES.NEWS_API, label: "News" },
            { value: API_SOURCES.GUARDIAN_API, label: "Guardian " },
            { value: API_SOURCES.NEW_YORK_TIME_API, label: "New York Times" },
          ]}
        />
      </div>

      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={items}
        selectedKeys={[pathname]}
        onClick={(e) => navigate(e?.key)}
      />
    </Header>
  );
};

export default AppHeader;
