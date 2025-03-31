'use strict';



/**
 * navbar toggle
 */

const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");

const navElemArr = [navOpenBtn, navCloseBtn];

for (let i = 0; i < navElemArr.length; i++) {
  navElemArr[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
  });
}

/**
 * toggle navbar when click any navbar link
 */

const navbarLinks = document.querySelectorAll("[data-nav-link]");

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", function () {
    navbar.classList.remove("active");
  });
}





/**
 * header active when window scrolled down
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  window.scrollY >= 50 ? header.classList.add("active")
    : header.classList.remove("active");
});

// research paper download
function downloadPDF(pdfUrl) {
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = pdfUrl.split('/').pop();  // Extracts filename
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// audio
document.getElementById("audioFile").addEventListener("change", function (event) {
  const file = event.target.files[0];
  const error = document.getElementById("error");
  const audioPlayer = document.getElementById("audioPlayer");

  if (file) {
      if (!file.type.startsWith("audio/")) {
          error.textContent = "Please upload a valid audio file.";
          audioPlayer.style.display = "none";
          return;
      }
      error.textContent = "";
      const objectURL = URL.createObjectURL(file);
      audioPlayer.src = objectURL;
      audioPlayer.style.display = "block";
  }
});

//tweets
function addTweet() {
  let tweetText = document.getElementById("tweetInput").value.trim();
  let tweetName = document.getElementById("tweetName").value.trim();
  if (tweetText === "") {
    alert("Please write something before tweeting!");
    return;
  }

  let tweetsContainer = document.querySelector(".tweets-content");

  // Create a new tweet card
  let tweetCard = document.createElement("div");
  tweetCard.classList.add("tweets-card");

  tweetCard.innerHTML = `
    <figure class="card-avatar">
      <img src="./assets/images/profile.png" width="60" height="60" loading="lazy" alt="User">
    </figure>
    <div>
      <blockquote class="tweets-text">${tweetText}</blockquote>
      <h3 class="tweets-name">${tweetName}</h3>
      <p class="tweets-title">@YourHandle</p>
    </div>
  `;

  // Append new tweet to the tweet section
  tweetsContainer.appendChild(tweetCard);

  // Clear the input field after submission
  document.getElementById("tweetInput").value = "";
}

