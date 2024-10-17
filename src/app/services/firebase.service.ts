import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { User } from '../models/user.model';
import { Rutina } from '../models/rutina.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UtilsService } from './utils.service';
import { collection, addDoc, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilScv = inject(UtilsService);

  // Autenticación
  getauth() {
    return getAuth();
  }

  // Acceso
  login(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Creación de Usuario
  registro(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // Actualizar usuario
  actualizar_usuario(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  // Seteo de documento
  setdocument(path: string, data: any) {
    return setDoc(doc(this.firestore.firestore, path), data);
  }

  // Obtener datos de un documento
  async getdocument(path: string) {
    return (await getDoc(doc(this.firestore.firestore, path))).data();
  }

  // Método para obtener rutinas del día
  getRutinasDelDia(userId: string, dia: string) {
    return this.firestore
      .collection(`users/${userId}/rutina-semanal/${dia}/actividades`)
      .get()
      .toPromise()
      .then((snapshot) => {
        const actividades = [];
        snapshot.forEach((doc) => {
          actividades.push(doc.data());
        });
        return actividades;
      });
  }

  // 2. Validar que la hora de fin sea mayor que la hora de inicio
  validarHoras(horaInicio: string, horaFin: string): boolean {
    const inicio = new Date(`1970-01-01T${horaInicio}`);
    const fin = new Date(`1970-01-01T${horaFin}`);
    return fin > inicio;
  }

  // 3. Verificar colisiones de horarios
  hayColision(actividades: any[], nuevaHoraInicio: string, nuevaHoraFin: string): boolean {
    const nuevaInicio = new Date(`1970-01-01T${nuevaHoraInicio}`);
    const nuevaFin = new Date(`1970-01-01T${nuevaHoraFin}`);

    for (const actividad of actividades) {
      const actividadInicio = new Date(`1970-01-01T${actividad.hora_inicio}`);
      const actividadFin = new Date(`1970-01-01T${actividad.hora_fin}`);

      if (
        (nuevaInicio >= actividadInicio && nuevaInicio < actividadFin) || // La nueva actividad empieza dentro de otra
        (nuevaFin > actividadInicio && nuevaFin <= actividadFin) ||       // La nueva actividad termina dentro de otra
        (nuevaInicio <= actividadInicio && nuevaFin >= actividadFin)      // La nueva actividad abarca por completo a otra
      ) {
        return true; // Hay solapamiento
      }
    }

    return false; // No hay solapamiento
  }

  // 4. Guardar rutinas validadas en Firebase
 // 4. Guardar rutinas validadas en Firebase
 async guardarRutinasEnBloque(userId: string, rutinas: any[]) {
  const batch = this.firestore.firestore.batch();

  rutinas.forEach((rutina) => {
    const dia = rutina.dia; // Asegúrate de que cada rutina tenga un campo 'dia'
    const docRef = this.firestore.collection(`users/${userId}/rutina-semanal`).doc(dia).collection('actividades').doc().ref;
    batch.set(docRef, rutina); // Agregar la rutina al lote
  });

  return batch.commit(); // Ejecutar la transacción en bloque
}



  
  // Cerrar sesión
  logout() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilScv.routerLink('/auth');
  }
}
