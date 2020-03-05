import { Component, AfterContentChecked, ViewChild } from '@angular/core';
import { ModalController, IonSlides, ToastController } from '@ionic/angular';
import { GetOficiosService } from 'src/app/services/get-oficios.service';
import { PersonasOficios, Personas } from 'src/app/services/personas.interface';
import { DireccionesOficios, StgoCentro } from 'src/app/services/direcciones.interface';

@Component({
  selector: 'app-make-list',
  templateUrl: './make-list.component.html',
  styleUrls: ['./make-list.component.scss'],
})
export class MakeListComponent implements AfterContentChecked {
  @ViewChild('slides', { static: true }) slides: IonSlides;

  personas: Personas[];
  direcciones: StgoCentro[];
  keyAfterContentChecked = true;
  nombreListado = '';
  personasText = [];
  oficiosPersonas = [];
  contadorData = [0, 0];

  colores = [
    'primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'light', 'medium', 'dark'
  ];

  slideOpts = {
    initialSlide: 1,
    speed: 300,
  };

  constructor(
    private modalController: ModalController,
    private oficios: GetOficiosService,
    private toastController: ToastController
  ) {
    this.oficios.getPeople().subscribe(
      (data: PersonasOficios) => {
        this.personas = data.personas;
      }
    );

    this.oficios.getPlaces().subscribe(
      (data: DireccionesOficios) => {
        this.direcciones = data.santiagoCentro;
      }
    );
  }

  closeModal() {
    this.modalController.dismiss();
  }

  ngAfterContentChecked() {
    if (this.keyAfterContentChecked) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < document.getElementsByTagName('ion-chip').length; i++) {
        document.getElementsByTagName('ion-chip')[i].classList.add('seleccionado');
      }
      this.slides.lockSwipes(true);
      this.keyAfterContentChecked = false;
    }
  }


  nextButtonStep1() {
    let cont = 0;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < document.getElementsByClassName('item-slide1').length; i++) {
      if ((document.getElementsByClassName('item-slide1')[i].children[0] as HTMLIonCheckboxElement).checked) {
        this.personasText.push((document.getElementsByClassName('item-slide1')[i] as any).innerText);
        cont++;
      }
    }

    if (cont > 0) {
      this.contadorData[0] = cont;
      this.slides.lockSwipes(false);
      this.slides.slideTo(1);
      this.slides.lockSwipes(true);
    } else {
      this.presentToast('Debes seleccionar al menos una para continuar');
    }
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      mode: 'ios'
    });
    toast.present();
  }

  nextButtonStep2() {
    let fixArray = [], cont = 0, contGlobal = 0;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < document.getElementsByClassName('person').length; i++) {
      fixArray = [];
      cont = 0;
      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < document.getElementsByClassName(`sub-${i}`).length; j++) {
        if ((document.getElementsByClassName(`sub-${i}`)[j].children[0] as HTMLIonCheckboxElement).checked) {
          fixArray.push((document.getElementsByClassName(`sub-${i}`)[j] as any).innerText);
          cont++;
          contGlobal++;
        }
      }
      if (cont === 0) {
        this.presentToast('Debes seleccionar al menos un oficio por persona');
        this.oficiosPersonas = [];
        return;
      } else {
        this.contadorData[1] = contGlobal;
        this.oficiosPersonas.push(fixArray);
        this.slides.lockSwipes(false);
        this.slides.slideTo(2);
        this.slides.lockSwipes(true);
      }
    }
  }

  nextButtonStep3() {
    this.nombreListado = document.getElementsByTagName('ion-input')[0].value;

    this.slides.lockSwipes(false);
    this.slides.slideTo(3);
    this.slides.lockSwipes(true);

    const day = new Date().getDate().toString();
    const month = new Date().getMonth().toString();
    const year = new Date().getFullYear();

    let arrayOficios = [];
    const objListado = new Object();

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.personasText.length; i++) {

      // tslint:disable-next-line: prefer-for-of
      for (let j = 0; j < this.oficiosPersonas[i].length; j++) {
        arrayOficios = [];

        // tslint:disable-next-line: prefer-for-of
        for (let k = 0; k < this.direcciones.length; k++) {
          if (this.oficiosPersonas[i][j] === this.direcciones[k].lugar) {
            this.direcciones[k]['entregado'] = false;

            this.oficiosPersonas[i][j] = this.direcciones[k];
          }
        }
      }
    }

    const arrayPersonas = [];

    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < this.personasText.length; j++) {
      arrayPersonas.push({
        nombre: this.personasText[j],
        oficios: this.oficiosPersonas[j]
      });
    }

    objListado['fecha'] = `${day}-${month}-${year}`;
    objListado['finalizado'] = false;
    objListado['nombreListado'] = this.nombreListado;
    objListado['cantPersonas'] = this.contadorData[0];
    objListado['cantOficios'] = this.contadorData[1];
    objListado['cantOficiosEntregados'] = 0;
    objListado['personas'] = arrayPersonas;
    objListado['numberFoto'] = Math.round(Math.random() * (7 - 1) + 1);

    setTimeout(() => {
      document.getElementById('titleInitial').style.display = 'none';
      document.getElementsByTagName('svg')[0].style.display = 'none';
      document.getElementById('myImg').style.display = 'block';
      document.getElementById('myTitle').style.display = 'block';
      document.getElementById('buttonEnd').setAttribute('disabled', 'false');

      this.oficios.makeListOficios(objListado);

    }, 1600);
  }
}
