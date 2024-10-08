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
  async getRutinasDelDia(userId: string, dia: string): Promise<Rutina[]> {
    try {
      // Cambiamos la referencia para que 'dia' sea una subcolección de 'rutinas'
      const actividadesSnapshot = await this.firestore.collection(`users/${userId}/rutinas`).doc(dia).collection('actividades').get().toPromise();
      const actividades: Rutina[] = [];
      
      // Iteramos sobre los documentos de la subcolección 'actividades'
      actividadesSnapshot.forEach(doc => {
        const data = doc.data();
        if (data && typeof data === 'object') {
          actividades.push({ id: doc.id, ...data } as Rutina);
        } else {
          console.warn(`El documento ${doc.id} no contiene un objeto válido`);
        }
      });
      
      return actividades;
    } catch (error) {
      console.error('Error al obtener rutinas del día:', error);
      throw error; // Lanzamos el error para que se maneje en el componente
    }
  }
  
  

  // Método para guardar una nueva rutina
  async guardarRutina(userId: string, dia: string, rutina: Rutina): Promise<void> {
    try {
      // Guardamos la rutina dentro de la subcolección 'actividades' bajo el día especificado
      await this.firestore.collection(`users/${userId}/rutinas`).doc(dia).collection('actividades').add(rutina);
      console.log('Rutina guardada con éxito');
    } catch (error) {
      console.error('Error al guardar la rutina:', error);
      throw error;
    }
  }
  
  
  // Cerrar sesión
  logout() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilScv.routerLink('/auth');
  }
}
