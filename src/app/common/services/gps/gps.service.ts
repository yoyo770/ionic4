import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Observable, Observer, BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';


export interface InfosGeoloc {
  longitude?: number;
  latitude?: number;
  timetampLastUpdatePosition?: number;
}

export interface InfosDiagnosticGps {
  isGpsLocationAvailable?: boolean;
  isGpsLocationEnabled?: string;
  isLocationEnabled?: boolean;
  isLocationAuthorized?: boolean;
  locationAuthorizationStatus?: boolean;
  requestLocationAuthorization?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GpsService {
  private infosGeoloc: InfosGeoloc = {};
  private infosDiagnosticGps: InfosDiagnosticGps = {};

  public infosGeolocSubject: BehaviorSubject<InfosGeoloc> = new BehaviorSubject({});
  public infosDiagnosticGpsSubject: BehaviorSubject<InfosDiagnosticGps> = new BehaviorSubject({});

  private subscriptionGeoloc: Observable<Geoposition> = null;

  constructor(
    private platform: Platform,
    private geolocation: Geolocation,
    private diagnostic: Diagnostic,
  ) {

    this.platform.ready().then(
      () => {
        this.getDiagnosticLocation();
        // A chaque changement de statut du GPS (désactivé les droits du GPS, désactivé le GPS...)
        this.diagnostic.registerLocationStateChangeHandler(() => {
          this.getDiagnosticLocation();
          console.log(this.infosGeoloc);
        });

      });

  }

  public watchGps() {
    if (
      this.infosDiagnosticGps.isLocationEnabled && // localistion activé
      this.infosDiagnosticGps.requestLocationAuthorization === 'GRANTED' && // ocalistion autorisé
      !this.subscriptionGeoloc // Jamais souscris a la position
    ) {
      console.log('watch');
      this.subscriptionGeoloc = this.geolocation.watchPosition();
      this.subscriptionGeoloc.subscribe(

        (position: Geoposition) => {
          console.log('subscriptionGeoloc next');
          if (position.coords !== undefined) {
            this.infosGeoloc.latitude = position.coords.latitude;
            this.infosGeoloc.longitude = position.coords.longitude;
          }
          this.infosGeoloc.timetampLastUpdatePosition = position.timestamp;
          this.infosGeolocSubject.next(this.infosGeoloc);
        },
        (error: PositionError) => {
          this.subscriptionGeoloc = null;
          console.log('subscriptionGeoloc error');
        },
        () => {
          console.log('subscriptionGeoloc complete');
        }
      );
    }
  }

  public getDiagnosticLocation() {

    // Vérifie si le GPS haute précision est disponible (Android uniquement)
    this.diagnostic.isGpsLocationAvailable().then(
      (isGpsLocationAvailable: boolean) => {
        this.infosDiagnosticGps.isGpsLocationAvailable = isGpsLocationAvailable;
        this.infosDiagnosticGpsSubject.next(this.infosDiagnosticGps);
        this.watchGps();
      });

    // Vérifie si le GPS haute précision est activé (Android uniquement)
    this.diagnostic.isGpsLocationEnabled().then(
      (isGpsLocationEnabled: string) => {
        this.infosDiagnosticGps.isGpsLocationEnabled = isGpsLocationEnabled;
        this.infosDiagnosticGpsSubject.next(this.infosDiagnosticGps);
        this.watchGps();
      });

    // Vérifie si le service de géoloc est activé (Android, iOS)
    this.diagnostic.isLocationEnabled().then(
      (isLocationEnabled: boolean) => {
        this.infosDiagnosticGps.isLocationEnabled = isLocationEnabled;
        this.infosDiagnosticGpsSubject.next(this.infosDiagnosticGps);
        this.watchGps();
      });

    // Vérifie si l'application est autorisée à utiliser l'emplacement.
    /** ATTENTION
     * (Note pour Android: ceci est destiné à Android 6 / API 23 et supérieur.
     * L'appel sur Android 5 / API 22 et inférieur renverra toujours le statut GRANTED
     * car les autorisations sont déjà accordées au moment de l'installation.)
     */
    this.diagnostic.isLocationAuthorized().then(
      (isLocationAuthorized: boolean) => {
        this.infosDiagnosticGps.isLocationAuthorized = isLocationAuthorized;
        this.infosDiagnosticGpsSubject.next(this.infosDiagnosticGps);
        this.watchGps();
      });

    // Demande les droits de localisation (modal système)
    this.diagnostic.requestLocationAuthorization().then(
      (requestLocationAuthorization: string) => {
        this.infosDiagnosticGps.requestLocationAuthorization = requestLocationAuthorization;
        this.infosDiagnosticGpsSubject.next(this.infosDiagnosticGps);
        this.watchGps();
      });

    // Renvoie le statut d'autorisation d'emplacement pour l'application. (Android ,iOS)
    this.diagnostic.getLocationAuthorizationStatus().then(
      (locationAuthorizationStatus: boolean) => {
        this.infosDiagnosticGps.locationAuthorizationStatus = locationAuthorizationStatus;
        this.infosDiagnosticGpsSubject.next(this.infosDiagnosticGps);
        this.watchGps();
      });
  }

  openSettingsGps() {
    this.diagnostic.switchToLocationSettings();
  }
}
