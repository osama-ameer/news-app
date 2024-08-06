import React from "react";
import { Layout, theme } from "antd";
import AppHeader from "./AppHeader";
import "./index.css";
import { routes } from "../routes";
import { Route, Routes } from "react-router-dom";

const { Content, Footer } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout className="app-layout">
      <AppHeader />
      <Content className="app-content">
        <div
          style={{
            background: colorBgContainer,
            minHeight: "100%",
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.key}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          padding: "6px",
        }}
      >
        News App ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};
export default App;
