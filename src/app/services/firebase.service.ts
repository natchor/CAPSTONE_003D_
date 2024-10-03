import { Injectable,inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,updateProfile } from 'firebase/auth'
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore'
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth=inject(AngularFireAuth);
  firestore=inject(AngularFirestore)
  utilScv=inject(UtilsService)



  // Autenticación
  getauth(){
    return getAuth();
  }

  // Acceso
  login(user: User){
    return signInWithEmailAndPassword(getAuth(),user.email,user.password)
  }
  // Creación de Usuario
  registro(user: User){
    return createUserWithEmailAndPassword(getAuth(),user.email,user.password)
  }
  //
  actualizar_usuario(displayName:string){
    return updateProfile(getAuth().currentUser,{ displayName })
  }


  // seteo de documento
  setdocument(path:string, data:any){
    return setDoc(doc(getFirestore(),path),data);
  }

  // obtener datos de un documento
  async getdocument(path:string){
    return (await getDoc(doc(getFirestore(),path))).data();
  }

  //  cerrar sesión
  logout(){
    getAuth().signOut()
    localStorage.removeItem('user');
    this.utilScv.routerLink('/auth');
  }

}
