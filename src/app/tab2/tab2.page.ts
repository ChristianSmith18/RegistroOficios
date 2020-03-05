import { Component } from '@angular/core';
import { GetOficiosService } from '../services/get-oficios.service';
import { MisOficios, Oficios } from '../services/oficios.interface';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { ToastController } from '@ionic/angular';

import { Badge } from '@ionic-native/badge/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  misOficios: any[];
  cantOficios: number;
  showButton = true;

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

  month = new Date().getMonth();

  constructor(
    private oficios: GetOficiosService,
    private screenshot: Screenshot,
    private toastController: ToastController,
    private badge: Badge,
  ) {
    this.oficios.getAllOficios().subscribe(
      (data: MisOficios) => {
        const varTemp = this.oficiosEntregadosEsteMes(data);
        this.misOficios = varTemp[0];
        this.cantOficios = varTemp[1];
        this.badge.hasPermission().then(
          () => {
            if (this.cantOficios === 0) {
              this.badge.clear();
            } else {
              this.badge.set(this.cantOficios);
            }
          }
        );
      }
    );
  }

  oficiosEntregadosEsteMes(data: MisOficios): any[] {
    const arreglo = [];
    let cont = 0;
    const monthArray = (new Date().getMonth()) + '-' + (new Date().getFullYear());
    let monthArrayFor;

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < data.oficios.length; i++) {
      monthArrayFor = data.oficios[i].fecha.split('-')[1] + '-' + data.oficios[i].fecha.split('-')[2];
      if (monthArray === monthArrayFor) {
        cont += data.oficios[i].cantOficios;

        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < data.oficios[i].personas.length; j++) {
          arreglo.push(data.oficios[i].personas[j]);
        }
      }
    }
    return [arreglo, cont];
  }

  tarifaFormat(numero: number) {
    return numero.toLocaleString('en-US').replace(',', '.');
  }

  tarifaFormatStr(numero: string) {
    const numero2 = parseFloat(numero);
    return numero2.toLocaleString('en-US').replace(',', '.');
  }

  toggleButton() {
    this.showButton = !this.showButton;
    if (!this.showButton) {
      document.getElementsByTagName('ion-fab')[0].style.opacity = '0';
      document.getElementsByTagName('ion-fab')[0].style.transform = 'scale(.5)';
      document.getElementsByTagName('ion-fab')[0].style.transform = 'rotate(180deg)';

      setTimeout(() => {
        document.getElementsByTagName('ion-fab')[0].style.display = 'none';
      }, 600);
    } else {
      document.getElementsByTagName('ion-fab')[0].style.display = '';
      setTimeout(() => {
        document.getElementsByTagName('ion-fab')[0].style.opacity = '1';
        document.getElementsByTagName('ion-fab')[0].style.transform = 'scale(1)';
        document.getElementsByTagName('ion-fab')[0].style.transform = 'rotate(0deg)';
      }, 100);
    }
  }

  saveDoc() {

    document.getElementById('myHeader').style.display = 'none';
    document.getElementsByTagName('ion-fab')[0].style.display = 'none';

    setTimeout(() => {
      this.screenshot.save('png', 100, `hojaFinal_Mes_${this.meses[this.month]}_${new Date().getTime()}.png`).then(() => {
        this.presentToast();
        setTimeout(() => {
          document.getElementById('myHeader').style.display = '';
          document.getElementsByTagName('ion-fab')[0].style.display = '';
        }, 600);
      }, (onError) => {
        alert(onError);
        document.getElementById('myHeader').style.display = '';
        document.getElementsByTagName('ion-fab')[0].style.display = '';
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
}
