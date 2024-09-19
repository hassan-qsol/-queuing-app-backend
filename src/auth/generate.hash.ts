export class GeneratePasswordCLass {
  shuffleString(input: string): string {
    return input
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }

  generatePassword(lastName: string = ''): string {
    const chars = '0123456789';
    const allChars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const lastNameLength = lastName.length;

    if (lastName !== '') {
      if (lastNameLength === 5) {
        const shuffledChars = this.shuffleString(chars).substring(0, 3);
        return lastName + shuffledChars;
      } else if (lastNameLength < 5) {
        const remainingChars = 8 - lastNameLength;
        const shuffledChars = this.shuffleString(chars).substring(
          0,
          remainingChars,
        );
        return lastName + shuffledChars;
      } else {
        const shuffledChars = this.shuffleString(chars).substring(0, 3);
        return lastName + shuffledChars;
      }
    }

    return this.shuffleString(allChars).substring(0, 8);
  }

  makeUsername(name: string) {
    // Trim the name, convert to lowercase, and replace all spaces with an empty name
    name = name.trim().toLowerCase().replace(/\s+/g, '');
    // Remove all non-alphanumeric characters
    return name.replace(/[^a-z0-9-]/g, '');
  }
}
