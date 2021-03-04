import React from "react";
import classnames from "classnames";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "@gouch/to-title-case";

/**
 * Search currently selected category tab
 * @param {String} username: current user's username
 * @param {String} category: category of items to show
 * @param {Boolean} showButton: whether or not add item button should be displayed
 * @param {String} keyword: searchbar input
 * @param {Function} setKeyword: input changed event handler, updates search term for data filtering
 * @param {Function} addItem: handler for adding new items
 * @param {Function} pauseSubmission: passing a true value to it will pause hotkeys from triggering
 */
const SearchBar = React.forwardRef(
  (
    {
      userEmail,
      category,
      showButton,
      keyword,
      setKeyword,
      addItem,
      pauseSubmission,
    },
    ref
  ) => {
    let buttonClasses = classnames(
      "item_add_button",
      "position-absolute",
      "shadow-none",
      "border-0",
      showButton ? "w-5" : "w-0"
    );

    const fields = {
      Category: category,
      Completed: "false",
      Title: keyword.toLowerCase().toTitleCase(),
      Username: userEmail,
    };
    const handleClick = (event) => {
      addItem(fields, event);
    };

    // disable enter and space
    const handleKeyPress = (e) => {
      // disable enter and ctrl+e hotkeys
      if (e.target.tagName === "INPUT") {
        if (["Enter"].includes(e.key) || (e.ctrlKey && e.key === "e")) {
          e.preventDefault();
          e.stopPropagation();
          if (e.key === "Enter" && showButton) {
            pauseSubmission(false);
            addItem(fields, {});
          }
        }
      }
      if (e.target.tagName === "BUTTON") {
        if (["Enter", " "].includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    return (
      <Container className="p-2 mt-2 mb-2">
        <Row>
          <Col>
            <Form>
              <Form.Group controlId="searchForm">
                <div className="position-relative">
                  <Form.Control
                    tabIndex="-1"
                    ref={ref}
                    className="search_bar"
                    autoFocus
                    value={keyword}
                    onChange={setKeyword}
                    onKeyDown={handleKeyPress}
                    type="search"
                    placeholder="Search/Add"
                  />
                  <Button
                    onClick={handleClick}
                    className={buttonClasses}
                    variant="success"
                    onKeyDown={handleKeyPress}
                    onKeyUp={handleKeyPress}
                  >
                    +
                    {/* <div className="position-relative">
                      <div
                        className={
                          (showButton ? "" : "w-0") + "add_button_icon"
                        }
                      ></div>
                    </div> */}
                  </Button>
                </div>
                <Form.Text className="text-muted">
                  Search by title, or add something that doesn't already exist.
                </Form.Text>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
);

export default SearchBar;
