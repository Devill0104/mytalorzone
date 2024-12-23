function setSearchAction(event) {
    // Get the search term from the input field
    const searchTerm = document.getElementById("searchInput").value.trim();

    // If search term is empty, we prevent the form submission
    if (!searchTerm) {
      event.preventDefault();
      alert("Please enter a search term.");
      return;
    }

    // Set the form's action URL dynamically to include the search term as a query parameter
    const form = event.target;  // The form that triggered the submit
    form.action = `/search?query=${encodeURIComponent(searchTerm)}`;
  }