import { Component, OnInit, inject } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {

  form: FormGroup;
  email: string = '';
  password: string = '';
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }
  firebaseSvc = inject(FirebaseService);
  utilsSvc= inject(UtilsService)

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.login(this.form.value as User).then(res => {
        console.log(res);
        localStorage.setItem('uid', res.user.uid); 
        this.getUserInfo(res.user.uid)
        
      }).catch(error =>{
        console.log(error);

        this.utilsSvc.presentToast({
          message:error.message,
          duration:1500,
          color:'primary',
          position:'middle'
        })
      
      }).finally(() => {
        loading.dismiss();
      })
    }
  }

  async getUserInfo(uid:string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path= `users/${uid}`;

      this.firebaseSvc.getdocument(path).then((user:User) => {

        this.utilsSvc.guardar_LocalStorage('user',user);
        this.utilsSvc.routerLink('/main/home');
        this.form.reset();

        this.utilsSvc.presentToast({
          message:`Hola ${user.nombre}, Bienvenido a GRS`,
          duration:3000,
          color:'primary',
          position:'middle'
        
      }).catch(error =>{
        this.utilsSvc.presentToast({
          message:error.message,
          duration:3000,
          color:'primary',
          position:'middle'
        })
      
      }).finally(() => {
        loading.dismiss();
      })
    }
   )}
  }

  mostrar_contra() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

}
