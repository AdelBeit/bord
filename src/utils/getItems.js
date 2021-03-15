/**
 * Fetch items from airtable by the specified filter
 * @param {String} searchField
 * @param {String} fieldQuery
 * @param {String} maxRecords
 */
export function getItems(searchField = "Title", fieldQuery = "") {
  const filter = `REGEX_MATCH(LOWER({${searchField}}),".*${fieldQuery}.*")`;

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

  /**
   * helper for fetching all items, works with pagination, recursive
   */
  async function fetchAll(offset = "") {
    const queryParams = new URLSearchParams();
    queryParams.append("filterByFormula", filter);
    if (offset !== "") {
      queryParams.append("offset", offset);
    }
    authCloak.search = queryParams.toString();
    try {
      let response = await fetch(authCloak, requestOptions);
      let data = await response.json();
      // if data is empty throw error
      if (!data.records) throw Error("GET from airtable failed");
      // if there is more, recurse, else return
      if (data.offset) {
        const dataRest = await fetchAll(data.offset);
        return [...data.records, ...dataRest];
      } else {
        return data.records;
      }
    } catch (error) {
      console.error(error);
      this.setState({
        loadingMessage: error,
      });
    }
  }

  // main fetch flow
  fetchAll()
    .then((data) => {
      // holds all item titles in each category
      const categorizedItems = {};
      // holds all item details, accessible by item title
      const itemDetails = {};

      data.map((item) => {
        const itemCategory = item.fields.Category;
        const itemTitle = item.fields.Title;
        if (!categorizedItems[itemCategory]) {
          categorizedItems[itemCategory] = [];
        }
        categorizedItems[itemCategory].push(item.fields.Title);
        itemDetails[itemTitle] = item.fields;
        itemDetails[itemTitle]["id"] = item.id;

        return 0;

        // update category lengths
        // return (categoryItemLengths[itemCategory] =
        //   categoryItemLengths[itemCategory] + 1 || 1);
      });

      this.setState({
        categorizedItems: categorizedItems,
        itemDetails: itemDetails,
        showItemAddButton:
          categorizedItems[this.state.activeCategory].length === 0 &&
          this.state.keyword !== "",
        items: categorizedItems[this.state.activeCategory],
        defaultItems: data,
        isFetchingItems: false,
      });
    })
    .catch((error) => {
      console.error(error);
      this.setState({
        loadingMessage: error,
      });
    });
}
