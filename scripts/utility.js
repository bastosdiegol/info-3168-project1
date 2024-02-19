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
  // Home Team Logo
  let homeTeamLogoElement = document.getElementById("home-team-logo");
  homeTeamLogoElement.src = `https://www.mlbstatic.com/team-logos/team-cap-on-light/${game.teams.home.team.id}.svg`;
  homeTeamLogoElement.alt = game.teams.home.team.name;
  // Away Team Logo
  let awayTeamLogoElement = document.getElementById("away-team-logo");
  awayTeamLogoElement.alt = game.teams.away.team.name;
  awayTeamLogoElement.src = `https://www.mlbstatic.com/team-logos/team-cap-on-light/${game.teams.away.team.id}.svg`;
  // Teams Names
  document.getElementById("home-team").value = game.teams.home.team.name;
  document.getElementById("away-team").value = game.teams.away.team.name;
  // Checks the Home team is the winner
  if (game.teams.home.isWinner) {
    document.getElementById("winning-score").value = game.teams.home.score;
    document.getElementById("losing-score").value = game.teams.away.score;
    document.getElementById("home-team").className = "winner";
    document.getElementById("away-team").className = "loser";
  } else {
    // Away team is the winner
    document.getElementById("winning-score").value = game.teams.away.score;
    document.getElementById("losing-score").value = game.teams.home.score;
    document.getElementById("home-team").className = "loser";
    document.getElementById("away-team").className = "winner";
  }
  // Match Venue
  document.getElementById("venue").value = game.venue.name;
}

/**
 * Function that will get the information from the HTML form and save into the object.
 * Also adjust the HTML Form to Match the current new data
 */
function saveGameInfo() {
  let currentGame = MLBStatsAPIHandler.gamesObjArray[gamesIndex];
  // Saves Team Names Inputs
  currentGame.teams.home.team.name = document.getElementById("home-team").value;
  currentGame.teams.away.team.name = document.getElementById("away-team").value;
  // Checks if the Home team is the current winner
  // Then Updates Home and Away teams new scores
  if (currentGame.teams.home.isWinner) {
    currentGame.teams.home.score = Number(
      document.getElementById("winning-score").value
    );
    currentGame.teams.away.score = Number(
      document.getElementById("losing-score").value
    );
  } else {
    currentGame.teams.home.score = Number(
      document.getElementById("losing-score").value
    );
    currentGame.teams.away.score = Number(
      document.getElementById("winning-score").value
    );
  }
  // Verify if the current Winner status of the game was changed
  // Checks if home team is winner and if its score is lower
  // OR if away team is winner and if its score is lower
  // Then swap the winners
  if (
    (currentGame.teams.home.isWinner &&
      currentGame.teams.home.score < currentGame.teams.away.score) ||
    (currentGame.teams.away.isWinner &&
      currentGame.teams.away.score < currentGame.teams.home.score)
  ) {
    // Swap the winners
    currentGame.teams.home.isWinner = !currentGame.teams.home.isWinner;
    currentGame.teams.away.isWinner = !currentGame.teams.away.isWinner;
    // Swap the background colors
    const homeTeamElement = document.getElementById("home-team");
    const awayTeamElement = document.getElementById("away-team");
    if (homeTeamElement.className === "winner") {
      homeTeamElement.className = "loser";
      awayTeamElement.className = "winner";
    } else if (homeTeamElement.className === "loser") {
      homeTeamElement.className = "winner";
      awayTeamElement.className = "loser";
    }
    // Swap the Score Input to reflect the new data
    let tempScore = Number(document.getElementById("winning-score").value);
    document.getElementById("winning-score").value = Number(
      document.getElementById("losing-score").value
    );
    document.getElementById("losing-score").value = tempScore;
  }
  // Saves Venue Input
  currentGame.venue.name = document.getElementById("venue").value;
}
