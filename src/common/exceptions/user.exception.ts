export class UserException {
  static managerNotAdded(): string {
    return `Unable to add manager user.`;
  }

  static managerNotFound(): string {
    return `Unable to find managers.`;
  }

  static collectorsNotFound(): string {
    return `Unable to find collectors.`;
  }

  static collectorNotLogin(): string {
    return `Unable to login.`;
  }

  static userNotFoundWithUsername(userName: string): string {
    return `No user found for user name: ${userName}.`;
  }

  static unauthorized(): string {
    return `Invalid password.`;
  }
}
