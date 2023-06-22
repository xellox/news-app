
let openSidenav = document.querySelector(".sidenav-open")
let sidenavContainer = document.querySelector(".sidenav-container")
let newsSection = document.querySelector(".news-grid-wrapper")
let sidenavElements = document.querySelectorAll(".sidenav-elements")
let searchbar = document.querySelector(".searchbar-input")
let searchbarOpen = document.querySelector(".searchbar-open")
let title = document.querySelector(".title")

fetchDataReload()
//toggle sidenavMenu on button
openSidenav.addEventListener("click", () => {
    sidenavContainer.classList.toggle("open");
})

//fetch API on search
searchbar.addEventListener('keypress', (e)=>{
  if(e.key === 'Enter' & searchbar.value !=''){
  
  const value = searchbar.value;
  fetchDataSearch(value);
  searchbar.value = ''
  title.innerHTML = `Top news related to "${value}"`
  }
})

searchbarOpen.addEventListener('click', ()=>{
if(searchbar.value != ''){
  const value = searchbar.value;
  fetchDataSearch(value);
  searchbar.value = ''
  title.innerHTML = `Top news related to "${value}"`
}
});

function fetchDataSearch(value){
  fetch('https://newsapi.org/v2/everything?q=' + value + '&language=en&pageSize=12&sortBy=popularity&apiKey=87e15d6c747c4558b1083376e977ff87')
  .then(res => {
      return res.json()
  })
  .then(data => {
      displayNews(data)
  })
  }

// fetch API for each element from header section clicked and get api for that category
sidenavElements.forEach(element => {
    element.addEventListener("click", () => {
      const category = element.innerHTML;
      fetchData(category);
      title.innerHTML = `TOP NEWS IN ${category}`
      sidenavContainer.classList.toggle("open");
    });
  });

function fetchData(category){
    
fetch('https://newsapi.org/v2/top-headlines?category=' + category + '&language=en&pageSize=12&sortBy=popularity&apiKey=87e15d6c747c4558b1083376e977ff87')
    .then(res => {
        return res.json()
    })
    .then(data => {
        displayNews(data)
    })

}

function fetchDataReload(){
  title.innerHTML = `GENERAL NEWS`
  fetch('https://newsapi.org/v2/top-headlines?category=general&language=en&pageSize=12&sortBy=popularity&apiKey=87e15d6c747c4558b1083376e977ff87')
      .then(res => {
          return res.json()
      })
      .then(data => {
          displayNews(data)
      })
  
  }


    function displayNews(data){
        newsSection.innerHTML = '';

        data.articles.forEach(item => {
            if (item.urlToImage === null) {
              // Skip articles without images
              return;
            } 
            const image = new Image();
            image.src = item.urlToImage;
            image.onload = () => {
              // Image loaded successfully
              const limitedDescription = item.description.substring(0, 140) + '...'; 
              newsSection.innerHTML += `
              <div class="news-grid">
              <img class="news-image" src="${item.urlToImage}" alt="" />
              <span class="author">${item.author}</span>
              <span class="news-title">${item.title}</span>
              <span class="news-description">${limitedDescription}</span>
              <a href="${item.url}" target="”_blank”" rel="noreferrer noopener">
                <div class="open-article">open article</div>
                <svg stroke="currentColor"fill="currentColor"stroke-width="0"viewBox="0 0 24 24"height="1em"width="1em"xmlns="http://www.w3.org/2000/svg"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg>
              </a>
            </div>
              `;
              
            };
            image.onerror = () => {
              // Image failed to load
              console.error(`Failed to load image: ${item.urlToImage}`);
            };
        })
      
    }
