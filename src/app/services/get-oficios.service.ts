import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DireccionesOficios, StgoCentro } from './direcciones.interface';
import { PersonasOficios } from './personas.interface';

import { map } from 'rxjs/operators';
import { MiListadoOficios, OficiosListado } from './listado.interface';

@Injectable({
  providedIn: 'root'
})
export class GetOficiosService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  getAllOficios() {
    return this.firestore.collection('oficios').doc('listadoDeOficios').valueChanges();
  }

  getPeople() {
    return this.firestore.collection('oficios').doc('personasOficios').valueChanges();
  }

  getPlaces() {
    return this.firestore.collection('oficios').doc('direccionesOficios').valueChanges();
  }

  addPerson(nombre: string) {
    let key = true;
    const persona = {
      nombre,
      fecha: (new Date() + '').split(' GM')[0]
    };
    let personas = [];
    this.firestore.collection('oficios').doc('personasOficios').valueChanges().subscribe(
      (data: any) => {
        personas = (data.personas as []);
        personas.unshift(persona);
        if (key) {
          this.firestore.collection('oficios').doc('personasOficios').set({
            personas
          }, { merge: true });
          key = false;
        }
      }
    );
  }

  addPlace(
    lugar: string,
    calle: string,
    numero: number,
    piso: number,
    mapa: string
  ) {
    let key = true;
    const ubicacion = {
      lugar,
      calle,
      numero,
      piso,
      mapa,
      fecha: (new Date() + '').split(' GM')[0],
      isHorario: false
    };
    let direcciones = [];
    this.firestore.collection('oficios').doc('direccionesOficios').valueChanges().subscribe(
      (data: DireccionesOficios) => {
        direcciones = data.santiagoCentro;
        direcciones.unshift(ubicacion);
        if (key) {
          this.firestore.collection('oficios').doc('direccionesOficios').set({
            santiagoCentro: direcciones
          }, { merge: true });
          key = false;
        }
      }
    );
  }

  removePlace(position: number) {
    let key = true;
    let direcciones = [];
    this.firestore.collection('oficios').doc('direccionesOficios').valueChanges().subscribe(
      (data: DireccionesOficios) => {
        direcciones = data.santiagoCentro;

        direcciones.splice(position, 1);

        if (key) {
          this.firestore.collection('oficios').doc('direccionesOficios').set({
            santiagoCentro: direcciones
          }, { merge: true });
          key = false;
        }
      }
    );
  }

  removePerson(position: number) {
    let key = true;
    let grupoPersonas = [];
    this.firestore.collection('oficios').doc('personasOficios').valueChanges().subscribe(
      (data: PersonasOficios) => {
        grupoPersonas = data.personas;
        console.log(grupoPersonas);
        grupoPersonas.splice(position, 1);
        console.log(grupoPersonas);
        if (key) {
          this.firestore.collection('oficios').doc('personasOficios').set({
            personas: grupoPersonas
          }, { merge: true });
          key = false;
        }
      }
    );
  }

  updatePlace(
    position: number,
    lugar: string,
    calle: string,
    numero: number,
    piso: number,
    mapa: string
  ) {
    let key1 = true;
    let direcciones1 = [];
    this.firestore.collection('oficios').doc('direccionesOficios').valueChanges().subscribe(
      (data1: DireccionesOficios) => {
        direcciones1 = data1.santiagoCentro;
        direcciones1.splice(position, 1);
        if (key1) {
          this.firestore.collection('oficios').doc('direccionesOficios').set({
            santiagoCentro: direcciones1
          }, { merge: true }).then(
            () => {
              let key = true;
              const ubicacion = {
                lugar,
                calle,
                numero,
                piso,
                mapa,
                fecha: (new Date() + '').split(' GM')[0]
              };
              let direcciones = [];
              this.firestore.collection('oficios').doc('direccionesOficios').valueChanges().subscribe(
                (data: DireccionesOficios) => {
                  direcciones = data.santiagoCentro;
                  direcciones.unshift(ubicacion);
                  if (key) {
                    this.firestore.collection('oficios').doc('direccionesOficios').set({
                      santiagoCentro: direcciones
                    }, { merge: true });
                    key = false;
                  }
                }
              );


            }
          );
          key1 = false;
        }
      }
    );
  }

  addTime(position: number, inicio: string, termino: string) {
    let newData: DireccionesOficios;
    let key = true;
    this.firestore.collection('oficios').doc('direccionesOficios').valueChanges().subscribe(
      (data: DireccionesOficios) => {
        newData = data;
        newData.santiagoCentro[position].horario = `${inicio}%20${termino}`;
        newData.santiagoCentro[position].isHorario = true;

        if (key) {
          this.firestore.collection('oficios').doc('direccionesOficios').set({
            santiagoCentro: newData.santiagoCentro
          }, { merge: true });
          key = false;
        }
      }
    );
  }

  getDataPlacesByName(place: string) {
    let direcciones: StgoCentro[];
    this.firestore.collection('oficios').doc('direccionesOficios').valueChanges().pipe(map(
      (data: DireccionesOficios) => {
        direcciones = data.santiagoCentro;

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < direcciones.length; i++) {
          // console.log(direcciones[i]);
          if (direcciones[i].lugar === place) {
            console.log(direcciones[i]);
            return direcciones[i];
          }
        }
      }
    ));
  }

  makeListOficios(objeto: object) {
    let listado = [];
    let key = true;
    this.firestore.collection('oficios').doc('listadoDeOficios').valueChanges().subscribe(
      (data: any) => {
        listado = data.oficios;
        listado.unshift(objeto);

        if (key) {
          this.firestore.collection('oficios').doc('listadoDeOficios').set({
            oficios: listado
          }, { merge: true });
          key = false;
        }
      }
    );
  }

  removeListOficios(index: number) {
    let key = true;
    let listado;
    this.firestore.collection('oficios').doc('listadoDeOficios').valueChanges().subscribe(
      (data: MiListadoOficios) => {

        listado = data.oficios;
        listado.splice(index, 1);

        if (key) {
          this.firestore.collection('oficios').doc('listadoDeOficios').set({
            oficios: listado
          }, { merge: false });
          key = false;
        }
      }
    );
  }

  updateListado(index: number, objeto: any) {
    let key = true;
    let listado: OficiosListado[];
    this.firestore.collection('oficios').doc('listadoDeOficios').valueChanges().subscribe(
      (data: MiListadoOficios) => {

        listado = data.oficios;
        listado[index] = objeto;

        if (key) {
          this.firestore.collection('oficios').doc('listadoDeOficios').set({
            oficios: listado
          }, { merge: false });
          key = false;
        }
      }
    );
  }
}
