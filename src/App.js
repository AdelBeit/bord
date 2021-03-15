//bôrd
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { withAuth0 } from "@auth0/auth0-react";

// components

import { LoginPage } from "./components/LoginPage";
import HomePage from "./components/HomePage";

// utils
import { handlers, keyMap, hotKeyHandlers, utils } from "./utils/utils";
import { getItems } from "./utils/getItems";

class App extends Component {
  constructor(props) {
    super(props);
    // get auth results
    const { user, isAuthenticated, isLoading } = this.props.auth0;
    this.state = {
      items: [],
      defaultItems: [],
      activeCategory: "Movies",
      isFetchingItems: true,
      loadingMessage: "Loading...",
      keyword: "",
      showItemAddButton: false,
      currentItemIndex: -1,
      categoryItemLengths: {
        Movies: 1,
        Shows: 1,
        Books: 1,
      },
      user: user,
      isAuthenticated: isAuthenticated,
      isLoading: isLoading,
    };
    this.getItems = getItems;
    this.hotKeyHandlers = this.bindUtils(hotKeyHandlers);
    this.utils = this.bindUtils(utils);
    this.handlers = this.bindUtils(handlers);
  }

  /**
   * Binds outside utils to this component's context
   * @param {Map} utilMap: util functions grouped and mapped under an object
   */
  bindUtils(utilMap) {
    const newMap = { ...utilMap };
    Object.keys(newMap).map((key) => {
      try {
        newMap[key] = newMap[key].bind(this);
      } catch (error) {
        console.log(key);
        console.error(error);
      }
    });
    return newMap;
  }

  currentItemRef = React.createRef();
  searchBarRef = React.createRef();

  componentDidUpdate(prevProps) {
    const { user, isAuthenticated, isLoading } = this.props.auth0;
    if (isAuthenticated !== prevProps.auth0.isAuthenticated) {
      if (isAuthenticated) this.getItems("Username", user.email);
      this.setState({
        user: user,
        isAuthenticated: isAuthenticated,
        isLoading: isLoading,
      });
    }
  }

  render() {
    return this.state.isAuthenticated ? (
      <HomePage
        keyMap={keyMap}
        hotKeyHandlers={this.hotKeyHandlers}
        activeCategory={this.state.activeCategory}
        user={this.state.user}
        showItemAddButton={this.state.showItemAddButton}
        keyword={this.state.keyword}
        currentItemIndex={this.state.currentItemIndex}
        isFetchingItems={this.state.isFetchingItems}
        loadingMessage={this.state.loadingMessage}
        items={this.state.items}
        itemDetails={this.state.itemDetails}
        CategorySelectionHandler={this.handlers.CategorySelectionHandler}
        SearchHandler={this.handlers.SearchHandler}
        AddItemHandler={this.handlers.AddItemHandler}
        ToggleItemisCompleteHandler={this.handlers.ToggleItemisCompleteHandler}
        RemoveItemHandler={this.handlers.RemoveItemHandler}
        searchBarRef={this.searchBarRef}
        currentItemRef={this.currentItemRef}
        pleaseWait={this.utils.pleaseWait}
      />
    ) : (
      <div>
        <LoginPage />
      </div>
    );
  }
}

export default withAuth0(App);
