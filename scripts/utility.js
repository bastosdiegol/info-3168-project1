/**
 * Function that fills a form select with options from provided range (inclusive).
 * @function
 * @param {HTMLSelectElement} selectElement - Select DOM Element which will receive the options.
 * @param {number} min - Range lowest value.
 * @param {number} max - Range highest value.
 */
function addSelectOptions(selectElement, min, max) {
  let option;
  for (let i = min; i <= max; i++) {
    option = document.createElement("option");
    option.value = i;
    // Conditional to pad numbers < 10 with 0 at the start
    if (i < 10) {
      option.textContent = String(i).padStart(2, "0");
    } else {
      option.textContent = i;
    }
    selectElement.appendChild(option);
  }
}

/**
 * Object Constructor for MLB Asynchronous JSON Request.
 * @property {XMLHttpRequest} request Data API for AJAX.
 * @property {Object} statsData Literal Object containing the JSON Response.
 * @constant {number} ISOK Status code for successful request
 */
function MLBStatsAsyncHandler() {
  this.request = new XMLHttpRequest();
  this.statsData = null;
  const ISOK = 200;
  /**
   * Function that formats the URL and submit the JSON Request to MLB API.
   * Asynchronous Request - JavaScript Object will be parsed to statsData
   * @method @async {}
   * @param {number} day - Day of the matches.
   * @param {number} month - Month of the matches.
   * @param {number} year - Year of the matches.
   */
  this.getStats = function (day, month, year) {
    let url = `https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date=${day}/${month}/${year}`;
    // Async anonymous arrow function to handle the response
    this.request.onload = () => {
      if (this.request.status === ISOK) {
        this.responseData = JSON.parse(this.request.responseText);
        console.log(this.responseData);
        // TODO: Set the matches into the HTML form
      }
    };
    this.request.open("GET", url, true);
    this.request.send();
  };
}
