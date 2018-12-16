import { Component } from '@angular/core';
import { InfosGeoloc, GpsService, InfosDiagnosticGps } from '../common/services/gps/gps.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public infosGeoloc: InfosGeoloc = {};
  public infosDiagnosticGps: InfosDiagnosticGps = {};

  constructor(private gpsService: GpsService) {

     // Ecoute les coordonées GPS (longitude, latitude, timetamp de la dérniere mise a jour de position)
    this.gpsService.infosGeolocSubject.subscribe(
      (infosGeoloc: InfosGeoloc) => {
        this.infosGeoloc = infosGeoloc;
      });

    // Ecoute les changements de statut du GPS (GPS activé, gps désactivé, gps autorisé...)
    this.gpsService.infosDiagnosticGpsSubject.subscribe(
      (infosDiagnosticGps: InfosDiagnosticGps) => {
        this.infosDiagnosticGps = infosDiagnosticGps;
      });
  }

}
