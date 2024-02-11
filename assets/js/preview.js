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

function showPreview() {
  const username = document.getElementById('previewUsername').value.trim();
  const code = document.getElementById('previewCode').value.trim();

  // Clear previous error message
  document.getElementById('error').textContent = '';

  database.ref('users').orderByChild('username').equalTo(username).once('value')
    .then((snapshot) => {
      let isValid = false; // Flag to track if username and code are valid
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (userData.code === code) {
          isValid = true;
          const previewData = document.getElementById('previewData');
          previewData.innerHTML = `
            <p><strong>Name:</strong> ${userData.name}</p>
            <p><strong>Username:</strong> ${userData.username}</p>
            <p><strong>Date of Birth:</strong> ${userData.dob}</p>
            <p><strong>Phone Number:</strong> ${userData.phone}</p>
            <p><strong>Email:</strong> ${userData.email}</p>
          `;
          document.getElementById('previewPopup').style.display = 'block';
        }
      });
      // Show error message if username or code is invalid
      if (!isValid) {
        document.getElementById('error').textContent = 'Invalid username or code';
      }
    })
    .catch((error) => {
      console.error(error);
      alert('Error fetching data');
    });
}

function closePopup() {
  document.getElementById('previewPopup').style.display = 'none';
}