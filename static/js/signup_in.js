document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector(".container");
   
    window.toggleSignUpMode = () => {
        container.classList.add("sign-up-mode");
    };

    window.toggleSignInMode = () => {
        container.classList.remove("sign-up-mode");
    };

});
document.addEventListener("DOMContentLoaded", () => {
    const toggleSignInPassword = document.querySelector("#toggleSignInPassword");
    const signInPassword = document.querySelector("#signInPassword");
    const toggleSignUpPassword = document.querySelector("#toggleSignUpPassword");
    const signUpPassword = document.querySelector("#signUpPassword");
    const toggleConfirmPassword = document.querySelector("#toggleConfirmPassword");
    const confirmPassword = document.querySelector("#confirmPassword");
  
    toggleSignInPassword.addEventListener("click", function () {
      const type = signInPassword.getAttribute("type") === "password" ? "text" : "password";
      signInPassword.setAttribute("type", type);
      this.classList.toggle("fa-eye-slash");
    });
  
    toggleSignUpPassword.addEventListener("click", function () {
      const type = signUpPassword.getAttribute("type") === "password" ? "text" : "password";
      signUpPassword.setAttribute("type", type);
      this.classList.toggle("fa-eye-slash");
    });
  
    toggleConfirmPassword.addEventListener("click", function () {
      const type = confirmPassword.getAttribute("type") === "password" ? "text" : "password";
      confirmPassword.setAttribute("type", type);
      this.classList.toggle("fa-eye-slash");
    });
  });
  

// Check if passwords match
const passwordField = document.getElementById('signUpPassword');
const confirmPasswordField = document.getElementById('confirmPassword');
const passwordError = document.getElementById('passwordError');

function validatePasswords() {
  if (passwordField.value !== confirmPasswordField.value) {
    passwordError.style.display = 'block';
  } else {
    passwordError.style.display = 'none';
  }
}

passwordField.addEventListener('input', validatePasswords);
confirmPasswordField.addEventListener('input', validatePasswords);

