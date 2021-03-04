import React from "react";
import classnames from "classnames";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "@gouch/to-title-case";

import LogoutButton from "./LogoutButton";

/**
 * Holds user's name, login button, and tabs
 * @param {String} userName: user's name, returned by auth0
 * @param {String} activeCategory: whether or not current tab is selected
 * @param {Function} setCategory: handler for changing categories when switching tabs
 */
const Header = ({ activeCategory, setCategory }) => {
  // disable enter and space
  const handleKeyPress = (e) => {
    if (["Enter", " "].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  return (
    <Container className="p-2 pt-4 Header text-center">
      <Row className="no-gutters">
        <Tabs activeCategory={activeCategory} setCategory={setCategory} />
        <Col className="text-right">
          <LogoutButton />
        </Col>
      </Row>
    </Container>
  );
};

/**
 * Container for category Tabs
 * @param {String} activeCategory: whether or not current tab is selected
 * @param {Function} setCategory: handler for changing categories when switching tabs
 */
const Tabs = ({ activeCategory, setCategory }) => {
  const tabs = ["Movies", "Shows", "Books"];
  return tabs.map((tab) => (
    <Tab
      key={tab}
      category={tab}
      setCategory={setCategory}
      active={activeCategory === tab}
    />
  ));
};

/**
 * A category Tab
 * @param {String} category: list category
 * @param {String} active: whether or not current tab is selected
 * @param {Function} setCategory: handler for changing categories when switching tabs
 */
const Tab = ({ category, active, setCategory }) => {
  let classes = classnames("cursor-normal", "Tab", category, {
    active: active,
    inactive: !active,
  });
  return (
    <Col className={classes} onClick={setCategory}>
      <span>{category}</span>
    </Col>
  );
};

export default Header;
