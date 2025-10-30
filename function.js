// Blur amount function
function toggleMoney(){
    let balance = document.getElementById("balance");
    if(balance.style.filter === "blur(10px)") {
        balance.style.filter = "blur(0px)"
    }else{
        balance.style.filter = "blur(10px)";
    }
}




// Register User
function registerUser() {
    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const message = document.getElementById("message");


    if (!username || !password) {
        message.textContent = "Please fill all fields.";
        message.style.color = "red";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.username === username)) {
        message.textContent = "Username already exist!"
        message.style.color = "red";
        return;
    }

    users.push({ username, password, balance: 5000 })
    localStorage.setItem("users", JSON.stringify(users));

    message.textContent = "Registration successful! You can now Login.";
    message.style.color = "green";
    document.getElementById("regUsername").value = "";
    document.getElementById("regPassword").value = "";


}


// Login 
function loginUser() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const message = document.getElementById("message");



    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username && u.password === password);



    if (!user) {
        message.textContent = "invalid username or password";
        message.style.color = "red";
        return;
    }


    localStorage.setItem("currentUser", username);
    window.location.href = "homepage.html"
}




// Dashboard Logic
if (window.location.pathname.includes("homepage.html")) {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        window.location.href = "index.html";
    }


    const balanceEl = document.getElementById("balance");
    const userEl = document.getElementById("currentUser");
    const receiverSelect = document.getElementById("receiver");
    const message = document.getElementById("message");




    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.username === currentUser);


    userEl.textContent = currentUser;
    balanceEl.textContent = user.balance;


    // Populate receivers
    users.filter(u => u.username !== currentUser).forEach(u => {
        const option = document.createElement("option");
        option.value = u.username;
        option.textContent = u.username;
        receiverSelect.appendChild(option);
    });

    document.getElementById("sendBtn").addEventListener("click", () => {
        const receiver = receiverSelect.value;
        const amount = parseFloat(document.getElementById("amount").value);

        if (!receiver || !amount || amount < 0) {
            message.textContent = "Please enter a valid amount and receiver.";
            message.style.color = "red";
            return
        }

        if (user.balance < amount) {
            message.textContent = "Insufficient balance";
            message.style.color = "red";
            return
        }


        // Update balances
        const receiverUser = users.find(u => u.username === receiver);
        user.balance -= amount;
        receiverUser.balance += amount;



        // save back to localStorage
        localStorage.setItem("users", JSON.stringify(users));



        // update UI
        balanceEl.textContent = user.balance;
        message.textContent = `N ${amount} sent to ${receiver} successfully!`;
        message.style.color = "green"
        document.getElementById("amount").value = "";
    });




    // Logoout function
    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
    })



}
