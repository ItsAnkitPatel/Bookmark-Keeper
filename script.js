const modal = document.querySelector("#modal");
const modalShow = document.querySelector("#show-modal");
const modalClose = document.querySelector("#close-modal");
const bookmarkForm = document.querySelector("#bookmark-form");
const websiteNameEl = document.querySelector("#website-name");
const websiteUrlEl = document.querySelector("#website-url");
const bookmarksContainer = document.querySelector("#bookmarks-container");

let bookmarks = {};

// Show Modal, Focus on Input
function showModal() {
  modal.classList.remove("fadeout-modal");
  modal.classList.add("show-modal");
  websiteNameEl.focus();
}

function closeModal() {
  modal.classList.add("fadeout-modal");
  setTimeout(() => {
    modal.classList.remove("show-modal");
  }, 1000);
}
// Modal Event Listeners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Validate the form
function validate(nameValue, urlValue) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields.");
    return false;
  }
  if (!urlValue.match(regex)) {
    alert("Please provide a valid web address");
  }
  // Valid
  return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
  bookmarksContainer.textContent = "";
  Object.keys(bookmarks).forEach((id) => {
    const { name, url } = bookmarks[id];
    // Item
    const item = document.createElement("div");
    item.classList.add("item");

    // Close Icon
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-trash");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);
    // Link Container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");

    // Favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://www.google.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");

    // Link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;

    // Append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

// Delete Bookmark
function deleteBookmark(id) {
  if (bookmarks[id]) {
    delete bookmarks[id];
  }
  // Update bookmarks array in localStorage and re-populate the DOM
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  buildBookmarks();
}

// fetch bookmarks
function fetchBookmarks() {
  // Get bookmarks from localStorage if they are available
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    // create an array in the localStorage
    const id = `https://github.com/itsankitpatel`;
    bookmarks[id] = {
      name: `Ankit's Github`,
      url: `https://github.com/itsankitpatel`,
    };
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

// Handle data from form
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!nameValue.includes("http://") || !urlValue.includes("https://")) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks[urlValue] = bookmark;
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}
// Event Listener
bookmarkForm.addEventListener("submit", storeBookmark);

// On load, fetch bookmarks
fetchBookmarks();
