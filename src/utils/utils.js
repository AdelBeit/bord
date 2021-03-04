import { addItem } from "./addItem";
import { removeItem } from "./removeItem";

const handlers = {
  /**
   * Upon input change, search the list for items with a title that includes/matches the input
   */
  SearchHandler: function (event) {
    const keyword = event ? event.target.value || "" : "";
    const searchField = "Title";
    const activeCategory = this.state.activeCategory;
    const categoryItemLengths = {
      Movies: 0,
      Shows: 0,
      Books: 0,
    };
    //   Filter the list by keyword
    const filteredList = this.state.defaultItems.filter((item) => {
      const itemInfo = item.fields[searchField].toLowerCase();
      const searchKey = keyword.trim().toLowerCase();
      // does item match keyword
      const filterMatch = itemInfo.includes(searchKey);
      const itemCategory = item.fields.Category;
      // update category lengths based on matched items
      if (filterMatch) categoryItemLengths[itemCategory] += 1;
      return filterMatch;
    });
    this.setState({
      categoryItemLengths: {
        ...categoryItemLengths,
      },
      showItemAddButton:
        categoryItemLengths[activeCategory] === 0 && keyword !== "",
      items: filteredList,
      keyword: keyword,
    });
  },
  CategorySelectionHandler: function (event) {
    const newActiveCategory = event.currentTarget.textContent;
    this.setState({
      showItemAddButton:
        this.state.categoryItemLengths[newActiveCategory] === 0 &&
        this.state.keyword !== "",
      activeCategory: newActiveCategory,
      currentItemIndex: -1,
    });
  },
  ToggleItemisCompleteHandler: function (id, event) {
    if (
      event.target.tagName !== "BUTTON" &&
      event.target.className !== "delete_button_icon"
    ) {
      this.utils.toggleItemFields(id);
    }
  },
  AddItemHandler: function (fields, event) {
    this.setState({ isFetchingItems: true });
    this.addItem = addItem.bind(this);
    this.addItem(fields);
  },
  RemoveItemHandler: function (id, event) {
    this.removeItem = removeItem.bind(this);
    this.removeItem(id);
  },
};

// -------------------  HOTKEYS UTILS -------------------
// Haven't implemented delete, figured it's not an urgent feature
const keyMap = {
  SEARCH: "Control+e",
  DELETE_ITEM: "del",
  ITEM_DOWN: ["down", "tab"],
  ITEM_UP: ["up", "Shift+tab"],
  CATEGORY_LEFT: ["left", "Control+["],
  CATEGORY_RIGHT: ["right", "Control+]"],
};
const hotKeyHandlers = {
  SEARCH: function (event) {
    event.preventDefault();
    event.stopPropagation();
    this.searchBarRef.current.focus();
  },
  DELETE_ITEM: function (event) {},
  ITEM_DOWN: function (event) {
    if (event.key === "Tab") {
      event.preventDefault();
      event.stopPropagation();
    }
    let currentIndex = this.state.currentItemIndex;
    let maxIndex =
      this.state.categoryItemLengths[this.state.activeCategory] - 1;
    let newIndex = currentIndex + 1;
    if (currentIndex >= maxIndex) {
      newIndex = 0;
    }
    this.setState({ currentItemIndex: newIndex });
  },
  ITEM_UP: function (event) {
    if (event.shiftKey && event.key === "Tab") {
      event.preventDefault();
      event.stopPropagation();
    }
    let currentIndex = this.state.currentItemIndex;
    let minIndex = 0;

    let newIndex = currentIndex - 1;
    if (newIndex < minIndex) {
      newIndex = this.state.categoryItemLengths[this.state.activeCategory] - 1;
    }
    this.setState({ currentItemIndex: newIndex });
  },
  CATEGORY_LEFT: function (event) {
    let categories = Object.keys(this.state.categoryItemLengths);
    let currentIndex = categories.indexOf(this.state.activeCategory);
    let minIndex = 0;
    let newIndex = currentIndex - 1;
    if (newIndex < minIndex) {
      newIndex = categories.length - 1;
    }
    let newActiveCategory = categories[newIndex];
    this.setState({
      activeCategory: newActiveCategory,
      showItemAddButton:
        this.state.categoryItemLengths[newActiveCategory] === 0 &&
        this.state.keyword !== "",
    });
  },
  CATEGORY_RIGHT: function (event) {
    let categories = Object.keys(this.state.categoryItemLengths);
    let currentIndex = categories.indexOf(this.state.activeCategory);
    let maxIndex = categories.length;
    let newIndex = currentIndex + 1;
    if (newIndex >= maxIndex) {
      newIndex = 0;
    }
    let newActiveCategory = categories[newIndex];
    this.setState({
      activeCategory: newActiveCategory,
      showItemAddButton:
        this.state.categoryItemLengths[newActiveCategory] === 0 &&
        this.state.keyword !== "",
    });
  },
};

// -------------------  UTILS  -------------------
const utils = {
  /**
   * Sets the isFetchingItems state variable, used to pause hotkeys
   * @param {boolean} wait: new value for isFetchingItems state
   */
  pleaseWait: function (wait) {
    this.setState({ showItemAddButton: wait });
  },
  /**
   * Convert boolean string to boolean
   * @param {String} value: true/false boolean in the form of a string
   */
  stringToBool: function (value) {
    return value === "true";
  },
  /**
   * Flip a string value representing a boolean
   * @param {String} value: true/false boolean in the form of a string
   */
  flipBool: function (value) {
    return !(value === "true") + "";
  },
  /**
   * Toggle a given field for the item with the given id
   * @param {String} id: item id
   * @param {String} toggleField: name of the field to be toggled
   */
  toggleItemFields: function (id = "", toggleField = "Completed") {
    let currentValue;
    const updatedItems = this.state.items.map((item) => {
      if (item.id === id) {
        currentValue = item.fields[toggleField];
        item.fields[toggleField] = this.utils.flipBool(currentValue);
      }
      return item;
    });
    this.setState({
      items: updatedItems,
      defaultItems: updatedItems,
    });

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestBody = JSON.stringify({
      records: [
        {
          id: id,
          fields: {
            [toggleField]: this.utils.flipBool(currentValue),
          },
        },
      ],
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: requestBody,
    };
    const authCloak = new URL(
      window.location.origin + "/.netlify/functions/auth-cloak"
    );
    fetch(authCloak, requestOptions)
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.error(err));
  },
};

const miscUtils = {
  logme: {
    id: (i) => i.map((ii) => console.log(ii.id)),
    fields: (i) => i.map((ii) => console.log(ii.fields.Completed === "true")),
    all: (i) =>
      i.map((ii) =>
        console.log(
          "item: " +
            ii.fields.Title +
            " fields: " +
            (ii.fields.Completed === "true")
        )
      ),
  },
};

export { handlers, hotKeyHandlers, keyMap, utils };
