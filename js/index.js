
document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "http://localhost:3000/books";
  const user = { id: 1, username: "pouros" }; // Current user

  const bookList = document.getElementById("list");
  const showPanel = document.getElementById("show-panel");

  fetch(BASE_URL)
    .then((response) => response.json())
    .then((books) => {
      books.forEach((book) => {
        const li = document.createElement("li");
        li.textContent = book.title;
        li.addEventListener("click", () => showBookDetails(book));
        bookList.appendChild(li);
      });
    })
    .catch((error) => console.error("Error fetching books:", error));

  // Display book details in the #show-panel
  function showBookDetails(book) {
    showPanel.innerHTML = ""; // Clear previous details

    const title = document.createElement("h2");
    title.textContent = book.title;

    const img = document.createElement("img");
    img.src = book.thumbnail;

    const description = document.createElement("p");
    description.textContent = book.description;

    const usersList = document.createElement("ul");
    book.users.forEach((user) => {
      const userLi = document.createElement("li");
      userLi.textContent = user.username;
      usersList.appendChild(userLi);
    });

    const likeButton = document.createElement("button");
    likeButton.textContent = book.users.some((u) => u.id === user.id)
      ? "Unlike"
      : "Like";
    likeButton.addEventListener("click", () =>
      toggleLike(book, usersList, likeButton)
    );

    showPanel.append(title, img, description, usersList, likeButton);
  }

  // Toggle like/unlike functionality
  function toggleLike(book, usersList, likeButton) {
    const userIndex = book.users.findIndex((u) => u.id === user.id);

    if (userIndex === -1) {
      // User has not liked the book, add them
      book.users.push(user);
    } else {
      // User has already liked the book, remove them
      book.users.splice(userIndex, 1);
    }

    fetch(`${BASE_URL}/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users: book.users }),
    })
      .then((response) => response.json())
      .then((updatedBook) => {
        usersList.innerHTML = ""; // Clear current list of users
        updatedBook.users.forEach((user) => {
          const userLi = document.createElement("li");
          userLi.textContent = user.username;
          usersList.appendChild(userLi);
        });

        likeButton.textContent = updatedBook.users.some((u) => u.id === user.id)
          ? "Unlike"
          : "Like";
      })
      .catch((error) => console.error("Error updating likes:", error));
  }
});
