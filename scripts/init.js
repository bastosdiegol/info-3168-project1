// Call that Initialize all the Select Options
document.addEventListener("DOMContentLoaded", function () {
  const yearSelect = document.getElementById("year");
  addSelectOptions(yearSelect, 2020, 2022);

  const monthSelect = document.getElementById("month");
  addSelectOptions(monthSelect, 1, 12);

  const daySelect = document.getElementById("day");
  addSelectOptions(daySelect, 1, 31);
});

/**
 * Object that will Hanlde Asynchronous JSON Request to MLB Stats API.
 * @constant
 * @property {XMLHttpRequest} request Data API for AJAX.
 * @property {Object} statsData Literal Object containing the JSON Response.
 * @property {number} ISOK Status code for successful request
 */
const MLBStatsAsyncHandler = {
  request: new XMLHttpRequest(),
  statsData: null,
  ISOK: 200,
  /**
   * Function that formats the URL and submit the JSON Request to MLB API.
   * Asynchronous Request
   * On CallBack the JSON response will be parsed to JavaScript Object statsData
   * @method @async
   * @param {number} day - Day of the matches.
   * @param {number} month - Month of the matches.
   * @param {number} year - Year of the matches.
   */
  getStats: function (day, month, year) {
    let url = `https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date=${day}/${month}/${year}`;
    // Async anonymous arrow function to handle the response
    this.request.onload = () => {
      if (this.request.status === this.ISOK) {
        this.statsData = JSON.parse(this.request.responseText);
        // TODO: Remove following log
        console.log(this.statsData);
        // TODO: Set the matches into the HTML form
      } else {
        console.log("HTTP request error.");
      }
    };
    this.request.open("GET", url, true);
    this.request.send();
  },
};

// Test Request
MLBStatsAsyncHandler.getStats(3, 6, 2019);
