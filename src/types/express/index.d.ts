import { findAuthorizedUserResponseDto } from '../../users/dto/find-authorized-user'; // Adjust the path as necessary

declare global {
  namespace Express {
    interface Request {
      user?: findAuthorizedUserResponseDto; // Specify the type for user
    }
  }
}
