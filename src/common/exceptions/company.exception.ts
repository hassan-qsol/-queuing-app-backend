export class CompanyException {
  static managerAlreadyLinked(): string {
    return `Manager is already linked with a company! Please select other manager.`;
  } 
  static companyNameAlreadyExists(): string {
    return `Company name already exists! Please try a different one.`;
  }
  static companyNotFound(): string {
    return `Companies not found.`;
  }

  static unableToAddCompany(): string {
    return `Unable to add company.`;
  } 
}
