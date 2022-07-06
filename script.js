const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const USERS_PER_PAGE = 20

const userList = [];
let filteredUser = []

const cardContainer = document.querySelector("#user-container");
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
    <div class="card">
    <img src="${item.avatar}" class="card-img-top" alt="user-img" data-id="${item.id}">
    <div class="card-body">
    <h5 class="card-title" data-id="${item.id}">${item.name} ${item.surname}</h5>
    <div class="scan"><i class="fa-solid fa-qrcode"></i> Scan To Follow</div>
    </div>
    <div class="card-footer" id="footer">
    <button class="btn btn-show-user" data-bs-toggle="modal" data-bs-target="#user-modal" id="btn2" data-id="${item.id}">Info</button>
    <button class="btn  btn-add-favorite" data-id="${item.id}"><i class="fa-solid fa-heart"></i></button>
  </div>
</div>`;
  });

  cardContainer.innerHTML = rawHTML;
}

function renderPaginator(amount){
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ''
  for(let page = 1;page <= numberOfPages; page++){
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function getUserByPage(page){
  const data = filteredUser.length ? filteredUser : userList

  const startPage = ( page - 1 )* USERS_PER_PAGE
  return data.slice(startPage, startPage + USERS_PER_PAGE)
}

function showUserModal(id) {
  const modalTitle = document.querySelector("#user-modal-title");
  const modalImg = document.querySelector(".modal-avatar");
  const modalUserInfo = document.querySelector(".modal-user-info");

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data;
      modalTitle.innerText = data.name + " " + data.surname;
      modalImg.src = data.avatar;
      modalUserInfo.innerHTML = `
        <p><i class="fa-solid fa-person"></i> ${data.gender}</p>
        <p><i class="fa-solid fa-envelope"></i> ${data.age}</p>
        <p><i class="fa-solid fa-location-pin"></i> ${data.region}</p>
        <p><i class="fa-solid fa-calendar-days"></i> ${data.birthday}</p>
        `;
    })
    .catch((error) => {
      console.log(error);
    });
}
//加入最愛函式
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUser')) || []
  const person = userList.find((person) => person.id === id)

  if (list.some((person) => person.id === id)){
    return alert('此使用者已在收藏清單中')
  }
  list.push(person)
  localStorage.setItem('favoriteUser',JSON.stringify(list))
  
}

// modal addEventListener
cardContainer.addEventListener("click", function onContainerClicked(event) {
  if (event.target.matches(".btn-show-user")) {
    showUserModal(event.target.dataset.id);
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
});

// paginator addEventListener
paginator.addEventListener('click', function onPaginatorClicked(event){
  if(event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  
  renderUserList(getUserByPage(page))
})


// submit addEventListener
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
 
  filteredUser = userList.filter(user =>
    user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword)
  )
  if(filteredUser.length === 0){
    return alert('找不到關鍵字：' + keyword)
  }
  renderPaginator(filteredUser.length)
  renderUserList(getUserByPage(1))
})

axios
  .get(INDEX_URL)
  .then((response) => {
    userList.push(...response.data.results);
    renderPaginator(userList.length)
    renderUserList(getUserByPage(1));
  })
  .catch((error) => {
    console.log(error);
  });