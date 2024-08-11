import { Col, Row, Select } from "antd";
import React from "react";
import useArticle from "../../context/ArticleContext";
import { sourcesOption } from "../../utils/constants";

const UserPrefrences = () => {
  const { categories, authors, userPrefrences, handlePrefrences } =
    useArticle();

  const authorsOptions = authors?.map((author) => {
    return {
      label: author.author_name,
      value: author.author_name,
    };
  });
  const uniqueAuthorsOptions = Array.from(
    new Map(authorsOptions?.map((item) => [item.value, item])).values()
  );

  const categoryOptions = Array.from(
    new Map(categories?.map((item) => [item.value, item])).values()
  );

  return (
    <Row gutter={[8, 16]}>
      <Col xs={24} sm={12} md={8} lg={9} className="heading-col">
        <h2>Select your prefrences</h2>
      </Col>
      <Col xs={24} sm={12} md={8} lg={5} className="align-center">
        <Select
          mode="multiple"
          allowClear
          style={{
            width: "100%",
          }}
          placeholder="Select sources"
          defaultValue={userPrefrences?.sources}
          onChange={(values) => handlePrefrences("sources", values)}
          options={sourcesOption}
          maxTagCount="responsive"
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={5} className="align-center">
        <Select
          mode="multiple"
          allowClear
          style={{
            width: "100%",
          }}
          placeholder="Select authors"
          onChange={(values) => handlePrefrences("authors", values)}
          options={uniqueAuthorsOptions}
          defaultValue={userPrefrences?.authors}
          maxTagCount="responsive"
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={5} className="align-center">
        <Select
          defaultValue={userPrefrences?.categories}
          mode="multiple"
          allowClear
          style={{
            width: "100%",
          }}
          placeholder="Select categories"
          onChange={(values) => handlePrefrences("categories", values)}
          options={categoryOptions}
          maxTagCount="responsive"
        />
      </Col>
    </Row>
  );
};

export default UserPrefrences;
