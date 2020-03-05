import { Component, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Oficios } from 'src/app/services/oficios.interface';
import { OficiosListadoPersonas } from 'src/app/services/listado.interface';
import { GetOficiosService } from 'src/app/services/get-oficios.service';
import { LocomocionComponent } from '../locomocion/locomocion.component';

@Component({
  selector: 'app-modal-details',
  templateUrl: './modal-details.component.html',
  styleUrls: ['./modal-details.component.scss'],
})
export class ModalDetailsComponent {
  @Input() listado: Oficios;
  @Input() indice: number;
  @Input() showFabButton: boolean;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private firestore: GetOficiosService
  ) { }

  closeModal() {
    this.modalController.dismiss();
  }

  openGoogleMaps(link: string) {
    window.location.href = link;
  }

  async getLocation(direccion: OficiosListadoPersonas) {
    if (direccion.isHorario) {
      const alert = await this.alertController.create({
        message: `
        <h2>${direccion.lugar}</h2>
        <p><b>Dirección:</b> ${direccion.calle} #${direccion.numero}, piso ${direccion.piso}</p>
        <br>
        <p><b>Hora de Apertura:</b> ${direccion.horario.split('%20')[0]}</p>
        <p><b>Hora de Cierre:</b> ${direccion.horario.split('%20')[1]}</p>
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
    } else {
      const alert = await this.alertController.create({
        message: `
        <h2>${direccion.lugar}</h2>
        <p><b>Dirección:</b> ${direccion.calle} #${direccion.numero}, piso ${direccion.piso}</p>
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

  }

  async deleteItem(indexPersona: number, indexOficio: number) {
    const alert = await this.alertController.create({
      message: `<h6><b>¿Estás seguro?</b></h6>`,
      mode: 'ios',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Eliminar',
          handler: (text: any) => {
            this.listado.personas[indexPersona].oficios.splice(indexOficio, 1);

            this.firestore.updateListado(this.indice, this.listado);
            this.listado.cantOficios--;
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

  async saveAll() {

    const alert = await this.alertController.create({
      message: `<h6><b>¿Estás seguro?</b></h6>`,
      mode: 'ios',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Guardar',
          handler: (text: any) => {
            let inicio = 0, cont = 0;
            let final = 0;

            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.listado.personas.length; i++) {
              console.log(this.listado.personas[i].nombre);

              if (inicio !== 0) {
                final += (this.listado.personas[i].oficios.length);
              } else {
                final += (this.listado.personas[i].oficios.length - 1);
              }
              cont = 0;
              // tslint:disable-next-line: prefer-for-of
              for (inicio; inicio <= final; inicio++) {

                if ((document.getElementsByClassName('item-slide1')[inicio].children[0] as HTMLIonCheckboxElement).checked) {
                  if (!(this.listado.personas[i].oficios[cont].entregado)) {
                    this.listado.personas[i].oficios[cont].entregado = true;

                    // tslint:disable-next-line: max-line-length
                    this.listado.personas[i].oficios[cont]['fechaEntrega'] = (new Date() + '').split(' GM')[0].substring(0, (new Date() + '').split(' GM')[0].length - 9);
                  }
                }
                cont++;
              }
              inicio = (final + 1);
            }

            this.listado.cantOficiosEntregados = this.countOficiosEntregados();

            this.firestore.updateListado(this.indice, this.listado);
            this.closeModal();
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

  countOficiosEntregados() {
    let cont = 0;
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < this.listado.personas.length; j++) {
      // tslint:disable-next-line: prefer-for-of
      for (let k = 0; k < this.listado.personas[j].oficios.length; k++) {
        if (this.listado.personas[j].oficios[k].entregado) {
          cont++;
        }
      }
    }

    return cont;
  }

  isOficiosEntregados(index: number) {
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < this.listado.personas[index].oficios.length; j++) {
      if (this.listado.personas[index].oficios[j].entregado) {
        return true;
      }
    }

    return false;
  }

  isOficiosNoEntregados(index: number) {
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < this.listado.personas[index].oficios.length; j++) {
      if (!(this.listado.personas[index].oficios[j].entregado)) {
        return true;
      }
    }

    return false;
  }

  isOficiosEntregadosAll() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.listado.personas.length; i++) {
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < this.listado.personas[i].oficios.length; j++) {
        if (this.listado.personas[i].oficios[j].entregado) {
          return true;
        }
      }
    }
    return false;
  }

  isOficiosNoEntregadosAll() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.listado.personas.length; i++) {
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < this.listado.personas[i].oficios.length; j++) {
        if (!(this.listado.personas[i].oficios[j].entregado)) {
          return true;
        }
      }
    }
    return false;
  }

  async showDateEntrega(fecha: string) {
    const alert = await this.alertController.create({
      message: `
      <h3>Entrega realizada el</h3>
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

  createLocomocionData() {
    const locomocionData = [];
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < this.listado.personas.length; j++) {
      // tslint:disable-next-line: prefer-for-of
      for (let k = 0; k < this.listado.personas[j].oficios.length; k++) {
        if (this.listado.personas[j].oficios[k].entregado) {
          // tslint:disable-next-line: max-line-length
          if (this.listado.personas[j].oficios[k]['fechaEntrega'] === (new Date() + '').split(' GM')[0].substring(0, (new Date() + '').split(' GM')[0].length - 9)) {
            locomocionData.push(this.listado.personas[j].oficios[k]);
          }
        }
      }
    }

    return locomocionData;
  }

  async openLocomocion() {
    this.closeModal();
    const modal = await this.modalController.create({
      component: LocomocionComponent,
      componentProps: {
        locomocionData: this.createLocomocionData()
      }
    });
    return await modal.present();
  }

  async finalizar() {
    const alert = await this.alertController.create({
      message: `<h6><b>¿Estás seguro?</b></h6>`,
      mode: 'ios',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Finalizar',
          handler: () => {
            this.listado.finalizado = true;
            this.firestore.updateListado(this.indice, this.listado);
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
