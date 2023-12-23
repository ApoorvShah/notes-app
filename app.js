document.addEventListener("DOMContentLoaded", function () {
  const noteForm = document.getElementById("noteForm");
  const noteTitleInput = document.getElementById("noteTitle");
  const noteInput = document.getElementById("noteInput");
  const titlesList = document.getElementById("titlesList");
  const searchInput = document.getElementById("searchInput");
  const clearAllButton = document.getElementById("clearAllButton");
  clearAllButton.addEventListener("click", function () {
    // Clear all notes from local storage
    clearAllNotes();
    // Clear the titlesList on the page
    titlesList.innerHTML = "";
  });
  noteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const noteTitle = noteTitleInput.value.trim();
    const noteText = noteInput.value.trim();

    if (noteTitle !== "" && noteText !== "") {
      const newTitle = createNoteElement(noteTitle);
      titlesList.appendChild(newTitle);

      noteTitleInput.value = "";
      noteInput.value = "";

      saveNoteToLocalStorage({ title: noteTitle, text: noteText });
    }
  });

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim().toLowerCase();
    filterTitles(searchTerm);
  });

  titlesList.addEventListener("click", function (event) {
    const target = event.target;

    if (target.tagName === "BUTTON") {
      if (target.classList.contains("delete-button")) {
        const title = target.previousSibling.textContent;
        console.log(title)
        deleteNoteFromLocalStorage(title);
        target.parentElement.remove();
      } else if (target.classList.contains("show-details-button")) {
        showNoteDetails(target.previousSibling.textContent);
      }
    } else if (target.classList.contains("title")) {
      showNoteDetails(target.textContent);
    }
  });

  function createNoteElement(title) {
    const newTitle = document.createElement("div");
    newTitle.classList.add("title");

    const titleSpan = document.createElement("span");
    titleSpan.textContent = title;
    newTitle.appendChild(titleSpan);

    const showDetailsButton = document.createElement("button");
    showDetailsButton.textContent = "Show Details";
    showDetailsButton.classList.add("show-details-button");
    newTitle.appendChild(showDetailsButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    newTitle.appendChild(deleteButton);

    return newTitle;
  }

  function filterTitles(searchTerm) {
    const titles = document.querySelectorAll(".title");

    titles.forEach(function (title) {
      const isMatch = title.textContent.toLowerCase().includes(searchTerm);
      title.style.display = isMatch ? "block" : "none";
    });
  }

  function showNoteDetails(title) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const selectedNote = notes.find((note) => note.title === title);

    if (selectedNote) {
      alert(`Title: ${selectedNote.title}\n\nText: ${selectedNote.text}`);
    }
  }

  function saveNoteToLocalStorage(note) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));

    loadTitlesFromLocalStorage();
  }

  // Function to delete note from local storage
  function deleteNoteFromLocalStorage(title) {
    console.log(title)
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    console.log(notes)
    const index = notes.findIndex((note) => note.title === title);
    console.log(index)
    if (index !== -1) {
      notes.splice(index, 1);
      localStorage.setItem("notes", JSON.stringify(notes));
      loadTitlesFromLocalStorage();
    }
  }

  function clearAllNotes() {
    localStorage.removeItem("notes");
  }

  function loadTitlesFromLocalStorage() {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    notes.sort((a, b) => a.title.localeCompare(b.title));

    titlesList.innerHTML = "";

    notes.forEach(function (note) {
      const newTitle = createNoteElement(note.title);
      titlesList.appendChild(newTitle);
    });
  }

  loadTitlesFromLocalStorage();
});
