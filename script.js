const para = document.getElementById("para");

// APIs Function
async function fetchingAPI() {
  try {
    const res = await fetch(" https://api.freeapi.app/api/v1/public/books");
    const resData = await res.json();
    let data = resData.data.data;
    bookPagination(data);
    return data;
  } catch (error) {
    console.log("ERROR:", error);
  }
}

// search Filter Function
function searchFilter() {
  const searchFilter = document.getElementById("search-filter");
  searchFilter.addEventListener("input", async (e) => {
    let val = e.target.value.toLowerCase();
    let data = await fetchingAPI();
    let bookData = data.filter((info) => {
      let title = info.volumeInfo.title.toLowerCase();
      let author = info.volumeInfo.authors.join(",").toLowerCase();
      return title.includes(val) || author.includes(val);
    });
    bookDetails(bookData);
  });
}

// Sort

async function bookSort(data) {
  if(data == null || data == undefined) return 

  const selectSort = document.getElementById("sort");

  selectSort.addEventListener("change", async (e) => {
    let sortedBooks = [...data]

    if (e.target.value === "asc") {
      sortedBooks.sort((a, b) =>
        a.volumeInfo.title.localeCompare(b.volumeInfo.title)
      );
    } else {
      sortedBooks.sort(
        (a, b) =>
          new Date(a.volumeInfo.publishedDate) -
          new Date(b.volumeInfo.publishedDate)
      );
    }

    bookDetails(sortedBooks);
  });
}

// Pagination
function bookPagination(data) {
  if(data == null || data == undefined) return 

  const pageChange = document.getElementById("page-changer");
  const pageList = pageChange.querySelector("ul");
  const prevBtn = pageChange.querySelector("button:first-child");
  const nextBtn = pageChange.querySelector("button:last-child");


  let itemsPerPage = 5;
  let pageValue = 1;
  let totalPages = Math.ceil(data.length / itemsPerPage);

  pageList.innerHTML = ""; 
  for (let i = 1; i <= totalPages; i++) {
    let li = document.createElement("li");
    li.textContent = i;
    pageList.appendChild(li);
  }

  let pageNumbers = pageList.querySelectorAll("li");

  function loadBooks(page = 1) {
    let startIndex = (page - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    let bookData = data.slice(startIndex, endIndex);

    bookDetails(bookData);
    updateActivePage(page);
    bookSort(bookData)
  }

  function updateActivePage(currentPage) {
    pageNumbers.forEach((li) => li.classList.remove("active"));
    if (pageNumbers[currentPage - 1]) {
      pageNumbers[currentPage - 1].classList.add("active");
    }

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  loadBooks();

  pageChange.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      pageValue = parseInt(e.target.textContent);
      loadBooks(pageValue);
    } else if (e.target.textContent === "prev" && pageValue > 1) {
      loadBooks(--pageValue);
    } else if (e.target.textContent === "next" && pageValue < totalPages) {
      loadBooks(++pageValue);
    }
  });
}


// Display Function
async function bookDetails(data) {
    if(data == null || data == undefined) return 

  const list = document.getElementById("list-btn");
  const grid = document.getElementById("grid-btn");

  // grid Implementation
  grid.addEventListener("click", () => {
    para.classList.replace("list-container", "grid-container");
    grid.classList.add("active-view");
    list.classList.remove("active-view");
  });

  // list Implementation
  list.addEventListener("click", () => {
    para.classList.replace("grid-container", "list-container");
    list.classList.add("active-view");
    grid.classList.remove("active-view");
  });

  para.innerHTML = "";
  para.innerHTML = `
        ${data
          ?.map(
            (info) =>
              `   <div class="book-card">
                    <img class="thumbnail" src="${
                      info.volumeInfo.imageLinks?.thumbnail
                    }" alt="Book Thumbnail">
                    <div class="book-info">
                        <div class="title">${info.volumeInfo.title}</div>
                        <div class="author">Author: ${info.volumeInfo.authors.map(
                          (d) => d
                        )}</div>
                        <div class="publisher">Publisher: ${
                          info.volumeInfo.publisher || "Unknown"
                        }</div>
                        <div class="published-date">Published: ${
                          info.volumeInfo.publishedDate || "N/A"
                        }</div>
                        <a href=${
                          info.volumeInfo.infoLink
                        } target = "_blank" class="info-button">More Info</a>
                    </div>
                </div>
            `
          )
          .join(" ")}`;
}

// Calling function
function invokeFunction() {
  fetchingAPI();
  searchFilter();
  bookSort();
}

invokeFunction();
