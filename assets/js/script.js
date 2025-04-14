'use strict';

/**
 * Initialize the IndexedDB
 */
let db;

function openDB() {
  const request = indexedDB.open("TweetsDB", 1);

  // Handle errors
  request.onerror = (event) => {
    console.error("Error opening IndexedDB", event);
  };

  // Create an object store if this is the first time the database is created
  request.onupgradeneeded = (event) => {
    db = event.target.result;
    const store = db.createObjectStore("tweets", { keyPath: "id", autoIncrement: true });
    store.createIndex("nameIndex", "name", { unique: false });
    store.createIndex("textIndex", "text", { unique: false });
  };

  // Success
  request.onsuccess = (event) => {
    db = event.target.result;
    console.log("IndexedDB opened successfully");
    loadTweets(); // Load tweets from DB on page load
  };
}

/**
 * Function to add a tweet to IndexedDB
 */
function addTweetToDB(tweet) {
  const transaction = db.transaction(["tweets"], "readwrite");
  const store = transaction.objectStore("tweets");

  // Add tweet to the object store
  store.add(tweet);

  transaction.oncomplete = () => {
    console.log("Tweet added successfully");
    loadTweets(); // Reload tweets after adding
  };

  transaction.onerror = (event) => {
    console.error("Error adding tweet", event);
  };
}

/**
 * Function to load tweets from IndexedDB
 */
function loadTweets() {
  const transaction = db.transaction(["tweets"], "readonly");
  const store = transaction.objectStore("tweets");

  const request = store.getAll(); // Fetch all tweets

  request.onsuccess = () => {
    const tweets = request.result;
    const tweetsContainer = document.querySelector(".tweets-list");
    tweetsContainer.innerHTML = ''; // Clear existing tweets

    tweets.forEach(tweet => {
      const tweetCard = document.createElement("div");
      tweetCard.classList.add("tweets-card");

      tweetCard.innerHTML = `
        <figure class="card-avatar">
          <img src="./assets/images/profile.png" width="60" height="60" loading="lazy" alt="User">
        </figure>
        <div>
          <blockquote class="tweets-text">${tweet.text}</blockquote>
          <h3 class="tweets-name">${tweet.name}</h3>
          <p class="tweets-title">@${tweet.name}</p>
        </div>
      `;

      tweetsContainer.appendChild(tweetCard);
    });
  };

  request.onerror = (event) => {
    console.error("Error loading tweets", event);
  };
}

/**
 * Handle tweet submission
 */
function addTweet() {
  const tweetText = document.getElementById("tweetInput").value.trim();
  const tweetName = document.getElementById("tweetName").value.trim();

  if (tweetText === "") {
    alert("Please write something before tweeting!");
    return;
  }

  const tweet = {
    text: tweetText,
    name: tweetName
  };

  addTweetToDB(tweet); // Add tweet to IndexedDB
  document.getElementById("tweetInput").value = "";
  document.getElementById("tweetName").value = "";
}

/**
 * Load tweets on page load
 */
window.addEventListener("load", () => {
  openDB(); // Open the IndexedDB
});
