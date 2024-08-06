import React from "react";
import "./index.css";
import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const { Header } = Layout;

const items = [
  { key: "/", label: "Home" },
  { key: "/articles", label: "News" },
];

const AppHeader = () => {
  const navigate = useNavigate();
  const pathname = useLocation()?.pathname;

  return (
    <Header className="app-header">
      <div className="demo-logo">News App</div>
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
