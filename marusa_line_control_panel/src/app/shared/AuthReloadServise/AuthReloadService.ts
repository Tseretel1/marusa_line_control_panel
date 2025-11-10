import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthReloadService {
  private alertSubject = new BehaviorSubject<boolean>(false);
  alert$ = this.alertSubject.asObservable();

  reafresh() {
    this.alertSubject.next(true);
  }
  hide() {
    this.alertSubject.next(false);
  }
}
