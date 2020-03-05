import { Component } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { ModalDetailsComponent } from '../components/modal-details/modal-details.component';
import { GetOficiosService } from '../services/get-oficios.service';
import { MisOficios, Oficios } from '../services/oficios.interface';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  misOficios: Oficios[];

  meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private oficios: GetOficiosService
  ) {
    this.presentLoading();

    this.oficios.getAllOficios().subscribe(
      (data: MisOficios) => {
        this.misOficios = data.oficios;

        if (this.isListadosActuales()) {
          document.getElementById('actualesTitle').style.display = 'block';
        } else {
          document.getElementById('actualesTitle').style.display = 'none';
        }

        if (this.isListadosFinalizados()) {
          document.getElementById('listado-de-finalizados').style.display = 'block';
        } else {
          document.getElementById('listado-de-finalizados').style.display = 'none';
        }

        this.loadingController.dismiss().then(() => { this.finalStep(); });
      }
    );
  }

  finalStep() {
    if (this.isListadosFinalizados()) {
      if (this.isListadosActuales()) {
        document.getElementsByTagName('ion-col')[document.getElementsByTagName('ion-col').length - 1].style.marginBottom = '0';
        document.getElementById('separador').style.display = 'block';
      }
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando Listado...',
      mode: 'ios',
      spinner: 'crescent'
    });
    await loading.present();
  }

  async showDetails(index: number, showFabButton: boolean) {

    const modal = await this.modalController.create({
      component: ModalDetailsComponent,
      componentProps: {
        listado: this.misOficios[index],
        indice: index,
        showFabButton
      }
    });
    return await modal.present();
  }

  fixDate(fecha: string, bool?: boolean) {
    const newFecha = (bool) ? (parseFloat(fecha) + 1) : parseFloat(fecha);
    if (fecha.length === 1) {
      return '0' + newFecha;
    } else {
      return newFecha;
    }
  }

  async removeList(index: number) {
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
            this.presentLoading();
            setTimeout(() => {
              this.oficios.removeListOficios(index);
              if (this.isListadosFinalizados() && this.isListadosActuales()) {
                document.getElementById('separador').style.display = 'block';
              } else {
                document.getElementById('separador').style.display = 'none';
              }
              this.loadingController.dismiss();
            }, 600);
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

  isListadosFinalizados(): boolean {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.misOficios.length; i++) {
      if (this.misOficios[i].finalizado) {
        return true;
      }
    }
    return false;
  }

  isListadosActuales(): boolean {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.misOficios.length; i++) {
      if (!(this.misOficios[i].finalizado)) {
        return true;
      }
    }
    return false;
  }
}
