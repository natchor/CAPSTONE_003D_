import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit{
  profileForm: FormGroup;
  userId: string | null = null; // Inicializar como null
  isEditing = {
    nombre: false,
    edad: false,
    email: false,
    password: false
  };

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      edad: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.firebaseService.auth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadUserProfile();
      } else {
        console.error('No user is currently logged in.');
        // Manejar el caso en que no hay un usuario autenticado
      }
    });
  }

  async loadUserProfile() {
    if (this.userId) {
      const profileData = await this.firebaseService.getdocument(`users/${this.userId}`);
      if (profileData) {
        this.profileForm.patchValue(profileData);
      }
    } else {
      console.error('User ID is null.');
    }
  }

  toggleEdit(field: 'nombre' | 'edad' | 'email' | 'password') {
    this.isEditing[field] = !this.isEditing[field];
    if (!this.isEditing[field]) {
      this.saveProfile();
    }
  }

  async saveProfile() {
    if (this.userId) {
      const profileData = this.profileForm.value;
      try {
        await this.firebaseService.setdocument(`users/${this.userId}`, profileData);
        await this.firebaseService.actualizar_usuario(profileData.nombre);
        console.log('Profile updated successfully');
        this.utilsService.presentToast({
          message: 'Profile updated successfully',
          duration: 3000,
          color: 'success',
          position: 'bottom'
        });
      } catch (error) {
        console.error('Error updating profile', error);
        this.utilsService.presentToast({
          message: 'Error updating profile',
          duration: 3000,
          color: 'danger',
          position: 'bottom'
        });
      }
    } else {
      console.error('User ID is null.');
    }
  }
}

