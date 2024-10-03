import { Component, OnInit, inject } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage  {

  form_register: FormGroup;
  email: string = '';
  password: string = '';
  nombre: string= '';
  edad: number=0;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  constructor(private fb: FormBuilder) {
    this.form_register = this.fb.group({
      uid:  [''],
      email: ['', [Validators.required, Validators.email]],
      nombre:  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      edad: ['', [Validators.required, Validators.min(13), Validators.max(122)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

  }

  firebaseSvc = inject(FirebaseService);
  utilsSvc= inject(UtilsService)

  volver(){
    this.utilsSvc.backnav()
  }


  async submit() {
    if (this.form_register.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.registro(this.form_register.value as User).then(async res => {
        await this.firebaseSvc.actualizar_usuario(this.form_register.value.nombre)
        let uid=res.user.uid;
        this.form_register.controls['uid'].setValue(uid);

        this.setUserInfo(uid)
        
      }).catch(error =>{
        console.log(error);

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
  }


  async setUserInfo(uid:string) {
    if (this.form_register.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path= `users/${uid}`;
      delete this.form_register.value.password;

      this.firebaseSvc.setdocument(path,this.form_register.value).then(async res => {

        this.utilsSvc.guardar_LocalStorage('user',this.form_register.value);
        this.utilsSvc.routerLink('/main/home');
        this.form_register.reset();
        
      }).catch(error =>{
        console.log(error);

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
  }
  mostrar_contra() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

}
