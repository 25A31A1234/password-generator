// ============================================
// 1. GRAB ELEMENTS FROM THE PAGE
// ============================================

// The three number inputs
const lettersInput = document.getElementById("letters");
const numbersInput = document.getElementById("numbers");
const symbolsInput = document.getElementById("symbols");

// The buttons
const generateBtn = document.getElementById("generate-btn");
const copyBtn = document.getElementById("copy-btn");

// Where the password and messages will be shown
const passwordOutput = document.getElementById("password-output");
const messageEl = document.getElementById("message");


// ============================================
// 2. HELPER: SHOW A MESSAGE
// ============================================

// Show text below the buttons (error in red, success in green)
function showMessage(text, isSuccess = false) {
    messageEl.textContent = text;
    if (isSuccess) {
        messageEl.classList.add("success");
    } else {
        messageEl.classList.remove("success");
    }
}


// ============================================
// 3. HELPER: VALIDATE ONE INPUT
// ============================================

// Returns a non-negative integer, or null if the input is invalid
function getValidNumber(inputElement) {
    const raw = inputElement.value.trim();

    // Must not be empty
    if (raw === "") return null;

    // Convert to number
    const num = Number(raw);

    // Must be a whole, non-negative number
    if (!Number.isInteger(num) || num < 0) return null;

    return num;
}


// ============================================
// 4. GENERATE PASSWORD (CLICK HANDLER)
// ============================================

generateBtn.addEventListener("click", async () => {
    // Read and validate all three inputs
    const letters = getValidNumber(lettersInput);
    const numbers = getValidNumber(numbersInput);
    const symbols = getValidNumber(symbolsInput);

    // If any input is invalid, stop and show an error
    if (letters === null || numbers === null || symbols === null) {
        showMessage("Please enter valid non-negative whole numbers.");
        return;
    }

    // Optional: warn if everything is zero
    if (letters + numbers + symbols === 0) {
        showMessage("Please choose at least one character type.");
        return;
    }

    // Clear old message while we wait
    showMessage("");

    try {
        // Send POST request to Flask backend with the three values as JSON
        const response = await fetch("/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                letters: letters,
                numbers: numbers,
                symbols: symbols
            })
        });

        // Parse the JSON response from Flask
        const data = await response.json();

        // If the backend reported an error, show it
        if (!response.ok) {
            showMessage(data.error || "Something went wrong.");
            return;
        }

        // Display the generated password from the backend
        passwordOutput.textContent = data.password;
        showMessage("Password generated!", true);

    } catch (error) {
        // Handle network errors (e.g., Flask not running)
        showMessage("Could not reach the server. Please try again.");
    }
});


// ============================================
// 5. COPY PASSWORD (CLICK HANDLER)
// ============================================

copyBtn.addEventListener("click", async () => {
    const password = passwordOutput.textContent;

    // Don't copy placeholder / empty text
    if (!password || password === "Your password will appear here.") {
        showMessage("Nothing to copy yet. Generate a password first.");
        return;
    }

    try {
        // Modern clipboard API
        await navigator.clipboard.writeText(password);
        showMessage("Password copied!", true);
    } catch (error) {
        // Fallback for older browsers or blocked permissions
        showMessage("Could not copy. Please copy manually.");
    }
});