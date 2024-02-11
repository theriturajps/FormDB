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

const adminForm = document.getElementById('adminForm');
const popup = document.getElementById('popup');
const message = document.getElementById('message');

// Function to open the popup
function openPopup() {
    const username = document.getElementById('adminUsername').value.trim();
    const code = document.getElementById('adminCode').value.trim();

    // Retrieve user data from database
    database.ref('users').orderByChild('username').equalTo(username).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val()[Object.keys(snapshot.val())[0]]; // Get first (and only) user matching the username
                if (userData.code === code) {
                    document.getElementById('adminName').value = userData.name;
                    document.getElementById('adminDOB').value = userData.dob;
                    document.getElementById('adminPhone').value = userData.phone;
                    document.getElementById('adminEmail').value = userData.email;
                    document.getElementById('adminEditCode').value = userData.code;
                    popup.style.display = 'block'; // Show the popup
                } else {
                    showMessage('Username or code not matched', 'red');
                }
            } else {
                showMessage('User not found', 'red');
            }
        })
        .catch((error) => {
            console.error(error);
            showMessage('Error retrieving user data', 'red');
        });
}


// Function to close the popup
function closePopup() {
    popup.style.display = 'none'; // Hide the popup
}

// Function to save changes to the database
function saveChanges() {
    const username = document.getElementById('adminUsername').value.trim();
    const name = document.getElementById('adminName').value.trim();
    const dob = document.getElementById('adminDOB').value;
    const phone = document.getElementById('adminPhone').value;
    const email = document.getElementById('adminEmail').value;
    const code = document.getElementById('adminEditCode').value;

    // Update user data in the database
    database.ref('users').orderByChild('username').equalTo(username).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userId = Object.keys(snapshot.val())[0]; // Get first (and only) user matching the username
                database.ref('users/' + userId).update({
                    name: name,
                    dob: dob,
                    phone: phone,
                    code: code,
                    email: email
                })
                    .then(() => {
                        showMessage('Changes saved successfully', 'green');
                        closePopup(); // Close the popup after saving changes
                    })
                    .catch((error) => {
                        console.error(error);
                        showMessage('Error saving changes', 'red');
                    });
            } else {
                showMessage('User not found', 'red');
            }
        })
        .catch((error) => {
            console.error(error);
            showMessage('Error updating user data', 'red');
        });
}

// Function to display message
function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}
