import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalDetailsComponent } from './modal-details/modal-details.component';
import { PersonListComponent } from './person-list/person-list.component';
import { PlaceListComponent } from './place-list/place-list.component';
import { MakeListComponent } from './make-list/make-list.component';
import { LocomocionComponent } from './locomocion/locomocion.component';


@NgModule({
  declarations: [
    ModalDetailsComponent,
    PersonListComponent,
    PlaceListComponent,
    MakeListComponent,
    LocomocionComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }
