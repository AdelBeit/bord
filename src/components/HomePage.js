import React from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import ItemList from "./ItemList";
import { HotKeys } from "react-hotkeys";

const HomePage = ({
  keyMap,
  hotKeyHandlers,
  activeCategory,
  user,
  showItemAddButton,
  keyword,
  currentItemIndex,
  isFetchingItems,
  loadingMessage,
  CategorySelectionHandler,
  SearchHandler,
  AddItemHandler,
  ToggleItemisCompleteHandler,
  RemoveItemHandler,
  searchBarRef,
  currentItemRef,
  items,
  itemDetails,
  pleaseWait,
}) => {
  return (
    <HotKeys keyMap={keyMap} handlers={hotKeyHandlers}>
      <div>
        <Header
          userName={user.name}
          activeCategory={activeCategory}
          setCategory={CategorySelectionHandler}
        />
        <SearchBar
          ref={searchBarRef}
          userEmail={user.email}
          category={activeCategory}
          showButton={showItemAddButton}
          keyword={keyword}
          setKeyword={SearchHandler}
          addItem={AddItemHandler}
          pauseSubmission={pleaseWait}
        />
        <ItemList
          ref={currentItemRef}
          currentItemIndex={currentItemIndex}
          items={items}
          itemDetails={itemDetails}
          isFetchingItems={isFetchingItems}
          activeCategory={activeCategory}
          loadingMessage={loadingMessage}
          toggleComplete={ToggleItemisCompleteHandler}
          removeItem={RemoveItemHandler}
        />
      </div>
    </HotKeys>
  );
};

export default HomePage;
