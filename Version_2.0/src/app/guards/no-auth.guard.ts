import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';


export const noAuthGuard: CanActivateFn = (route, state) => {
  const firebaseSvc = inject(FirebaseService);
  const utilsSvc = inject(UtilsService);

  // Obtener el estado de autenticación
  const authState = firebaseSvc.getauth(); // Devuelve el usuario o null si no está autenticado
  let user = localStorage.getItem('user');

  // Si el usuario está autenticado, redirigir a /main/home
  if (authState && user) {
    utilsSvc.routerLink('/main/home');
    console.log('Usuario autenticado, redirigiendo a /main/home.');
    return false; // Bloquea el acceso al login o páginas no-auth
  }

  // Si el usuario no está autenticado, permitir el acceso a la ruta actual login o registro
  return true;
};
