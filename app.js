document.addEventListener("DOMContentLoaded", function () {
  const noteForm = document.getElementById("noteForm");
  const noteTitleInput = document.getElementById("noteTitle");
  const noteInput = document.getElementById("noteInput");
  const titlesList = document.getElementById("titlesList");
  const searchInput = document.getElementById("searchInput");

  // Event listener for form submission
  noteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get the note title and text from the inputs
    const noteTitle = noteTitleInput.value.trim();
    const noteText = noteInput.value.trim();

    if (noteTitle !== "" && noteText !== "") {
      // Create a new title element
      const newTitle = document.createElement("div");
      newTitle.classList.add("title");
      newTitle.textContent = noteTitle;

      // Append the new title to the list
      titlesList.appendChild(newTitle);

      // Clear the input fields
      noteTitleInput.value = "";
      noteInput.value = "";

      // Save the note to local storage
      saveNoteToLocalStorage({ title: noteTitle, text: noteText });
    }
  });

  // Event listener for search input
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim().toLowerCase();
    filterTitles(searchTerm);
  });

  // Function to filter titles based on search term
  function filterTitles(searchTerm) {
    const titles = document.querySelectorAll(".title");

    titles.forEach(function (title) {
      const isMatch = title.textContent.toLowerCase().includes(searchTerm);

      // Show or hide titles based on the search term
      title.style.display = isMatch ? "block" : "none";
    });
  }

  // Event listener for title click
  titlesList.addEventListener("click", function (event) {
    const title = event.target;
    if (title.classList.contains("title")) {
      // Show detailed content for the clicked title
      showNoteDetails(title.textContent);
    }
  });

  // Function to show detailed content for a specific note
  function showNoteDetails(title) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const selectedNote = notes.find((note) => note.title === title);

    if (selectedNote) {
      alert(`Title: ${selectedNote.title}\n\nText: ${selectedNote.text}`);
    }
  }

  // Function to save note to local storage
  function saveNoteToLocalStorage(note) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));

    // Reload titles based on the updated list
    loadTitlesFromLocalStorage();
  }

  // Function to load titles from local storage
  function loadTitlesFromLocalStorage() {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    // Sort notes by title before displaying titles
    notes.sort((a, b) => a.title.localeCompare(b.title));

    // Clear existing titles
    titlesList.innerHTML = "";

    notes.forEach(function (note) {
      const newTitle = document.createElement("div");
      newTitle.classList.add("title");
      newTitle.textContent = note.title;
      titlesList.appendChild(newTitle);
    });
  }

  // Load existing titles from local storage on page load
  loadTitlesFromLocalStorage();
});
