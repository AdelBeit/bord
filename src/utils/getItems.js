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

  let temp_categorizedTitles = {
    Movies: [
      "Youth in Revolt",
      "When in Rome",
      "What Happens in Vegas",
      "Water For Elephants",
    ],
  };
  let temp_itemDetails = {
    "Youth in Revolt": {
      Title: "Youth in Revolt",
      Category: "Movies",
      Completed: "true",
      id: "2",
    },
    "When in Rome": {
      Title: "When in Rome",
      Category: "Movies",
      Completed: "true",
      id: "3",
    },
    "What Happens in Vegas": {
      Title: "What Happens in Vegas",
      Category: "Movies",
      Completed: "false",
      id: "5",
    },
    "Water For Elephants": {
      Title: "Water For Elephants",
      Category: "Movies",
      Completed: "true",
      id: "7",
    },
  };

  // this.setState({
  //   categorizedItems: temp_categorizedItems,
  //   itemDetails: temp_itemDetails,
  //   showItemAddButton:
  //     temp_categorizedItems[this.state.activeCategory].length === 0 &&
  //     this.state.keyword !== "",
  //   items: temp_categorizedItems[this.state.activeCategory],
  //   isFetchingItems: false,
  // });

  // main fetch flow
  fetchAll()
    .then((data) => {
      // holds all item titles in each category
      const categorizedTitles = {};
      // holds all item details, accessible by item title
      const itemDetails = {};

      data.map((item) => {
        const itemCategory = item.fields.Category;
        const itemTitle = item.fields.Title;
        if (!categorizedTitles[itemCategory]) {
          categorizedTitles[itemCategory] = [];
        }
        categorizedTitles[itemCategory].push(item.fields.Title);
        itemDetails[itemTitle] = item.fields;
        itemDetails[itemTitle]["id"] = item.id;

        // update category lengths
        // return (categoryItemLengths[itemCategory] =
        //   categoryItemLengths[itemCategory] + 1 || 1);
      });

      this.setState({
        itemDetails: itemDetails,
        showItemAddButton:
          categorizedTitles[this.state.activeCategory].length === 0 &&
          this.state.keyword !== "",
        items: categorizedTitles[this.state.activeCategory],
        defaultItems: categorizedTitles,
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
