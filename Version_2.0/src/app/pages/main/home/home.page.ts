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

  rutinas: Rutina[] = [];
  userId: string | null = null; 

  constructor(private firebaseSvc: FirebaseService, private utilScv: UtilsService) {}


  ngOnInit() {
    this.loadUserId();
    this.getRutinas(); // Llamar a la función para obtener rutinas
  }

  private loadUserId() {
    this.userId = localStorage.getItem('uid');
  }

  private async getRutinas() {
    if (!this.userId) {
      this.utilScv.presentToast({ message: 'Error: No se encontró el ID de usuario', duration: 3000 });
      return;
    }

    const dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    for (const dia of dias) {
      try {
        const actividades = await this.firebaseSvc.getRutinasDelDia(this.userId, dia);
        this.rutinas = [...this.rutinas, ...actividades]; // Agregar las actividades a la lista de rutinas
      } catch (error) {
        console.error(`Error al obtener rutinas del día ${dia}:`, error);
      }
    }
  }
  logout(){
    this.firebaseSvc.logout();
    console.log("Cerrando sesión");
    
  }


}

