import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Asegúrate de usar el módulo compat
import { UtilsService } from './utils.service';
import { collection, addDoc, doc,setDoc,getDoc } from 'firebase/firestore'; // Mantén esto para Firestore

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth); // Inyectar AngularFireAuth
  firestore = inject(AngularFirestore); // Asegúrate de inyectar AngularFirestore
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
    return setDoc(doc(this.firestore.firestore, path), data); // Usa this.firestore.firestore
  }

  // Obtener datos de un documento
  async getdocument(path: string) {
    return (await getDoc(doc(this.firestore.firestore, path))).data(); // Usa this.firestore.firestore
  }

  // Crear rutina
  guardarRutina(userId: string, dia: string, rutina: any) {
    const userRef = doc(this.firestore.firestore, `users/${userId}`); // Documento del usuario
    const diaRef = collection(userRef, `rutina_semanal/${dia}/actividades`); // Colección de actividades para el día

    // Extraer solo la hora de inicio y fin, ignorando la fecha
    const horaInicio = rutina.hora_inicio.split('T')[1]; // Esto extrae solo la hora
    const horaFin = rutina.hora_fin.split('T')[1];

    // Reemplazamos los valores de hora_inicio y hora_fin por solo las horas
    const rutinaActualizada = {
      ...rutina,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
    };

    // Guardar la rutina como un documento en la colección de actividades
    return addDoc(diaRef, rutinaActualizada).then((docRef) => {
        console.log('Rutina agregada exitosamente para el día:', dia, 'ID:', docRef.id);
    }).catch((error) => {
        console.error('Error al agregar la rutina:', error);
    });
}

  // Cerrar sesión
  logout() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilScv.routerLink('/auth');
  }

}
