import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ComponentsModule } from '../components/components.module';
import { PlaceListComponent } from '../components/place-list/place-list.component';
import { PersonListComponent } from '../components/person-list/person-list.component';
import { MakeListComponent } from '../components/make-list/make-list.component';

@NgModule({
  entryComponents: [PlaceListComponent, PersonListComponent, MakeListComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    ComponentsModule
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule { }
