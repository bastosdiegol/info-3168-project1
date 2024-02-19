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
    // Conditional to pad numbers < 10 with 0 at the start
    if (i < 10) {
      option.textContent = String(i).padStart(2, "0");
      option.value = option.textContent;
    } else {
      option.textContent = i;
      option.value = i;
    }
    selectElement.appendChild(option);
  }
}

/**
 * Function that starts the AJAX comunication between the HTML Form and the MLB API.
 */
function searchGames() {
  const inputDay = document.getElementById("day").value;
  const inputMonth = document.getElementById("month").value;
  const inputYear = document.getElementById("year").value;

  if (!inputDay || !inputMonth || !inputYear) {
    alert("Please, select a valid date.");
    return;
  }

  MLBStatsAPIHandler.getStats(inputDay, inputMonth, inputYear);
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
  // Home Team Logo
  let homeTeamLogoElement = document.getElementById("home-team-logo");
  homeTeamLogoElement.src = `https://www.mlbstatic.com/team-logos/team-cap-on-light/${game.teams.home.team.id}.svg`;
  homeTeamLogoElement.alt = game.teams.home.team.name;
  // Away Team Logo
  let awayTeamLogoElement = document.getElementById("away-team-logo");
  awayTeamLogoElement.alt = game.teams.away.team.name;
  awayTeamLogoElement.src = `https://www.mlbstatic.com/team-logos/team-cap-on-light/${game.teams.away.team.id}.svg`;
  if (homeTeamLogoElement.style.display == "none") {
    homeTeamLogoElement.style.display = "block";
    awayTeamLogoElement.style.display = "block";
  }
  // Teams Names
  document.getElementById("home-team").value = game.teams.home.team.name;
  document.getElementById("away-team").value = game.teams.away.team.name;
  // Checks the Home team is the winner
  if (game.teams.home.isWinner) {
    document.getElementById("winning-score").value = game.teams.home.score;
    document.getElementById("losing-score").value = game.teams.away.score;
    document.getElementById("home-team").className = "winner";
    document.getElementById("away-team").className = "loser";
  } else if (game.teams.away.isWinner) {
    // Away team is the winner
    document.getElementById("winning-score").value = game.teams.away.score;
    document.getElementById("losing-score").value = game.teams.home.score;
    document.getElementById("home-team").className = "loser";
    document.getElementById("away-team").className = "winner";
  } else {
    document.getElementById("winning-score").value = game.teams.home.score;
    document.getElementById("losing-score").value = game.teams.away.score;
    document.getElementById("home-team").className = "draw";
    document.getElementById("away-team").className = "draw";
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
  const homeTeamElement = document.getElementById("home-team");
  const awayTeamElement = document.getElementById("away-team");
  const winningScoreElement = document.getElementById("winning-score");
  const losingScoreElement = document.getElementById("losing-score");
  // Saves Team Names Inputs
  currentGame.teams.home.team.name = homeTeamElement.value;
  currentGame.teams.away.team.name = awayTeamElement.value;
  // Checks if the Home team is the current winner
  // Then Updates Home and Away teams new scores
  if (currentGame.teams.home.isWinner) {
    currentGame.teams.home.score = Number(winningScoreElement.value);
    currentGame.teams.away.score = Number(losingScoreElement.value);
  } else if (currentGame.teams.away.isWinner) {
    currentGame.teams.home.score = Number(losingScoreElement.value);
    currentGame.teams.away.score = Number(winningScoreElement.value);
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
    if (homeTeamElement.className === "winner") {
      homeTeamElement.className = "loser";
      awayTeamElement.className = "winner";
    } else if (homeTeamElement.className === "loser") {
      homeTeamElement.className = "winner";
      awayTeamElement.className = "loser";
    }
    // Swap the Score Input to reflect the new data
    let tempScore = Number(winningScoreElement.value);
    winningScoreElement.value = Number(losingScoreElement.value);
    losingScoreElement.value = tempScore;
  } else if (
    currentGame.teams.home.isWinner === undefined &&
    currentGame.teams.away.isWinner === undefined
  ) {
    // Drawn Conditional for current game
    // Winning Score Element -> Home Score
    // Losing Score Element -> Away Score
    if (winningScoreElement.value > losingScoreElement.value) {
      homeTeamElement.className = "winner";
      awayTeamElement.className = "loser";
      currentGame.teams.home.isWinner = true;
      currentGame.teams.away.isWinner = false;
    } else {
      homeTeamElement.className = "loser";
      awayTeamElement.className = "winner";
      currentGame.teams.home.isWinner = false;
      currentGame.teams.away.isWinner = true;
    }
    currentGame.teams.home.score = Number(winningScoreElement.value);
    currentGame.teams.away.score = Number(losingScoreElement.value);
  }
  // Saves Venue Input
  currentGame.venue.name = document.getElementById("venue").value;
}

/**
 * Function that clears all form inputs for the games form.
 */
function clearGamesForm() {
  document.getElementById("home-team").value = "";
  document.getElementById("home-team").className = "";
  document.getElementById("away-team").value = "";
  document.getElementById("away-team").className = "";
  document.getElementById("winning-score").value = "";
  document.getElementById("losing-score").value = "";
  document.getElementById("venue").value = "";
  document.getElementById("home-team-logo").style.display = "none";
  document.getElementById("away-team-logo").style.display = "none";
}
