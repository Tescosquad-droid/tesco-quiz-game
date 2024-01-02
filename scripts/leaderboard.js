import { details } from "../data/details.js";

function generateLeaderboard() {
  let html = '';

  const details = arrangeLeaderboard()

  for (let i = 0; i < details.length; i++) {
    const element = details[i];
    console.log(element)
    html += `
    <div class="details">
      <div class="sub-detail">${i + 1}</div>
      <div class="sub-detail">${element.name}</div>
      <div class="sub-detail">${element.score}</div>
      <div class="sub-detail last-column">${element.amount}</div>
    </div>
    `
  }
  return html;
}

function arrangeLeaderboard() {
  details.sort((a, b) => {return b.decider - a.decider})
  return details;
}

const html = generateLeaderboard()

document.querySelector('.js-details-board').innerHTML = html;