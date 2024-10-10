import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-create-routine',
  templateUrl: './create-routine.page.html',
  styleUrls: ['./create-routine.page.scss'],
})
export class CreateRoutinePage  {
  routineForm: FormGroup;

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


  // Botón para regresar
  volver() {
    this.utilScv.backnav();
  }

  // Método para enviar la rutina
  async enviar_rutina() {
    if (this.routineForm.valid) {
      const rutina = this.routineForm.value;
      const userId = localStorage.getItem('uid');
      const dia = rutina.dia;

      // Definir el objeto 'rutinaActualizada'
      const rutinaActualizada = {
        nombre_actividad: rutina.nombre_actividad,
        hora_inicio: rutina.hora_inicio.split('T')[1], // Extraer solo la parte de la hora
        hora_fin: rutina.hora_fin.split('T')[1],       // Extraer solo la parte de la hora
        dia: dia
      };

      console.log("Datos de la rutina:", rutinaActualizada);

      // Verificar que no haya campos vacíos
      if (!rutinaActualizada.hora_inicio || !rutinaActualizada.hora_fin) {
        this.utilScv.presentToast({ message: 'Hora de inicio o fin no puede estar vacío', duration: 3000 });
        return; // Detener si hay campos vacíos
      }

      // Validar que la hora de fin sea mayor que la de inicio
      if (!this.validarHoras(rutinaActualizada.hora_inicio, rutinaActualizada.hora_fin)) {
        this.utilScv.presentToast({ message: 'La hora de fin debe ser mayor que la hora de inicio', duration: 3000 });
        return; // Detener si la validación falla
      }

      // Verificar si existe alguna actividad en el mismo día que se solape
      try {
        const actividades: any[] = await this.firebaseSvc.getRutinasDelDia(userId, dia);
        console.log("Actividades existentes en el día:", actividades);

        if (this.hayColision(actividades, rutinaActualizada.hora_inicio, rutinaActualizada.hora_fin)) {
          this.utilScv.presentToast({ message: 'Ya existe una actividad en este rango de tiempo', duration: 3000 });
          return; // Detener si hay colisión
        }

        // Si no hay colisión, proceder a guardar la nueva rutina
        console.log("Guardando rutina en Firestore:", rutinaActualizada);
        await this.firebaseSvc.guardarRutina(userId, dia, rutinaActualizada);
        this.utilScv.presentToast({ message: 'Actividad creada exitosamente', duration: 3000 });
      } catch (error) {
        this.utilScv.presentToast({ message: 'Error al obtener actividades del día', duration: 3000 });
        console.error('Error al obtener rutinas del día:', error);
      }
    } else {
      this.utilScv.presentToast({ message: 'Por favor completa todos los campos', duration: 3000 });
    }
  }

  // Función para validar que la hora de fin sea mayor que la de inicio
  private validarHoras(horaInicio: string, horaFin: string): boolean {
    const minutosInicio = this.convertirHoraAMinutos(horaInicio);
    const minutosFin = this.convertirHoraAMinutos(horaFin);
    return minutosFin > minutosInicio;
  }

  // Función para convertir la hora (HH:mm:ss) a minutos totales desde medianoche
  private convertirHoraAMinutos(hora: string): number {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
  }

  // Método para verificar colisiones de horarios
  private hayColision(actividades: any[], nuevaHoraInicio: string, nuevaHoraFin: string): boolean {
    const minutosInicio = this.convertirHoraAMinutos(nuevaHoraInicio);
    const minutosFin = this.convertirHoraAMinutos(nuevaHoraFin);

    return actividades.some((actividad) => {
      const actividadInicio = this.convertirHoraAMinutos(actividad.hora_inicio);
      const actividadFin = this.convertirHoraAMinutos(actividad.hora_fin);
      return (minutosInicio < actividadFin && minutosFin > actividadInicio);
    });
  }
}
