import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Rutina } from '../models/rutina.models';

@Injectable({
  providedIn: 'root'
})
export class RutinaService {
  constructor(private firestore: AngularFirestore) {}

  // Método para obtener las rutinas
  getRutinas() {
    return this.firestore.collection<Rutina>('rutinas').valueChanges();
  }
}
