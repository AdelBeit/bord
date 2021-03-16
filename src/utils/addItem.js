/**
 * Add an item to items table
 * @param {Object} fields: item's cell values, can contain all, some, or none of the field values
 */
export function addItem(fields) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const requestBody = JSON.stringify({
    records: [{ fields }],
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: requestBody,
  };

  /**
   * Helper util, adds the newly pushed item into the current state to avoid fetching the whole table from airtable
   */
  const addNewItem = (id) => {
    const categorizedTitles = this.state.defaultItems;
    console.log({ ...fields });
    this.state.itemDetails[fields.Title] = fields;
    this.state.itemDetails[fields.Title]["id"] = id;

    categorizedTitles[this.state.activeCategory].unshift(fields.Title);
    this.setState({
      isFetchingItems: false,
      items: categorizedTitles[this.state.activeCategory],
      defaultItems: categorizedTitles,
      keyword: "",
      itemDetails: this.state.itemDetails[fields.Title],
    });
    this.handlers.SearchHandler();
  };

  const authCloak = new URL(
    window.location.origin + "/.netlify/functions/auth-cloak"
  );
  fetch(authCloak, requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((records) => {
      records.records.map((record) => {
        return addNewItem(record.id);
      });
    })
    .catch((err) => console.error(err));
}
