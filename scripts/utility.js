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
 * Function that iterates through game matches and display their information on the page.
 * @param {GAME_NAV} direction - Constant that defines which match to show: previous or next
 */
function changeMatch(direction) {
  switch (direction) {
    case GAME_NAV.PREVIOUS:
      // If looped through the initial array position, resets to the array tail
      if (--gamesIndex < 0) {
        gamesIndex = MLBStatsAPIHandler.gamesObjArray.length - 1;
      }
      break;
    case GAME_NAV.NEXT:
      // If looped through the final array position, resets to the array head
      if (++gamesIndex >= MLBStatsAPIHandler.gamesObjArray.length) {
        gamesIndex = 0;
      }
      break;
    default:
      console.log("Invalid navigation option.");
      return;
  }
  // Display New Match Info on the Form
  displayGameInfo(MLBStatsAPIHandler.gamesObjArray[gamesIndex]);
}

/**
 * Function that will receive a Game Object and set its informations on the HTML Form.
 * @param {Object} game - JSON Object containing all information related to a game.
 */
function displayGameInfo(game) {
  console.log(game);
  // TODO
}
