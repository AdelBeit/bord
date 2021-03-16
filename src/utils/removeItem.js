/**
 * Remove given item
 * @param {String} id: item id
 */
export function removeItem(id) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  const requestBody = new URLSearchParams();
  requestBody.append("records[]", id);
  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    body: requestBody,
  };

  /**
   * Helper util, removes the newly deleted item from the current state to avoid fetching the whole table from airtable
   */
  const removeCurrentItem = (id) => {
    const newItems = this.state.defaultItems[this.state.activeCategory].filter(
      (item) => {
        return item.id !== id;
      }
    );
    this.setState({ items: newItems, defaultItems: newItems, keyword: "" });
    this.handlers.SearchHandler();
  };

  const authCloak = new URL(
    window.location.origin + "/.netlify/functions/auth-cloak"
  );
  authCloak.searchParams.set("records[]", id);

  fetch(authCloak, requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((records) => {
      console.log("deleted: ");
      console.log(records);
      removeCurrentItem(id);
    })
    .catch((err) => console.error(err));
}
