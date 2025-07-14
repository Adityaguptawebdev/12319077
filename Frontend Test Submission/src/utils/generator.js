// Generate random short codes for URLs

function makeCode(usedCodes = []) {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let newCode = '';

  // Keep trying until we get a unique one
  do {
    newCode = '';
    // Make a 6 character code
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      newCode += letters[randomIndex];
    }
  } while (usedCodes.includes(newCode));

  return newCode;
}

export default makeCode;
