import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { AuthUserService } from "./auth.user.service";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public userService: AuthUserService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.headers.get("anonymous-request") != undefined) {
      request = request.clone({});
    } else {
      request = request.clone({
        setHeaders: {
          Authorization: this.userService.getToken(),
        },
      });
    }
    return next.handle(request);
  }
}
