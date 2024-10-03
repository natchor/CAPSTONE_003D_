import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebaseSvc=inject(FirebaseService)
  utilScv=inject(UtilsService)
constructor(private menu: MenuController, private router: Router) {}

  openMenu() {
    this.menu.open('first');
  }

  navigateTo(page: string) {
    this.menu.close('first');
    this.router.navigate([`/${page}`]);
  }
  ngOnInit() {
  }

  logout(){
    this.firebaseSvc.logout();
    console.log("Cerrando sesión");
    
  }

}
