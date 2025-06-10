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
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageInfo = document.getElementById("pageInfo");

  let websites = [];
  let filteredSites = [];
  const sitesPerPage = 8;
  let currentPage = 1;

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

  function displaySites(page = 1) {
    siteList.innerHTML = "";

    const startIndex = (page - 1) * sitesPerPage;
    const endIndex = startIndex + sitesPerPage;
    const pageSites = filteredSites.slice(startIndex, endIndex);

    pageSites.forEach(site => {
      siteList.appendChild(renderSite(site));
    });

    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filteredSites.length / sitesPerPage)}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= Math.ceil(filteredSites.length / sitesPerPage);
  }

  function filterSites() {
    const query = searchInput.value.toLowerCase();
    filteredSites = websites.filter(site => 
      site.name.toLowerCase().includes(query) || 
      site.description.toLowerCase().includes(query)
    );
    currentPage = 1;
    displaySites(currentPage);
  }

  function loadSites() {
    db.ref("websites2").once("value", snapshot => {
      websites = [];
      snapshot.forEach(child => {
        websites.push(child.val());
      });

      websites.sort((a, b) => b.timestamp - a.timestamp); // Latest first
      filterSites();
    });
  }

  searchInput.addEventListener("input", filterSites);
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displaySites(currentPage);
    }
  });
  nextBtn.addEventListener("click", () => {
    if (currentPage < Math.ceil(filteredSites.length / sitesPerPage)) {
      currentPage++;
      displaySites(currentPage);
    }
  });

  window.addEventListener("load", loadSites);
