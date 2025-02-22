
const form = document.querySelector(".edit-form");  // Edit Form
const checkboxes = document.querySelectorAll("input[name='listing[categories][]']");
const categoryFeedback = document.getElementById("category-feedback");

// console.log(checkboxes);

for (let category of listing.categories) {
    for (let checkbox of checkboxes) {
        if (category === checkbox.value) {
            checkbox.checked = true;
            break;
        }
    }
}


// Function Defination
function validateCheckboxes() {
    let isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

    if (isChecked) {
        categoryFeedback.style.display = "none";
        checkboxes.forEach(checkbox => {
            checkbox.classList.remove("is-invalid");

        });
    } else {
        categoryFeedback.style.display = "block";
        checkboxes.forEach(checkbox => {
            checkbox.classList.add("is-invalid");
        });
    }

    return isChecked;
}

// Adding Evenet Listener to the Form to check alteast one of them selected
form.addEventListener("submit", event => {
    if (!validateCheckboxes()) {
        event.preventDefault(); // Prevent submission only if validation fails
    }
});


// Adding Event Listener to all the checkboxes to validate checked or not
checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", validateCheckboxes);
});