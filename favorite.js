const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const userList = JSON.parse(localStorage.getItem('favoriteUser')) || []

const cardContainer = document.querySelector("#user-container");
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderUserList(data) {
  let rawHTML = "";
  userList.forEach((item) => {
    rawHTML += `
    <div class="card">
    <img src="${item.avatar}" class="card-img-top" alt="user-img" data-id="${item.id}">
    <div class="card-body">
    <h5 class="card-title" data-id="${item.id}">${item.name} ${item.surname}</h5>
    </div>
    <div class="card-footer" id="footer">
    <button class="btn btn-show-user" data-bs-toggle="modal" data-bs-target="#user-modal" id="btn2" data-id="${item.id}">More</button>
    <button class="btn btn-remove-favorite" data-id="${item.id}"><i class="fa-solid fa-user-slash"></i></button>
  </div>
</div>`;
  });

  cardContainer.innerHTML = rawHTML;
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
        <p>Email:${data.email}</p>
        <p>Gender: ${data.gender}</p>
        <p>Age: ${data.age}</p>
        <p>Region: ${data.region}</p>
        <p>Birthday: ${data.birthday}</p>
        `;
    })
    .catch((error) => {
      console.log(error);
    });
}
function removeFormFavorite(id){
  if (!userList || !userList.length) return 
  // findIndex 回傳位置
  const userIndex = userList.findIndex((person) => person.id === id)
  if (userIndex === -1) return
  userList.splice(userIndex,1)
  localStorage.setItem('favoriteUser', JSON.stringify(userList))
  renderUserList(userList)
}

// modal addEventListener
cardContainer.addEventListener("click", function onContainerClicked(event) {
  if (event.target.matches(".btn-show-user")) {
    showUserModal(event.target.dataset.id);
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFormFavorite(Number(event.target.dataset.id))
  }
});
renderUserList(userList)