import React, { useEffect, useState, useRef } from "react";
import classnames from "classnames";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// UTILS
import { utils } from "../utils/utils";

/**
 * List of items
 * @param {Array} items: list of items to show
 * @param {Boolean} isFetchingItems: whether or not items are being fetched currently
 * @param {String} activeCategory: category of items to show
 * @param {String} loadingMessage: what to show while loading list
 * @param {Function} toggleComplete: handler for toggling completed items
 * @param {Function} removeItem: remove the current item card when clicked
 * @param {Number} currentItemIndex: index of the item that's currently focused
 */
const ItemList = React.forwardRef(
  (
    {
      items,
      isFetchingItems,
      activeCategory,
      loadingMessage,
      toggleComplete,
      removeItem,
      currentItemIndex,
    },
    ref
  ) => {
    // Used so cards that shouldn't be focused wont have the focus ref
    let fakeRef = useRef(null);
    let currentItem = -1;
    let [sortedItems, setItems] = useState([]);

    useEffect(() => {
      let currentCard = ref.current;
      if (currentCard) {
        currentCard.focus();
      }
    });

    // filter and sort items when changing tabs or when items is modified
    useEffect(() => {
      let newItems = items.filter((item) => {
        return item.fields.Category === activeCategory;
      });
      newItems.sort(
        (a, b) =>
          utils.stringToBool(a.fields.Completed) -
          utils.stringToBool(b.fields.Completed)
      );
      setItems(newItems);
    }, [activeCategory, items]);

    return (
      <Container className="p-2 mt-1">
        {isFetchingItems ? (
          <Row>
            <Col className="text-white">{loadingMessage}</Col>
          </Row>
        ) : (
          sortedItems.map((item) => {
            currentItem += 1;
            return (
              <Row key={item.id}>
                <Col>
                  <ItemCard
                    ref={currentItem === currentItemIndex ? ref : fakeRef}
                    title={item.fields.Title}
                    isComplete={item.fields.Completed === "true"}
                    toggleComplete={toggleComplete}
                    category={activeCategory}
                    id={item.id}
                    removeItem={removeItem}
                    shouldFocus={currentItem === currentItemIndex}
                  />
                </Col>
              </Row>
            );
          })
        )}
      </Container>
    );
  }
);

/**
 * Item card
 * @param {String} title: item's title
 * @param {Boolean} isComplete: whether or not this item has been completed, Yes/No
 * @param {Function} toggleComplete: handler for toggling completed items
 * @param {String} category: category of the current item, used for background color
 * @param {Function} removeItem: remove the current item card when clicked
 */
const ItemCard = React.forwardRef(
  ({ id, title, isComplete, toggleComplete, category, removeItem }, ref) => {
    const cardClasses = classnames(
      "cursor-normal",
      "mt-1",
      "border-0",
      "ItemCard",
      category,
      {
        incomplete: !isComplete,
        complete: isComplete,
      }
    );
    const bodyClasses = classnames("position-relative", "p-2");
    const buttonClasses = classnames(
      "item_delete_button",
      "position-absolute",
      "shadow-none",
      category
    );

    const body_handleClick = (event) => {
      toggleComplete(id, event);
    };

    const button_handleClick = (event) => {
      removeItem(id, event);
    };

    // disable enter and space
    const handleKeyPress = (e) => {
      if (["Enter", " "].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    return (
      <Card
        onClick={body_handleClick}
        className={cardClasses}
        tabIndex="-1"
        ref={ref}
      >
        <Card.Body className={bodyClasses}>
          {title}
          <Button
            onKeyUp={handleKeyPress}
            onKeyDown={handleKeyPress}
            onClick={button_handleClick}
            className={buttonClasses}
          >
            -
          </Button>
        </Card.Body>
      </Card>
    );
  }
);

export default ItemList;
