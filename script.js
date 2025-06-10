const firebaseConfig = {
  apiKey: "AIzaSyCgswS8AZObwKQjxZooWWJHf4b1m1rvorA",
  authDomain: "t2upload.firebaseapp.com",
  databaseURL: "https://t2upload-default-rtdb.firebaseio.com",
  projectId: "t2upload",
  storageBucket: "t2upload.appspot.com",
  messagingSenderId: "1000887477924",
  appId: "1:1000887477924:web:522232d054b9b7ce2ea831",
  measurementId: "G-75ZZL6BWVH"
};

    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    const siteList = document.getElementById("siteList");
    const searchInput = document.getElementById("searchInput");

    function renderSite(data) {
      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.src = data.imageURL || "https://via.placeholder.com/400x180?text=No+Image";
      img.onerror = () => img.src = 'https://via.placeholder.com/400x180?text=No+Image';

      const title = document.createElement("h3");
      title.textContent = data.name;

      const desc = document.createElement("p");
      desc.textContent = data.description;

      const link = document.createElement("a");
      link.href = data.url;
      link.target = "_blank";
      link.textContent = "View Now";

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(link);

      return card;
    }

    function loadSites() {
      db.ref("websites2").once("value", snapshot => {
        const websites = [];
        snapshot.forEach(child => {
          websites.push(child.val());
        });

        // Sort by timestamp descending (latest first)
        websites.sort((a, b) => b.timestamp - a.timestamp);

        // Optional: Shuffle for random view every time
        // websites.sort(() => Math.random() - 0.5);

        displaySites(websites);
      });
    }

    function displaySites(sites) {
      siteList.innerHTML = "";
      const query = searchInput.value.toLowerCase();
      sites.filter(site => site.name.toLowerCase().includes(query) || site.description.toLowerCase().includes(query))
           .forEach(site => {
             siteList.appendChild(renderSite(site));
           });
    }

    searchInput.addEventListener("input", loadSites);
    window.addEventListener("load", loadSites);