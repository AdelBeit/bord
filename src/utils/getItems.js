/**
 * Fetch items from airtable by the specified filter
 * @param {String} searchField
 * @param {String} fieldQuery
 * @param {String} maxRecords
 */
export function getItems(searchField = "Title", fieldQuery = "") {
  const filter = `REGEX_MATCH(LOWER({${searchField}}),".*${fieldQuery}.*")`;
  const queryParams = new URLSearchParams();
  queryParams.append("filterByFormula", filter);
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const authCloak = new URL(
    window.location.origin + "/.netlify/functions/auth-cloak"
  );
  authCloak.search = queryParams.toString();

  fetch(authCloak, requestOptions)
    .then((response) => response.json())
    .then((records) => {
      if (!records.records) throw Error("GET from airtable failed");
      const categoryItemLengths = {
        Movies: 0,
        Shows: 0,
        Books: 0,
      };
      let recordsArray = [];
      records.records.map((item) => {
        const itemCategory = item.fields.Category;
        recordsArray.push(item);
        // update category lengths
        return (categoryItemLengths[itemCategory] =
          categoryItemLengths[itemCategory] + 1 || 1);
      });
      this.setState({
        showItemAddButton:
          categoryItemLengths[this.state.activeCategory] === 0 &&
          this.state.keyword !== "",
        categoryItemLengths: categoryItemLengths,
        items: recordsArray,
        defaultItems: recordsArray,
        isFetchingItems: false,
      });
    })
    .catch((error) => {
      console.log(error);
      this.setState({
        loadingMessage: error,
      });
    });
}
