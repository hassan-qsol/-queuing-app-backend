export class CollectorException {
  static collectorsNotFound(): string {
    return `Unable to find collectors.`;
  }

  static collectorNotLogin(): string {
    return `Unable to login.`;
  }
}
