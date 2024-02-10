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
