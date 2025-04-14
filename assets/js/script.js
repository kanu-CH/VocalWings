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

/**
 * Tweets persistence
 */

// Function to load tweets from localStorage
function loadTweets() {
  const tweetsContainer = document.querySelector(".tweets-list");
  const savedTweets = JSON.parse(localStorage.getItem("tweets")) || [];

  // Clear existing tweets before adding new ones
  tweetsContainer.innerHTML = '';

  savedTweets.forEach(tweet => {
    let tweetCard = document.createElement("div");
    tweetCard.classList.add("tweets-card");

    tweetCard.innerHTML = `
      <figure class="card-avatar">
        <img src="./assets/images/profile.png" width="60" height="60" loading="lazy" alt="User">
      </figure>
      <div>
        <blockquote class="tweets-text">${tweet.text}</blockquote>
        <h3 class="tweets-name">${tweet.name}</h3>
        <p class="tweets-title">@YourHandle</p>
      </div>
    `;

    // Append new tweet to the container
    tweetsContainer.appendChild(tweetCard);
  });
}

// Function to add a tweet
function addTweet() {
  let tweetText = document.getElementById("tweetInput").value.trim();
  let tweetName = document.getElementById("tweetName").value.trim();

  if (tweetText === "") {
    alert("Please write something before tweeting!");
    return;
  }

  // Create a new tweet object
  const tweet = {
    text: tweetText,
    name: tweetName
  };

  // Get existing tweets from localStorage, or initialize as an empty array
  const savedTweets = JSON.parse(localStorage.getItem("tweets")) || [];

  // Add the new tweet to the array
  savedTweets.push(tweet);

  // Save the updated array back to localStorage
  localStorage.setItem("tweets", JSON.stringify(savedTweets));

  // Add the tweet to the UI
  let tweetsContainer = document.querySelector(".tweets-list");

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

  // Clear the input fields after submission
  document.getElementById("tweetInput").value = "";
  document.getElementById("tweetName").value = "";
}

// Call loadTweets on page load to restore previous tweets
window.addEventListener("load", loadTweets);
