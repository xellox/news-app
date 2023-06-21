
let openSidenav = document.querySelector(".sidenav-open")
let sidenavContainer = document.querySelector(".sidenav-container")
let newsSection = document.querySelector(".news-grid-wrapper")
let sidenavElements = document.querySelectorAll(".sidenav-elements")
let searchbar = document.querySelector(".searchbar-input")
let searchbarOpen = document.querySelector(".searchbar-open")

//toggle sidenavMenu on button
openSidenav.addEventListener("click", () => {
    sidenavContainer.classList.toggle("open");
})

searchbarOpen.addEventListener("click", () =>{
    searchbar.classList.toggle("open")
})

// replace tommorow comentarry
sidenavElements.forEach(element => {
    element.addEventListener("click", () => {
      const category = element.innerHTML;
      fetchData(category);
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
              newsSection.innerHTML += `
                <div class="news-grid">
                  <img class="news-image" src="${item.urlToImage}">
                  <span class="news-title">${item.title}</span>
                  <small class="news-description">${item.description}</small>
                </div>
              `;
              
            };
            image.onerror = () => {
              // Image failed to load
              console.error(`Failed to load image: ${item.urlToImage}`);
            };
        })
      
    }
