export class ServiceException {
  static serviceAlreadyExists(): string {
    return `A service with this name is already linked with the company! Please use a different name.`;
  }  
  static unableToAddService(): string {
    return `Unable to add the service.`;
  }  
  static servicesNotFound(): string {
    return `Services not found.`;
  }  
  static relevantDataNotFound(): string {
    return `Service not found.`;
  }  
  static inactiveUserCompany(): string {
    return `User or company is inactive.`;
  }  
}
