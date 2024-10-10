import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RutinaService } from 'src/app/services/rutina.service';
import { Rutina } from 'src/app/models/rutina.models';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebaseSvc=inject(FirebaseService)
  utilScv=inject(UtilsService)
  rutinas: Rutina[] = [];
  userId: string;


  constructor(private rutinaService: RutinaService) {}

  ngOnInit() {
    this.userId = localStorage.getItem('uid'); // Asegúrate de que el UID esté disponible
    this.cargarRutinas();
  }
  async cargarRutinas() {
    const dia = 'lunes'; // Puedes hacer esto dinámico si quieres
    try {
      this.rutinas = await this.firebaseSvc.getRutinasDelDia(this.userId, dia);
      console.log("Rutinas del día:", this.rutinas);
    } catch (error) {
      console.error('Error al cargar las rutinas:', error);
    }
  }
  logout(){
    this.firebaseSvc.logout();
    console.log("Cerrando sesión");
    
  }


}

