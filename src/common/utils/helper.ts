export const generatePassword = (): string => {
  const length = 12;
  const specialCharacters = "!@#$%^&*()_+[]{}|;:',.<>?/";
  const numbers = '0123456789';
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const allCharacters =
    specialCharacters + numbers + lowercaseLetters + uppercaseLetters;

  let password = '';

  // Ensure at least one special character
  password +=
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

  // Ensure at least one number
  password += numbers[Math.floor(Math.random() * numbers.length)];

  // Ensure at least one lowercase letter
  password +=
    lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];

  // Ensure at least one uppercase letter
  password +=
    uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];

  // Fill the rest of the password length
  for (let i = password.length; i < length; i++) {
    password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }

  // Shuffle the password to make it more random
  password = password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');

  return password;
};
