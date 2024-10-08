import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {


  loadingCtrl = inject(LoadingController)
  toastCtrl=inject(ToastController)
  router=inject(Router)
  navback=inject(NavController)


  //  Loading
  loading(){
    return this.loadingCtrl.create({spinner:'crescent'})
  }

  //  Toast-Mensajes
  async presentToast(ops?: ToastOptions) {
    const toast = await this.toastCtrl.create(ops);
    toast.present();
  }
  routerLink(url:string){
    return this.router.navigateByUrl(url)
  }
  backnav(){
    return this.navback.back()
  }

  guardar_LocalStorage(key: string, value: any){
    return localStorage.setItem(key,JSON.stringify(value))
  }
  obtener_LocalStorage(key:string){
    return JSON.parse(localStorage.getItem(key))
  }

}