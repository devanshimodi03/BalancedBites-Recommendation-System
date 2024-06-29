function toggleMenu() {
    var navbarLinks = document.getElementById("navbar-links");
    var toggleButton = document.querySelector(".toggle-button");
    if (navbarLinks.style.display === "flex") {
        navbarLinks.style.display = "none";
    } else {
        navbarLinks.style.display = "flex";
    }
    toggleButton.classList.toggle("active");
}

document.addEventListener('DOMContentLoaded', function() {
    const box1 = document.getElementById('calorie-tracker-box');
    box1.addEventListener('click', function() {
        fetch('/calorietracker')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Handle the response data as needed
                console.log(data);
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    });
    const box2 = document.getElementById('bmi-box');
    box2.addEventListener('click', function() {
        fetch('/bmicalc')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    });
});