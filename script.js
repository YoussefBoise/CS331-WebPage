let commonPasswords = new Set();

async function loadCommonPasswords() {
  try {
    const response = await fetch("commonPasswords.txt");
    const text = await response.text();

    commonPasswords = new Set(
      text
        .split("\n")
        .map(line => line.trim().toLowerCase())
        .filter(line => line !== "")
    );
  } catch (error) {
    console.error("Could not load commonPasswords.txt:", error);
  }
}

function checkPasswordStrength(password) {
  const trimmedPassword = password.trim();
  const lowerPassword = trimmedPassword.toLowerCase();

  if (trimmedPassword === "") {
    return "Please enter a password.";
  }

  if (commonPasswords.has(lowerPassword)) {
    return "Not Strong: This password is too common.";
  }

  let score = 0;

  if (trimmedPassword.length >= 8) score++;
  if (/[A-Z]/.test(trimmedPassword)) score++;
  if (/[a-z]/.test(trimmedPassword)) score++;
  if (/[0-9]/.test(trimmedPassword)) score++;
  if (/[^A-Za-z0-9]/.test(trimmedPassword)) score++;

  if (trimmedPassword.length < 8) {
    return "Weak: Password is too short.";
  } else if (score <= 2) {
    return "Weak";
  } else if (score <= 4) {
    return "Moderate";
  } else {
    return "Strong";
  }
}

function testPassword() {
  const password = document.getElementById("passwordInput").value;
  const result = checkPasswordStrength(password);
  document.getElementById("result").textContent = result;
}

loadCommonPasswords();