import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

export const authGuard: CanActivateFn = (route, state) => {

  const firebaseSvc = inject(FirebaseService);
  const utilsSvc=inject(UtilsService);
  const router=inject(Router);

  let user=localStorage.getItem('user');

  // Llamamos a getAuth() para obtener el estado de autenticación
  const authState = firebaseSvc.getauth(); // Supongo que devuelve el usuario o null si no está autenticado

  if (authState && user) {
    // Si el usuario está autenticado y existe en el almacenamiento local, permitir el acceso
      return true;
  } else {
    // Si el usuario no está autenticado, bloquear acceso y redirigir a login
    console.log('Usuario no autenticado. Bloqueando acceso.');
    return router.parseUrl('/auth');;
  } 
};
