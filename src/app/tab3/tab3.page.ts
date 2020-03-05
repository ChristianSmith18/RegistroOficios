import { Component } from '@angular/core';
import { GetOficiosService } from '../services/get-oficios.service';
import { AlertController, ModalController } from '@ionic/angular';
import { PlaceListComponent } from '../components/place-list/place-list.component';
import { PersonListComponent } from '../components/person-list/person-list.component';
import { MakeListComponent } from '../components/make-list/make-list.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(
    private firestore: GetOficiosService,
    private alertController: AlertController,
    private modalController: ModalController,
  ) { }

  reloadApp() {
    window.location.href = '';
  }

  async showPlace() {
    const modal = await this.modalController.create({
      component: PlaceListComponent
    });
    return await modal.present();
  }

  async showPerson() {
    const modal = await this.modalController.create({
      component: PersonListComponent
    });
    return await modal.present();
  }

  async addPerson() {
    const alert = await this.alertController.create({
      header: 'Ingrese nombre de la persona',
      mode: 'ios',
      inputs: [
        {
          name: 'name',
          type: 'text',
          id: 'add-text-name',
          placeholder: 'Nombre de la persona...'
        }
      ],
      buttons: [
        {
          text: 'Agregar',
          handler: (text: any) => {
            this.firestore.addPerson((text.name));
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]
    });

    await alert.present();
  }

  async addPlace() {
    const alert = await this.alertController.create({
      header: 'Ingrese datos de ubicación',
      mode: 'ios',
      inputs: [
        {
          name: 'name',
          type: 'text',
          id: 'add-text-name',
          placeholder: 'Ingrese nombre del lugar...'
        },
        {
          name: 'street',
          type: 'text',
          id: 'add-text-name',
          placeholder: 'Ingrese nombre de la calle...'
        },
        {
          name: 'number',
          type: 'number',
          id: 'add-text-name',
          placeholder: 'Ingrese número del lugar...'
        },
        {
          name: 'piso',
          type: 'number',
          placeholder: 'Ingrese piso del lugar...'
        }
      ],
      buttons: [
        {
          text: 'Agregar',
          handler: (text: any) => {
            const mapa = ' http://maps.google.com/?q=' + (text.street + '').replace(' ', '+') + '+' + text.number;
            this.firestore.addPlace(text.name, text.street, text.number, text.piso, mapa);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]
    });

    await alert.present();
  }

  async crearListado() {
    const modal = await this.modalController.create({
      component: MakeListComponent
    });
    return await modal.present();
  }
}
