import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateRoutinePageRoutingModule } from './create-routine-routing.module';

import { CreateRoutinePage } from './create-routine.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateRoutinePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreateRoutinePage]
})
export class CreateRoutinePageModule {

}
