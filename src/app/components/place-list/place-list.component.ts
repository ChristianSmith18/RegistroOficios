import { Component } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { GetOficiosService } from 'src/app/services/get-oficios.service';
import { DireccionesOficios, StgoCentro } from 'src/app/services/direcciones.interface';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.scss'],
})
export class PlaceListComponent {

  direcciones: StgoCentro[];

  constructor(
    public modalController: ModalController,
    private firestore: GetOficiosService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.presentLoading();

    this.firestore.getPlaces().subscribe(
      (data: DireccionesOficios) => {
        this.direcciones = data.santiagoCentro;
        this.loadingController.dismiss();
      }
    );

    setTimeout(() => { this.loadingController.dismiss(); }, 3000);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando Listado...',
      mode: 'ios',
      spinner: 'crescent'
    });
    await loading.present();
  }

  // tslint:disable-next-line: max-line-length
  async showInfo(direccion: StgoCentro) {
    if (direccion.isHorario) {
      const alert = await this.alertController.create({
        message: `
        <h2>${direccion.lugar}</h2>
        <p><b>Dirección:</b> ${direccion.calle} #${direccion.numero}, piso ${direccion.piso}</p>
        <br>
        <p><b>Hora de Apertura:</b> ${direccion.horario.split('%20')[0]}</p>
        <p><b>Hora de Cierre:</b> ${direccion.horario.split('%20')[1]}</p>
        <br>
        <p><b>${direccion.fecha}</b></p>
        `,
        mode: 'ios',
        backdropDismiss: false,
        buttons: [
          {
            text: 'Ir a mapa',
            handler: () => {
              window.location.href = direccion.mapa;
            }
          },
          {
            text: 'Cerrar',
            role: 'cancel',
            cssClass: 'secondary'
          }
        ]
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        message: `
        <h2>${direccion.lugar}</h2>
        <p><b>Dirección:</b> ${direccion.calle} #${direccion.numero}, piso ${direccion.piso}</p>
        <p><b>${direccion.fecha}</b></p>
        `,
        mode: 'ios',
        backdropDismiss: false,
        buttons: [
          {
            text: 'Ir a mapa',
            handler: () => {
              window.location.href = direccion.mapa;
            }
          },
          {
            text: 'Cerrar',
            role: 'cancel',
            cssClass: 'secondary'
          }
        ]
      });
      await alert.present();
    }

  }

  searchbar(event: CustomEvent) {
    let texto;
    if (event.detail) {
      texto = (event.detail.path[0].value + '').toLowerCase();
    }

    for (let i = 1; i < document.getElementsByTagName('ion-item').length; i++) {
      if (document.getElementsByTagName('ion-item')[i].innerText.toLowerCase().indexOf(texto) > -1) {
        document.getElementsByTagName('ion-item')[i].style.display = '';
      } else {
        document.getElementsByTagName('ion-item')[i].style.display = 'none';
      }
    }
  }

  showAll() {
    setTimeout(() => {
      for (let i = 1; i < document.getElementsByTagName('ion-item').length; i++) {
        document.getElementsByTagName('ion-item')[i].style.display = '';
      }
    }, 100);
  }

  async removePlace(position: number) {
    const alert = await this.alertController.create({
      header: '¿Desea borrarla?',
      message: 'Esta acción no se puede revertir.',
      mode: 'ios',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Eliminar',
          cssClass: 'danger-text',
          handler: () => {
            this.firestore.removePlace(position);
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

  async addTime(position: number) {
    const alert = await this.alertController.create({
      header: 'Ingrese Apertura y Cierre',
      mode: 'ios',
      backdropDismiss: false,
      inputs: [
        {
          name: 'inicio',
          type: 'time'
        },
        {
          name: 'termino',
          type: 'time'
        }
      ],
      buttons: [
        {
          text: 'Agregar',
          handler: (text: any) => {
            this.firestore.addTime(position, text.inicio, text.termino);
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

  async editPlace(position: number, lugar: string, calle: string, numero: number, piso: number) {
    const alert = await this.alertController.create({
      header: 'Ingrese datos de ubicación',
      mode: 'ios',
      inputs: [
        {
          name: 'name',
          type: 'text',
          id: 'add-text-name',
          value: lugar,
          placeholder: 'Ingrese nombre del lugar...'
        },
        {
          name: 'street',
          type: 'text',
          id: 'add-text-name',
          value: calle,
          placeholder: 'Ingrese nombre de la calle...'
        },
        {
          name: 'number',
          type: 'number',
          value: numero,
          id: 'add-text-name',
          placeholder: 'Ingrese número del lugar...'
        },
        {
          name: 'piso',
          type: 'number',
          value: piso,
          placeholder: 'Ingrese piso del lugar...'
        }
      ],
      buttons: [
        {
          text: 'Actualizar',
          handler: (text: any) => {
            const mapa = ' http://maps.google.com/?q=' + (text.street + '').replace(' ', '+') + '+' + text.number;
            this.firestore.updatePlace(position, text.name, text.street, text.number, text.piso, mapa);
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
}
