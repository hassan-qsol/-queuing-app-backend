import {
  TCollectorAuthorized,
  TUserAuthorized,
} from '../../users/dto/find-authorized-user'; // Adjust the path as necessary

declare global {
  namespace Express {
    interface Request {
      user?: TUserAuthorized;
      collector?: TCollectorAuthorized;
    }
  }
}
