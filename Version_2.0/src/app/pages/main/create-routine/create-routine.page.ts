import { Component, Inject, inject, OnInit } from '@angular/core';
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
  firebaseSvc = inject(FirebaseService);
  utilScv=inject(UtilsService)

  constructor(private fb: FormBuilder) { 
    // Inicializa el formulario reactivo
    this.routineForm = this.fb.group({
      nombre_actividad: ['', Validators.required],
      dia: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Puedes agregar lógica adicional aquí si es necesario
  }
  // boton para regresar
  volver(){
    this.utilScv.backnav()
  }

  // Método para enviar la rutina
  enviar_rutina() {
    if (this.routineForm.valid) {
      const rutina = this.routineForm.value; // Obtiene los valores del formulario
      const userId = localStorage.getItem('uid'); // Recupera el UID del usuario
      const dia = rutina.dia; // Obtiene el día seleccionado del formulario

      if (!userId) {
        console.log('No se ha obtenido el user ID');
      } else {
        // Llama al método del servicio de Firebase para guardar la rutina
        this.firebaseSvc.guardarRutina(userId, dia, rutina)
          .then(() => {
            console.log('Rutina creada exitosamente');
            this.utilScv.presentToast({
                message:'Actividad creada correctamente',
                duration:2000,
                position:'bottom'
            });
            this.routineForm.reset(); // Opcional: restablece el formulario después de crear la rutina
          })
          .catch(error => {
            console.log('Error al guardar la rutina:', error);
          });
      }
    } else {
      console.log('Formulario no válido');
    }
  }
}
