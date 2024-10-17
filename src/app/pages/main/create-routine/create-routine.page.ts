import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-create-routine',
  templateUrl: './create-routine.page.html',
  styleUrls: ['./create-routine.page.scss'],
})
export class CreateRoutinePage implements OnInit {
  routineForm: FormGroup;
  rutinasValidadas: any[] = []; // Almacenar actividades validadas

  constructor(
    private fb: FormBuilder,
    private firebaseSvc: FirebaseService,
    private utilScv: UtilsService
  ) {
    // Inicializa el formulario reactivo
    this.routineForm = this.fb.group({
      nombre_actividad: ['', Validators.required],
      dia: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Lógica adicional, si es necesario
  }

  // Botón para regresar
  volver() {
    this.utilScv.backnav();
  }

  // Método para enviar la rutina
  async validarActividades() {
    if (this.routineForm.valid) {
      const rutina = this.routineForm.value;
      const userId = localStorage.getItem('uid');
      const dia = rutina.dia;

      const rutinaValidada = {
        nombre_actividad: rutina.nombre_actividad,
        hora_inicio: rutina.hora_inicio.split('T')[1], // Extraer solo la parte de la hora
        hora_fin: rutina.hora_fin.split('T')[1],       // Extraer solo la parte de la hora
        dia: dia
      };      

      console.log("Datos de la rutina a validar:", rutinaValidada);

      if (!this.firebaseSvc.validarHoras(rutinaValidada.hora_inicio, rutinaValidada.hora_fin)) {
        this.utilScv.presentToast({ message: 'La hora de fin debe ser mayor que la hora de inicio', duration: 3000 });
        return;
      }

      try {
        const actividadesExistentes = await this.firebaseSvc.getRutinasDelDia(userId, dia);

        if (this.firebaseSvc.hayColision(actividadesExistentes, rutinaValidada.hora_inicio, rutinaValidada.hora_fin)) {
          this.utilScv.presentToast({ message: 'Ya existe una actividad que se solapa con esta', duration: 3000 });
          return;
        }

        // Si pasa todas las validaciones, agregar la rutina a la lista de actividades validadas
        this.rutinasValidadas.push(rutinaValidada);
        this.utilScv.presentToast({ message: 'Actividad validada correctamente', duration: 3000 });
      } catch (error) {
        this.utilScv.presentToast({ message: 'Error al validar actividades', duration: 3000 });
        console.error('Error al validar actividades:', error);
      }
    } else {
      this.utilScv.presentToast({ message: 'Por favor completa todos los campos', duration: 3000 });
    }
  }

  // Método para crear las actividades en Firebase después de validarlas
  async crearActividades() {
    if (this.rutinasValidadas.length === 0) {
      this.utilScv.presentToast({ message: 'Primero debes validar las actividades', duration: 3000 });
      return;
    }
  
    console.log("Rutinas validadas para guardar:", this.rutinasValidadas); // Añadir esta línea
  
    const userId = localStorage.getItem('uid');
    const dia = this.rutinasValidadas[0].dia;
  
    try {
      await this.firebaseSvc.guardarRutinasEnBloque(userId, this.rutinasValidadas);
      this.utilScv.presentToast({ message: 'Actividades creadas exitosamente', duration: 3000 });
      this.rutinasValidadas = [];
    } catch (error) {
      this.utilScv.presentToast({ message: 'Error al guardar actividades', duration: 3000 });
      console.error('Error al guardar actividades:', error);
    }
  }
  
  

}