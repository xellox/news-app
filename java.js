let openSidenav = document.querySelector(".sidenav-open");
let sidenavContainer = document.querySelector(".sidenav-container");
let newsSection = document.querySelector(".news-grid-wrapper");
let sidenavElements = document.querySelectorAll(".sidenav-elements");
let searchbar = document.querySelector(".searchbar-input");
let searchbarOpen = document.querySelector(".searchbar-open");
let title = document.querySelector(".title");

// Fetch data for the "general" category when the page loads
fetchData("general");


// Toggle sidenavMenu on button click
openSidenav.addEventListener("click", () => {
  sidenavContainer.classList.toggle("open");
});

// Fetch API data on search button click and Enter key press
searchbar.addEventListener("keypress", (e) => {
  if ((e.key === "Enter") & (searchbar.value != "")) {
    fetchData("search", searchbar.value);
  }
});

searchbarOpen.addEventListener("click", () => {
  if (searchbar.value != "") {
    fetchData("search", searchbar.value);
  }
});

// Fetch API data for each element from the header section clicked and get API for that category
sidenavElements.forEach((element) => {
  element.addEventListener("click", () => {
    const category = element.innerHTML;
    fetchData("category", category);
    sidenavContainer.classList.toggle("open");
  });
});

// Sort out in different cases for more compact code and call it when needed
async function fetchData(type, value) {
  let url = "";
  let fetchTitle = "";

  switch (type) {
    case "general":
      url =
        "https://newsapi.org/v2/top-headlines?category=general&language=en&pageSize=12&sortBy=popularity&apiKey=87e15d6c747c4558b1083376e977ff87";
      fetchTitle = `GENERAL NEWS`;
      break;

    case "category":
      url =
        "https://newsapi.org/v2/top-headlines?category=" +
        value +
        "&language=en&pageSize=12&sortBy=popularity&apiKey=87e15d6c747c4558b1083376e977ff87";
      fetchTitle = `TOP NEWS IN ${value}`;
      break;

    case "search":
      url =
        "   https://newsapi.org/v2/everything?q=" +
        value +
        "&pageSize=12&apiKey=87e15d6c747c4558b1083376e977ff87";
      fetchTitle = `TOP NEWS RELATED TO ${value}`;
      break;
    default:
      return;
  }
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayNews(data);
    searchbar.value = "";
    title.innerHTML = fetchTitle;
  } catch (error) {
    console.error("Error occurred while fetching news:", error);
  }
}

function displayNews(data) {
  newsSection.innerHTML = ""; // Clear the news section first
  const promises = data.articles.map((item) => {
    return new Promise((resolve, reject) => {
      if (item.urlToImage === null) {
        // Skip articles without images
        resolve();
      } else {
        const image = new Image();
        image.src = item.urlToImage;
        image.onload = () => {
          const limitedDescription = item.description.substring(0, 140) + "...";
          const limitedTitle = item.title.substring(0,40);
          const newsItem = `
            <div class="news-grid">
              <img class="news-image" src="${item.urlToImage}" alt="" />
              <span class="author">${item.author}</span>
              <span class="news-title">${limitedTitle}</span>
              <span class="news-description">${limitedDescription}</span>
              <a href="${item.url}" target="_blank" rel="noreferrer noopener">
                <div class="open-article">open article</div>
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
                </svg>
              </a>
            </div>
          `;
          resolve(newsItem);
        };
        image.onerror = () => {
          console.error(`Failed to load image: ${item.urlToImage}`);
          resolve();
        };
      }
    });
  });

  Promise.all(promises)
    .then((newsItems) => {
      // Append all the resolved news items to the news section
      newsItems.forEach((newsItem) => {
        if (newsItem) {
          newsSection.innerHTML += newsItem;
        }
      });
    })
    .catch((error) => {
      console.error("Error occurred while fetching news:", error);
    });
}
