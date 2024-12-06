document.getElementById('login-btn').addEventListener('click', function () {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    //usernames and passwords
    const validUsernames = ['admin', 'leenchante'];
    const validPasswords = ['admin', 'admin1', 'admin3', 'leenchante'];

    if (validUsernames.includes(username) && validPasswords.includes(password)) {
        window.location.href = "dashboard.html";
    } else {
        alert('Invalid username or password.');
    }
});
