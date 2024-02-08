// Call that Initialize all the Select Options
addEventListener("load", function () {
  const yearSelect = document.getElementById("year");
  addSelectOptions(yearSelect, 2020, 2022);

  const monthSelect = document.getElementById("month");
  addSelectOptions(monthSelect, 1, 12);

  const daySelect = document.getElementById("day");
  addSelectOptions(daySelect, 1, 31);
});

// MLB Stats Test Request
var MLBStats = new MLBStatsAsyncHandler();
MLBStats.getStats(3, 6, 2019);
