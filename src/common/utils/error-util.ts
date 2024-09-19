import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  NotAcceptableException,
  RequestTimeoutException,
  ConflictException,
  GoneException,
  HttpVersionNotSupportedException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
  InternalServerErrorException,
  NotImplementedException,
  ImATeapotException,
  MethodNotAllowedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
  PreconditionFailedException,
} from '@nestjs/common';

export class ErrorUtil {
  static badRequest(error: string): never {
    throw new BadRequestException(error);
  }

  static unauthorized(error: string): never {
    throw new UnauthorizedException(error);
  }

  static forbidden(error: string): never {
    throw new ForbiddenException(error);
  }

  static notFound(error: string): never {
    throw new NotFoundException(error);
  }

  static notAcceptable(error: string): never {
    throw new NotAcceptableException(error);
  }

  static requestTimeout(error: string): never {
    throw new RequestTimeoutException(error);
  }

  static conflict(error: string): never {
    throw new ConflictException(error);
  }

  static gone(error: string): never {
    throw new GoneException(error);
  }

  static httpVersionNotSupported(error: string): never {
    throw new HttpVersionNotSupportedException(error);
  }

  static payloadTooLarge(error: string): never {
    throw new PayloadTooLargeException(error);
  }

  static unsupportedMediaType(error: string): never {
    throw new UnsupportedMediaTypeException(error);
  }

  static unprocessableEntity(error: string): never {
    throw new UnprocessableEntityException(error);
  }

  static internalServerError(error: string): never {
    throw new InternalServerErrorException(error);
  }

  static notImplemented(error: string): never {
    throw new NotImplementedException(error);
  }

  static imATeapot(error: string): never {
    throw new ImATeapotException(error);
  }

  static methodNotAllowed(error: string): never {
    throw new MethodNotAllowedException(error);
  }

  static badGateway(error: string): never {
    throw new BadGatewayException(error);
  }

  static serviceUnavailable(error: string): never {
    throw new ServiceUnavailableException(error);
  }

  static gatewayTimeout(error: string): never {
    throw new GatewayTimeoutException(error);
  }

  static preconditionFailed(error: string): never {
    throw new PreconditionFailedException(error);
  }
}
