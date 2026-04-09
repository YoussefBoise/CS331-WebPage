async function generatePassword() {
    let length = parseInt(document.getElementById("length").value);
    const includeUppercase = document.getElementById("uppercase").checked;
    const includeLowercase = document.getElementById("lowercase").checked;
    const includeNumbers = document.getElementById("numbers").checked;
    const includeSymbols = document.getElementById("symbols").checked;
    const numberOfSpecial = parseInt(document.getElementById("numberOfSpecial").value);
    const repeatable = document.getElementById("repeatable").checked;

    let letterSet = [];
    let numberSet = [];
    let specialSet = [];
    
    if(includeUppercase){
        letterSet = letterSet.concat("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
    }
    if(includeLowercase){
        letterSet = letterSet.concat("abcdefghijklmnopqrstuvwxyz".split(""));
    }
    if(includeNumbers){
        numberSet = numberSet.concat("0123456789".split(""));
    }
    if(includeSymbols){
        specialSet = specialSet.concat("!@#$%^&*()-+".split(""));
    }

    const output = document.getElementById("generatedPassword");
    const allChars = letterSet.concat(numberSet, specialSet);

    if (!length || length < 1) {
        output.value = "Choose a valid password length.";
        return;
    }

    if (allChars.length === 0) {
        output.value = "Select at least one character type.";
        return;
    }

    let requiredSpecial = includeSymbols ? Math.max(0, numberOfSpecial || 0) : 0;
    if (requiredSpecial > length) {
        requiredSpecial = length;
    }

    if (!repeatable && length > allChars.length) {
        output.value = "Length is too large when repeatable is off.";
        return;
    }

    if (!repeatable && requiredSpecial > specialSet.length) {
        output.value = "Too many required special characters for non-repeatable mode.";
        return;
    }

    let passwordChars = [];
    let availableAll = allChars.slice();
    let availableSpecial = specialSet.slice();

    function takeRandomChar(sourceArray) {
        const index = Math.floor(Math.random() * sourceArray.length);
        const char = sourceArray[index];
        if (!repeatable) {
            sourceArray.splice(index, 1);
        }
        return char;
    }

    for (let i = 0; i < requiredSpecial; i++) {
        if (availableSpecial.length === 0) {
            output.value = "Not enough special characters available.";
            return;
        }
        const specialChar = takeRandomChar(availableSpecial);
        passwordChars.push(specialChar);

        if (!repeatable) {
            const usedIndex = availableAll.indexOf(specialChar);
            if (usedIndex !== -1) {
                availableAll.splice(usedIndex, 1);
            }
        }
    }

    while (passwordChars.length < length) {
        if (availableAll.length === 0) {
            output.value = "Could not complete password with current rules.";
            return;
        }
        passwordChars.push(takeRandomChar(availableAll));
    }

    for (let i = passwordChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = passwordChars[i];
        passwordChars[i] = passwordChars[j];
        passwordChars[j] = temp;
    }

    output.value = passwordChars.join("");
}
