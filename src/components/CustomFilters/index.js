import { DatePicker, Col, Input, Popover, Row, Select } from "antd";
import React from "react";
import { API_SOURCES } from "../../utils/constants";
import useArticle from "../../context/ArticleContext";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const CustomFilters = () => {
  const { filters, handleChangeFilter, userPrefrences } = useArticle();

  const categoriesOptions = userPrefrences?.categories?.map((item) => {
    return {
      label: item,
      value: item,
    };
  });

  const content = (
    <Row gutter={[0, 16]}>
      <Col span={24} className="align-center">
        <Select
          defaultValue={filters?.category}
          style={{ width: "100%" }}
          allowClear
          placeholder="Select categories"
          onChange={(value) => handleChangeFilter("category", value)}
          options={categoriesOptions}
        />
      </Col>
      <Col span={24} className="align-center">
        <Select
          defaultValue={filters?.source}
          style={{ width: "100%" }}
          allowClear
          placeholder="Select sources"
          onChange={(value) => handleChangeFilter("source", value)}
          options={[
            { value: API_SOURCES.NEWS_API, label: "News" },
            { value: API_SOURCES.GUARDIAN_API, label: "Guardian " },
            { value: API_SOURCES.NEW_YORK_TIME_API, label: "New York Times" },
          ]}
        />
      </Col>

      <Col span={24} className="align-center">
        <RangePicker
          style={{ width: "100%" }}
          defaultValue={
            filters?.from && filters?.to
              ? [dayjs(filters.from), dayjs(filters.to)]
              : undefined
          }
          onChange={(value) => handleChangeFilter("dateRange", value)}
        />
      </Col>
    </Row>
  );
  return (
    <Popover
      placement="bottom"
      title="Apply Filters"
      content={content}
      trigger="click"
      style={{}}
    >
      <span style={{ cursor: "pointer", fontSize: 16, fontWeight: "bold" }}>
        Filters
      </span>
    </Popover>
  );
};

export default CustomFilters;
