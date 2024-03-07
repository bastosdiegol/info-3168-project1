// Call that Initialize all the Select Options
document.addEventListener("DOMContentLoaded", function () {
  const yearSelect = document.getElementById("year");
  addSelectOptions(yearSelect, 2020, 2022);

  const monthSelect = document.getElementById("month");
  addSelectOptions(monthSelect, 1, 12);

  const daySelect = document.getElementById("day");
  addSelectOptions(daySelect, 1, 31);

  // Sets the Notification "Close" link
  const noGamesClose = document.getElementById("no-games-close");
  noGamesClose.addEventListener("click", function () {
    this.parentElement.style.display = "none";
  });
});

/**
 * Global Index for the JSON Games Object Array.
 * @global @type {number}
 */
var gamesIndex = 0;

/**
 * Constant utilized to inform page logic which direction it should iterate, when navigating the JSON data.
 * @constant {number} PREVIOUS - Constant that informs logic to iterate to PREVIOUS game match.
 * @constant {number} NEXT - Constant that informs logic to iterate to NEXT game match.
 */
const GAME_NAV = Object.freeze({
  PREVIOUS: 0,
  NEXT: 1,
});

/**
 * Object that will Handle Asynchronous JSON Request to MLB Stats API.
 * @global @constant
 * @property {XMLHttpRequest} request Data API for AJAX.
 * @property {String} currentKey String containing the current date key for savedSearchMap
 * @property {Array<Object>} gamesObjArray Object array containing the games list from the JSON Response.
 * @property {Map<String, Object>} savedSearchMap Key: Date.toDateString(), 00000m ,nnnnnnnnnnnnnnnnnnnnnnn./Value: JSON Response Object
 * @property {number} ISOK Status code for successful request
 */
const MLBStatsAPIHandler = {
  request: new XMLHttpRequest(),
  currentKey: "",
  gamesObjArray: [],
  savedSearchMap: new Map(),
  ISOK: 200,
  /**
   * Function that formats the URL and submit the JSON Request to MLB API.
   * Asynchronous Request
   * On CallBack the JSON response will be parsed to JavaScript Object and saved
   * The response games array object will be saved for web page navigation
   * @method
   * @param {number} day - Day of the matches.
   * @param {number} month - Month of the matches.
   * @param {number} year - Year of the matches.
   */
  getStats: function (day, month, year) {
    this.currentKey = new Date(year, month, day).toDateString();
    gamesIndex = 0;
    // Checks if date passed by parameter was searched alredy
    // To avoid sending the same request to the API in the current session
    if (this.savedSearchMap.has(this.currentKey)) {
      const savedSearch = this.savedSearchMap.get(this.currentKey);
      // Checks if there's any game on this date
      if (savedSearch.totalGames === 0) {
        // Display No Games Message
        document.getElementById("no-games-div").style.display = "flex";
        clearGamesForm();
      } else {
        // Hides No Games Message
        document.getElementById("no-games-div").style.display = "none";
        // Search found and has games, get Map value and saves the Games Object Array
        this.gamesObjArray = savedSearch.dates[0].games;
        // First Game Match Info to the Page
        displayGameInfo(this.gamesObjArray[gamesIndex]);
      }
      console.log("Used Search Paraments Existing in the Map.");
    } else {
      // URL Date is in MM / DD / YYYY format
      let url = `https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date=${month}/${day}/${year}`;
      /**
       * Async anonymous arrow function to handle the response.
       * @function @async
       */
      this.request.onload = () => {
        if (this.request.status === this.ISOK) {
          // Convert the Response to Object and Saves it.
          let statsData = JSON.parse(this.request.responseText);
          this.savedSearchMap.set(this.currentKey, statsData);
          // Checks if there's any game on this date
          if (statsData.totalGames === 0) {
            // Display No Games Message
            document.getElementById("no-games-div").style.display = "flex";
            clearGamesForm();
          } else {
            // Hides No Games Message
            document.getElementById("no-games-div").style.display = "none";
            // Updates the current Games Object Array
            this.gamesObjArray = statsData.dates[0].games;
            // First Game Match Info to the Page
            displayGameInfo(this.gamesObjArray[gamesIndex]);
          }
        } else {
          console.log("HTTP request error.");
        }
      };
      this.request.open("GET", url, true);
      this.request.send();
      console.log("AJAX Request Sent.");
    }
  },
};
