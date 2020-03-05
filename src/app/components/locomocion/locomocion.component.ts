import { Component, Input } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { Screenshot } from '@ionic-native/screenshot/ngx';


@Component({
  selector: 'app-locomocion',
  templateUrl: './locomocion.component.html',
  styleUrls: ['./locomocion.component.scss'],
})
export class LocomocionComponent {
  @Input() locomocionData: any[];
  day = (new Date().getDate());
  month = (new Date().getMonth() + 1);
  year = parseFloat((new Date().getFullYear() + '').substring(2));
  tarifa = 720;
  observacion = '';

  constructor(
    private modalController: ModalController,
    private screenshot: Screenshot,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  closeModal() {
    this.modalController.dismiss();
  }

  takeScreenShot() {
    document.getElementById('myHeader').style.display = 'none';
    document.getElementById('myFab').style.display = 'none';

    setTimeout(() => {
      this.screenshot.save('png', 100, `hojaDeLocomoción_${this.day}_${this.month}_${this.year}_${new Date().getTime()}.png`).then(() => {
        this.presentToast();
        setTimeout(() => {
          document.getElementById('myHeader').style.display = '';
          document.getElementById('myFab').style.display = '';
        }, 600);
      }, (onError) => {
        alert(onError);
        document.getElementById('myHeader').style.display = '';
        document.getElementById('myFab').style.display = '';
      });
    }, 600);

  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Imagen guardada exitosamente.',
      position: 'top',
      mode: 'ios',
      duration: 2000
    });
    toast.present();
  }

  add() {
    this.tarifa += 720;
  }

  remove() {
    if (this.tarifa > 720) {
      this.tarifa -= 720;
    }
  }

  tarifaFormat(numero: number) {
    return numero.toLocaleString('en-US').replace(',', '.');
  }

  async addObservacion() {
    const alert = await this.alertController.create({
      header: 'Ingrese Observación',
      mode: 'ios',
      inputs: [
        {
          name: 'box',
          type: 'text',
        }
      ],
      buttons: [
        {
          text: 'Agregar',
          handler: (name) => {
            if (this.observacion.length > 0) {
              this.observacion += (' ' + name.box + '.');
            } else {
              this.observacion = name.box + '.';

            }
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
