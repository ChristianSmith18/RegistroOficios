import { Component } from '@angular/core';
import { ModalController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { GetOficiosService } from 'src/app/services/get-oficios.service';
import { PersonasOficios, Personas } from 'src/app/services/personas.interface';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss'],
})
export class PersonListComponent {
  personas: Personas[];
  llave = true;

  constructor(
    public modalController: ModalController,
    private firestore: GetOficiosService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.presentLoading();

    this.firestore.getPeople().subscribe(
      (data: PersonasOficios) => {
        this.loadingController.dismiss();
        this.personas = data.personas;
        this.llave = false;
      }
    );

    setTimeout(() => {
      if (this.llave) {
        this.loadingController.dismiss();
        this.presentErrorToast();
        this.llave = false;
      }
    }, 3000);
  }

  async presentErrorToast() {
    const toast = await this.toastController.create({
      message: 'Ha ocurrido un error de carga',
      duration: 2000,
      mode: 'ios',
      position: 'top',
      color: 'warning'
    });
    toast.present();
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

  async showInfo(nombre: string, fecha: string) {
    const alert = await this.alertController.create({
      message: `
      <h2>${nombre}</h2>
      <p><b>${fecha}</b></p>
      `,
      mode: 'ios',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]
    });

    await alert.present();
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

  async removePerson(position: number) {
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
            this.firestore.removePerson(position);
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