// ##################################################################
let sentOTP = "";

    function fetchOTP(email,username,sendOtpButton) {
        fetch('/send_email_otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                username: username
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.error,
                });
                sendOtpButton.classList.remove('fa-spinner', 'fa-spin', 'fa-pulse');
                sendOtpButton.style.color = "red";
                sendOtpButton.classList.add('fa-exclamation');
                setTimeout(() => {
                    sendOtpButton.classList.remove('fa-exclamation');
                    sendOtpButton.style.color = "";
                    sendOtpButton.classList.add('fas', 'fa-paper-plane');
                }, 3000);
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'OTP Sent!',
                    text: 'Check your email for the OTP.',
                });
                sendOtpButton.classList.remove('fa-spinner', 'fa-spin', 'fa-pulse');
                sendOtpButton.style.color = "green";
                sendOtpButton.classList.add('fa-check');
                setTimeout(() => {
                    sendOtpButton.classList.remove('fa-check');
                    sendOtpButton.style.color = "";
                    sendOtpButton.classList.add('fas', 'fa-paper-plane');
                }, 3000);
                // Optionally, handle the OTP response
                console.log('OTP:', data.otp);
                sentOTP = data.otp;
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
            console.error('Error:', error);
            sendOtpButton.classList.remove('fa-spinner', 'fa-spin', 'fa-pulse');
            sendOtpButton.style.color = "red";
            sendOtpButton.classList.add('fa-exclamation');
            setTimeout(() => {
                sendOtpButton.classList.remove('fa-exclamation');
                sendOtpButton.style.color = "";
                sendOtpButton.classList.add('fas', 'fa-paper-plane');
            }, 3000);
        });
    }

        // Event listener for the Send OTP button
        document.getElementById('send-otp-btn').addEventListener('click', function() {
            const emailInput = document.getElementById('new-email');
            const usernameInput = document.getElementById('new-username');
            const email = emailInput.value.trim();
            const username = usernameInput.value.trim();
            const sendOtpButton = document.getElementById('send-otp-btn');
            const errorMessage = document.getElementById('error-message');

            if (email === "" || username === "") {
                errorMessage.textContent = "Username/Email field cannot be empty.";
                errorMessage.style.display = "block";
                errorMessage.style.color = "red";
                setTimeout(() => {
                    errorMessage.style.display = "none";
                }, 3000);
                sendOtpButton.className = '';
                sendOtpButton.classList.add('fas', 'fa-exclamation');
                sendOtpButton.style.color = "red";
                setTimeout(() => {
                    sendOtpButton.classList.remove('fa-exclamation');
                    sendOtpButton.style.color = "";
                    sendOtpButton.classList.add('fas', 'fa-paper-plane');
                }, 3000);
                console.log("Username/Email field cannot be empty.");
            } else {
                errorMessage.style.display = "none";
                fetchOTP(email, username, sendOtpButton);
                console.log("Sending Email...");
                sendOtpButton.classList.remove('fa-paper-plane');
                sendOtpButton.classList.add('fas', 'fa-spinner', 'fa-spin', 'fa-pulse');
                sendOtpButton.style.color = 'Black';
            }
        });


        document.getElementById('submit-otp-btn').addEventListener('click', function() {
            validateOTP();
        });
        
        function updateOtpStatus(userOTP) {
            fetch('/update_email_verified', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ otp: userOTP })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Email status updated:", data.success);
                    document.getElementById('new-username').disabled = true;
                    document.getElementById('new-email').disabled = true;
                    document.getElementById('user_otp').disabled = true;
                    displaySuccessMessage('Email Verified Successfully');
                } else {
                    displayErrorMessage(data.error || 'Error updating email status.');
                }
            })
            .catch(error => console.error('Error updating Email status:', error));
        }
        
        function validateOTP() {
            console.log("ValidateOTP Called")
            const userOTP = document.getElementById('user_otp').value;
            const errorMessage = document.getElementById('error-message');
            const submitOtpBtn = document.getElementById('submit-otp-btn');
        
            if (userOTP === "") {
                displayErrorMessage("OTP field cannot be empty.");
                submitOtpBtn.style.color = "red";
                setTimeout(() => {
                    errorMessage.style.display = "none";
                    submitOtpBtn.style.color = "";
                }, 5000);
            } else {
                updateOtpStatus(userOTP);
            }
        }
        
        function displayErrorMessage(message) {
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = message;
            errorMessage.style.display = "block";
            errorMessage.style.color = "red";
            Swal.fire({
                title: 'Error',
                html: `<div style="color:red;">${message}</div>`,
                icon: 'error',
                confirmButtonText: 'OK',
                width: '35%'
            });
            setTimeout(() => {
                errorMessage.style.display = "none";
            }, 5000);
        }
        
        function displaySuccessMessage(message) {
            const errorMessage = document.getElementById('error-message');
            const submitOtpBtn = document.getElementById('submit-otp-btn');
            errorMessage.textContent = message;
            errorMessage.style.color = "green";
            errorMessage.style.display = "block";
            submitOtpBtn.style.color = "green";
            Swal.fire({
                title: 'Success',
                html: `<div style="color:lightgreen;">${message}</div>`,
                icon: 'success',
                confirmButtonText: 'OK',
                width: '35%'
            });
            setTimeout(() => {
                errorMessage.style.display = "none";
            }, 5000);
        }

var myInput = document.getElementById("signUpPassword");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");

// When the user clicks on the password field, show the message box
myInput.onfocus = function() {
    document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
myInput.onblur = function() {
    document.getElementById("message").style.display = "none";
}

// When the user starts to type something inside the password field
myInput.onkeyup = function() {
    // Validate lowercase letters
    var lowerCaseLetters = /[a-z]/g;
    if(myInput.value.match(lowerCaseLetters)) {
    letter.classList.remove("invalid");
    letter.classList.add("valid");
    } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
}

    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if(myInput.value.match(upperCaseLetters)) {
    capital.classList.remove("invalid");
    capital.classList.add("valid");
    } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if(myInput.value.match(numbers)) {
    number.classList.remove("invalid");
    number.classList.add("valid");
    } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
    }

    // Validate length
    if(myInput.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
    } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
    }
}