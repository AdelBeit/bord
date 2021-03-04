const fetch = require("node-fetch");

let { airtable_apiKey, airtable_itemsEndpoint } = process.env;

const handler = async function (event) {
  // Get env var values defined in our Netlify site UI
  const requestMethod = event.httpMethod;
  let requestBody = event.body;
  let authHeaders = new fetch.Headers();
  authHeaders.append("Authorization", "Bearer " + airtable_apiKey);
  authHeaders.append("Content-Type", event.headers["content-type"]);
  // forward the query strings
  let fetchEndpoint = new URL(airtable_itemsEndpoint);
  var queryParams = new URLSearchParams(event.queryStringParameters);
  fetchEndpoint.search = queryParams.toString();

  const requestOptions = {
    method: requestMethod,
    headers: authHeaders,
  };
  if (requestMethod !== "GET") requestOptions.body = requestBody;

  try {
    let data = await fetch(fetchEndpoint, requestOptions);
    data = await data.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: error };
  }
};

module.exports = { handler };
