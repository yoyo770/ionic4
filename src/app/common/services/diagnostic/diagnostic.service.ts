import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Platform } from '@ionic/angular';

export interface InfosDiagnosticGps {
  isGpsLocationAvailable?: boolean;
  isGpsLocationEnabled?: boolean;
  isLocationEnabled?: boolean;
  isLocationAuthorized?: boolean;
  locationAuthorizationStatus?: boolean;
  requestLocationAuthorization?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class DiagnosticService {
  public infosDiagnostic: InfosDiagnosticGps = {};

  constructor(
    private platform: Platform,
    private diagnostic: Diagnostic
  ) {

  }

}
