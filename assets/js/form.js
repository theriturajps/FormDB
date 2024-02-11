// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDqohtI2EKavnWpcVBIb_mNvWHXnGRuQ_E",
  authDomain: "riturajps-form.firebaseapp.com",
  projectId: "riturajps-form",
  storageBucket: "riturajps-form.appspot.com",
  messagingSenderId: "901365843501",
  databaseURL: "https://riturajps-form-default-rtdb.firebaseio.com/",
  appId: "1:901365843501:web:5245ab6f33542c500b1aa4"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const usernameInput = document.getElementById('username');
const availabilitySpan = document.getElementById('availability');
const message = document.getElementById('message');

function checkUsernameAvailability() {
  let username = usernameInput.value.trim(); // Trim whitespace

  // Check username length and alphanumeric characters
  if (!isValidUsername(username)) {
    showMessage('Username must be 6 to 12 characters long, alphanumeric, and without leading or trailing spaces', 'brown');
    return; // Exit function to prevent further processing
  }

  // Check if username exists in database
  database.ref('users').orderByChild('username').equalTo(username).once('value')
    .then((snapshot) => {
      if (snapshot.exists()) {
        // Username exists, not available
        availabilitySpan.textContent = 'Not available';
        availabilitySpan.style.color = 'red';
      } else {
        // Username does not exist, available
        availabilitySpan.textContent = 'Available';
        availabilitySpan.style.color = 'green';
      }
    })
    .catch((error) => {
      console.error(error);
      availabilitySpan.textContent = 'Error checking availability';
      availabilitySpan.style.color = 'red';
    });
}

// Function to handle form submission
document.getElementById('myForm').addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent default form submission

  // Retrieve form values
  const name = document.getElementById('name').value.trim(); // Trim whitespace
  let username = document.getElementById('username').value.trim(); // Trim whitespace
  const dob = document.getElementById('dob').value;
  const phone = document.getElementById('phone').value;
  const file = document.getElementById('file').files[0];
  const email = document.getElementById('email').value;

  // Check if username is empty or contains non-alphanumeric characters
  if (!isValidUsername(username)) {
    showMessage('Username must be 6 to 12 characters long, alphanumeric, and without leading or trailing spaces', 'brown');
    return; // Exit function to prevent form submission
  }

  // Check if username already exists in database
  database.ref('users').orderByChild('username').equalTo(username).once('value')
    .then((snapshot) => {
      if (snapshot.exists()) {
        showMessage('Username not available', 'red');
      } else {
        // Generate a random 8-character code
        const code = generateRandomCode();

        // Save data to Firebase Realtime Database
        database.ref('users/' + code).set({
          name: name,
          username: username,
          dob: dob,
          phone: phone,
          email: email,
          code: code
        })
        .then(() => {
          // Save file to Firebase Storage
          const storageRef = firebase.storage().ref('files/' + code + '_' + file.name);
          storageRef.put(file);

          // Display success message
          showMessage(`Data saved successfully. Your code is: ${code}`, 'green');

          // Reset form
          document.getElementById('myForm').reset();
        })
        .catch((error) => {
          // Display error message
          showMessage(`Error: ${error.message}`, 'red');
        });
      }
    })
    .catch((error) => {
      console.error(error);
      showMessage('Error checking username availability', 'red');
    });
});

// Function to generate random 8-character code
function generateRandomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

// Function to display message
function showMessage(text, color) {
  message.textContent = text;
  message.style.color = color;
}

// Function to check if a username is valid (6 to 12 characters long, alphanumeric, and without leading or trailing spaces)
function isValidUsername(username) {
  return /^[a-zA-Z0-9]{6,12}$/.test(username);
}
