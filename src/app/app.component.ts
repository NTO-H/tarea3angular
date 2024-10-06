import { Component } from '@angular/core';
import * as hash from 'hash.js';

// import *
// Importar la biblioteca whirlpool
// import * as Whirlpool from 'whirlpool';                                          
//  as CryptoJS from 'crypto-js'; // Importamos CryptoJS para el cifrado y hash
//  // Importar la biblioteca whirlpool
// import * as Whirlpool from 'whirlpool';
import { FormsModule } from '@angular/forms'; // Importamos FormsModule
import { CommonModule } from '@angular/common'; // Importamos CommonModule
import { SidebarModule } from 'primeng/sidebar';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import * as CryptoJS from 'crypto-js';
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
  password: string = 'encryption-pw';

  texto: string = '';
  resultado: string = '';

  // Método para calcular el hash usando Whirlpool

  // Método para calcular el hash usando Whirlpool
  columnas: number = 5; // Puedes ajustar el número de columnas según prefieras.

  amount: number = 25; // Valor inicial para el input numérico
  desplazamiento: number = 3; // Desplazamiento para el cifrado
  hashText() {
    if (this.texto) {
      // Calcular el hash usando SHA-256
      this.resultado = CryptoJS.SHA256(this.texto).toString(CryptoJS.enc.Hex);
    }
    
  }
  // Métodos para mostrar y ocultar los formularios en los diálogos
  showDialog(option: number) {
    this.limpiarVariables()
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


  // Función de cifrado XTEA
 
  // Función de cifrado XTEA
  encryptTEA(v: number[], k: number[]): void {
    let v0 = v[0], v1 = v[1], sum = 0;
    const delta = 0x9e3779b9; // constante de programación de claves
    const k0 = k[0], k1 = k[1], k2 = k[2], k3 = k[3]; // cache key

    for (let i = 0; i < 32; i++) { // ciclo básico
      sum += delta;
      v0 += ((v1 << 4) + k0) ^ (v1 + sum) ^ ((v1 >> 5) + k1);
      v1 += ((v0 << 4) + k2) ^ (v0 + sum) ^ ((v0 >> 5) + k3);
    }
    v[0] = v0; 
    v[1] = v1;
  }

  // Función de descifrado XTEA
  decryptTEA(v: number[], k: number[]): void {
    let v0 = v[0], v1 = v[1], sum = 0xC6EF3720; // inicializa la suma para el descifrado
    const delta = 0x9e3779b9; // constante de programación de claves
    const k0 = k[0], k1 = k[1], k2 = k[2], k3 = k[3]; // cache key

    for (let i = 0; i < 32; i++) { // ciclo básico
      v1 -= ((v0 << 4) + k2) ^ (v0 + sum) ^ ((v0 >> 5) + k3);
      v0 -= ((v1 << 4) + k0) ^ (v1 + sum) ^ ((v1 >> 5) + k1);
      sum -= delta;
    }
    v[0] = v0; 
    v[1] = v1;
  }

  // Convertir texto a array de números (ejemplo simple)
  private textToNumbers(text: string): number[] {
    return Array.from(text).map(char => char.charCodeAt(0));
  }


  
  // Convertir array de números a texto
  private numbersToText(numbers: number[]): string {
    return String.fromCharCode(...numbers);
  }





// TEA
 // Función para cifrar


encrypt(plaintext: string, password: string): string {
  var v = new Array(2), k = new Array(4), s = "", i;
  plaintext = escape(plaintext);  // codificación para evitar problemas de caracteres especiales

  for (i = 0; i < 4; i++) {
    k[i] = this.str4ToLong(password.slice(i * 4, (i + 1) * 4));
  }

  for (i = 0; i < plaintext.length; i += 8) {
    v[0] = this.str4ToLong(plaintext.slice(i, i + 4));
    v[1] = this.str4ToLong(plaintext.slice(i + 4, i + 8));
    this.code(v, k);
    s += this.longToStr4(v[0]) + this.longToStr4(v[1]);
  }

  return this.escCtrlCh(s);
}

decrypt(ciphertext: string, password: string): string {
  var v = new Array(2), k = new Array(4), s = "", i;
  for (i = 0; i < 4; i++) {
    k[i] = this.str4ToLong(password.slice(i * 4, (i + 1) * 4));
  }

  ciphertext = this.unescCtrlCh(ciphertext);

  for (i = 0; i < ciphertext.length; i += 8) {
    v[0] = this.str4ToLong(ciphertext.slice(i, i + 4));
    v[1] = this.str4ToLong(ciphertext.slice(i + 4, i + 8));
    this.decode(v, k);
    s += this.longToStr4(v[0]) + this.longToStr4(v[1]);
  }

  s = s.replace(/\0+$/, '');  // eliminar caracteres nulos al final
  return unescape(s);
}

code(v: number[], k: number[]) {
  var y = v[0], z = v[1];
  var delta = 0x9E3779B9, limit = delta * 32, sum = 0;

  while (sum != limit) {
    y += (z << 4 ^ z >>> 5) + z ^ sum + k[sum & 3];
    sum += delta;
    z += (y << 4 ^ y >>> 5) + y ^ sum + k[(sum >>> 11) & 3];
  }

  v[0] = y;
  v[1] = z;
}


decode(v: number[], k: number[]) {
  var y = v[0], z = v[1];
  var delta = 0x9E3779B9, sum = delta * 32;

  while (sum != 0) {
    z -= (y << 4 ^ y >>> 5) + y ^ sum + k[(sum >>> 11) & 3];
    sum -= delta;
    y -= (z << 4 ^ z >>> 5) + z ^ sum + k[sum & 3];
  }

  v[0] = y;
  v[1] = z;
}

str4ToLong(s: string): number {
  var v = 0;
  for (var i = 0; i < 4; i++) v |= s.charCodeAt(i) << i * 8;
  return isNaN(v) ? 0 : v;
}

longToStr4(v: number): string {
  return String.fromCharCode(v & 0xFF, (v >> 8) & 0xFF, (v >> 16) & 0xFF, (v >> 24) & 0xFF);
}

escCtrlCh(str: string): string {
  return str.replace(/[\0\t\n\v\f\r\xa0'"!]/g, function (c) { return '!' + c.charCodeAt(0) + '!'; });
}

unescCtrlCh(str: string): string {
  return str.replace(/!\d\d?\d?!/g, function (c) { return String.fromCharCode(parseInt(c.slice(1, -1))); });
}


// Generar la clave a partir de la contraseña (arreglo de 4 enteros de 32 bits)
generarClave(password: string): number[] {
  let key = [0, 0, 0, 0];
  for (let i = 0; i < password.length; i++) {
    key[i % 4] = (key[i % 4] << 8) + password.charCodeAt(i); // Rellenar el array de claves
  }
  return key;
}

// TEA Encryption
teaEncrypt(texto: string, key: number[]): number[] {
  let v0 = this.stringToBytes(texto)[0]; // Primera mitad del texto
  let v1 = this.stringToBytes(texto)[1]; // Segunda mitad del texto
  const delta = 0x9e3779b9;
  let sum = 0;
  for (let i = 0; i < 32; i++) {
    sum += delta;
    v0 += ((v1 << 4) + key[0]) ^ (v1 + sum) ^ ((v1 >>> 5) + key[1]);
    v1 += ((v0 << 4) + key[2]) ^ (v0 + sum) ^ ((v0 >>> 5) + key[3]);
  }
  return [v0, v1];
}

// TEA Decryption
teaDecrypt(textoCifrado: number[], key: number[]): number[] {
  let v0 = textoCifrado[0];
  let v1 = textoCifrado[1];
  const delta = 0x9e3779b9;
  let sum = delta * 32;
  for (let i = 0; i < 32; i++) {
    v1 -= ((v0 << 4) + key[2]) ^ (v0 + sum) ^ ((v0 >>> 5) + key[3]);
    v0 -= ((v1 << 4) + key[0]) ^ (v1 + sum) ^ ((v1 >>> 5) + key[1]);
    sum -= delta;
  }
  return [v0, v1];
}

// Convertir una cadena a un arreglo de bytes (dividir en dos partes)
stringToBytes(texto: string): number[] {
  let bytes = new Array(2).fill(0);
  for (let i = 0; i < texto.length; i++) {
    bytes[i % 2] = (bytes[i % 2] << 8) + texto.charCodeAt(i);
  }
  return bytes;
}

// Convertir bytes a string
bytesToString(bytes: number[]): string {
  let resultado = '';
  for (let i = 0; i < bytes.length; i++) {
    resultado += String.fromCharCode((bytes[i] >> 8) & 0xff, bytes[i] & 0xff);
  }
  return resultado.replace(/\0/g, ''); // Quitar posibles caracteres nulos
}

// Convertir un array de enteros a hexadecimal
arrayToHex(array: number[]): string {
  return array
    .map((num) => ('00000000' + num.toString(16)).slice(-8))
    .join('');
}

// Convertir de hexadecimal a un array de enteros
hexToArray(hex: string): number[] {
  let array = [];
  for (let i = 0; i < hex.length; i += 8) {
    array.push(parseInt(hex.substring(i, i + 8), 16));
  }
  return array;
}
  // 
  onCifrar(): void {
    const key = [0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210]; // Clave de ejemplo
    const v = this.textToNumbers(this.textoCifrar);
    const paddedV = [v[0] || 0, v[1] || 0]; // Asegurarse de que 'v' tenga dos bloques

    // Llamada a la función de cifrado
    this.encryptTEA(paddedV, key);
    this.resultadoCifrado = this.numbersToText(paddedV);
  }

  onDescifrar(): void {
    const key = [0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210]; // Clave de ejemplo
    const v = this.textToNumbers(this.textoDescifrar);
    const paddedV = [v[0] || 0, v[1] || 0]; // Asegurarse de que 'v' tenga dos bloques

    // Llamada a la función de descifrado
    this.decryptTEA(paddedV, key);
    this.resultadoDescifrado = this.numbersToText(paddedV);
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
      this.texto,
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
  limpiarVariables(): void {
    this.password = '';
    this.textoCifrar = '';
    this.textoDescifrar = '';
    this.resultadoCifrado = '';
    this.resultadoDescifrado = '';
  }
  
  // Restablecer diálogos
}
