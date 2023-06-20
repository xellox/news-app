let openSidenav = document.querySelector(".sidenav-open")
let sidenavContainer = document.querySelector(".sidenav-container")

//toggle sidenavMenu on button
openSidenav.addEventListener("click", () => {

    sidenavContainer.classList.toggle("open");
})
