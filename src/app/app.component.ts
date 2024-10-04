import { Component } from '@angular/core';
// import * as CryptoJS from 'crypto-js'; // Importamos CryptoJS para el cifrado y hash


import { FormsModule } from '@angular/forms'; // Importamos FormsModule
import { CommonModule } from '@angular/common'; // Importamos CommonModule
import { SidebarModule } from 'primeng/sidebar';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    InputNumberModule,
    SidebarModule,
    CommonModule,
    DialogModule,
  ],
})
export class AppComponent {
  // Variables para los datos personales
  // Variables para controlar la visibilidad de los diálogos
  visible: boolean = false;
  visible2: boolean = false;
  visible3: boolean = false;
  visible4: boolean = false;
  visible5: boolean = false;
  longitudBaston: number = 1; // Longitud del bastón para el cifrado

  columnas: number = 5; // Puedes ajustar el número de columnas según prefieras.

  amount: number = 25; // Valor inicial para el input numérico
  desplazamiento: number = 3; // Desplazamiento para el cifrado

  // Métodos para mostrar y ocultar los formularios en los diálogos
  showDialog(option: number) {
    this.resetDialogs(); // Reseteamos para evitar que se superpongan
    switch (option) {
      case 1:
        this.visible = true;
        break;
      case 2:
        this.visible2 = true;
        break;
      case 3:
        this.visible3 = true;
        break;
      case 4:
        this.visible4 = true;
        break;
      case 5:
        this.visible5 = true;
        break;
    }
  }

  resetDialogs() {
    // Reseteamos todas las variables de visibilidad
    this.visible = false;
    this.visible2 = false;
    this.visible3 = false;
    this.visible4 = false;
    this.visible5 = false;
  }

  textoCifrar: string = '';
  textoDescifrar: string = '';
  resultadoCifrado: string = '';
  resultadoDescifrado: string = '';

  // Cifrado César
  cifrarTexto(): void {
    this.resultadoCifrado = this.cifradoCesar(
      this.textoCifrar,
      this.desplazamiento
    );
  }

  // Descifrado César
  descifrarTexto(): void {
    this.resultadoDescifrado = this.cifradoCesar(
      this.textoDescifrar,
      -this.desplazamiento
    );
  }

  // Lógica para cifrar y descifrar (César)
  cifradoCesar(texto: string, desplazamiento: number): string {
    return texto
      .split('')
      .map((char) => {
        const codigo = char.charCodeAt(0);

        // Verificar si el carácter es una letra mayúscula
        if (codigo >= 65 && codigo <= 90) {
          return String.fromCharCode(
            ((codigo - 65 + desplazamiento + 26) % 26) + 65
          );
        }
        // Verificar si el carácter es una letra minúscula
        else if (codigo >= 97 && codigo <= 122) {
          return String.fromCharCode(
            ((codigo - 97 + desplazamiento + 26) % 26) + 97
          );
        }
        // Si no es una letra, devolver el carácter sin cambios
        return char;
      })
      .join('');
  }

  cifrarTextoEscitala(): void {
    const texto = this.textoCifrar.replace(/\s/g, ''); // Removemos espacios
    let cifrado = '';

    // Iteramos por columnas y luego por filas para reorganizar el texto
    for (let col = 0; col < this.columnas; col++) {
      for (let row = col; row < texto.length; row += this.columnas) {
        cifrado += texto[row];
      }
    }

    this.resultadoCifrado = cifrado;
  }

  // Método para descifrar usando la técnica de escítala
  descifrarTextoEscitala(): void {
    const texto = this.textoDescifrar.replace(/\s/g, ''); // Removemos espacios
    const filas = Math.ceil(texto.length / this.columnas); // Número de filas
    let descifrado = new Array(filas)
      .fill('')
      .map(() => new Array(this.columnas).fill(''));
    let index = 0;

    // Llenamos la tabla con los caracteres del texto cifrado
    for (let col = 0; col < this.columnas; col++) {
      for (let row = 0; row < filas; row++) {
        if (index < texto.length) {
          descifrado[row][col] = texto[index++];
        }
      }
    }

    // Aplanamos la tabla y unimos los caracteres para obtener el texto descifrado
    this.resultadoDescifrado = descifrado.flat().join('');
  }
  // Restablecer diálogos
}
