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

    if (noteTitle && noteText) {
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
      const title =
        target.parentElement.querySelector(".title-span").textContent;

      if (target.classList.contains("delete-button")) {
        deleteNoteFromLocalStorage(title);
        target.parentElement.remove();
      } else if (target.classList.contains("show-details-button")) {
        showNoteDetails(title);
      } else if (target.classList.contains("copy-button")) {
        copyNoteToClipboard(title);
      } else if (target.classList.contains("edit-button")) {
        editNote(title);
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
    titleSpan.classList.add("title-span");
    newTitle.appendChild(titleSpan);

    const showDetailsButton = createButton(
      "Show Details",
      "show-details-button",
    );
    const copyButton = createButton("Copy", "copy-button");
    const editButton = createButton("Edit", "edit-button");
    const deleteButton = createButton("Delete", "delete-button");

    newTitle.appendChild(showDetailsButton);
    newTitle.appendChild(copyButton);
    newTitle.appendChild(editButton);
    newTitle.appendChild(deleteButton);

    return newTitle;
  }

  function createButton(text, className) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(className);
    return button;
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

  function deleteNoteFromLocalStorage(title) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    const index = notes.findIndex((note) => note.title === title);

    if (index !== -1) {
      notes.splice(index, 1);
      localStorage.setItem("notes", JSON.stringify(notes));
      loadTitlesFromLocalStorage();
    }
  }

  function copyNoteToClipboard(title) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const selectedNote = notes.find((note) => note.title === title);

    if (selectedNote) {
      const textToCopy = `Title: ${selectedNote.title}\n\nText: ${selectedNote.text}`;
      copyToClipboard(textToCopy);
    }
  }

  function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    // You can add a notification or any other feedback here
    alert("Text copied to clipboard!");
  }

  function editNote(title) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const selectedNote = notes.find((note) => note.title === title);

    if (selectedNote) {
      // Set the current note values in the form for editing
      noteTitleInput.value = selectedNote.title;
      noteInput.value = selectedNote.text;

      // Delete the existing note
      deleteNoteFromLocalStorage(title);

      // Remove the note from the UI
      titlesList.innerHTML = "";

      // Load the updated list of notes
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
