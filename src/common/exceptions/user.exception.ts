export class UserException {
  static collectorNotFoundCnic(cnic: string): string {
    return `No collector found for CNIC: ${cnic}`;
  }

  static managerNotAdded(): string {
    return `Unable to add manager user.`;
  }

  static managerNotFound(): string {
    return `Unable to find managers.`;
  }

  static collectorsNotFound(): string {
    return `Unable to find collectors.`;
  }

  static userNotFoundWithUsername(userName: string): string {
    return `No user found for user name: ${userName}.`;
  }

  static unauthorized(): string {
    return `Invalid password.`;
  }
}
