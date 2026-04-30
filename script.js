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

  let score = 0;

  let penalty = 1;

  if(commonPasswords.has(lowerPassword)) {
    return "Weak: Password is a common password.";
  }

  for (const common of commonPasswords) {
    if (lowerPassword.includes(common)) {
      score -= penalty;
      penalty -= .1;
      if(penalty <= 0) {
        break;
      }
    }
  }

  score += (trimmedPassword.length - 8) / 2.3;
  if (/[A-Z]/.test(trimmedPassword)) score += 1.25;
  if (/[a-z]/.test(trimmedPassword)) score += 1.25;
  if (/[0-9]/.test(trimmedPassword)) score += 1.25;
  if (/[^A-Za-z0-9]/.test(trimmedPassword)) score += 1.25;

  if (trimmedPassword.length < 8) {
    return "Weak: Password is too short.";
  } else if (score <= 4) {
    return "Weak";
  } else if (score <= 6) {
    return "Moderate";
  } else {
    return "Strong";
  }
}

function testPassword() {
  const password = document.getElementById("passwordInput").value;
  const result = checkPasswordStrength(password);
  document.getElementById("strengthResult").textContent = result;
}

loadCommonPasswords();