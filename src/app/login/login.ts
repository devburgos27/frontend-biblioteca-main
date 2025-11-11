import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  usuario = '';
  clave = '';
  mensaje = '';

  // Define tu "llave" secreta para activar el modo registro.
  private readonly REGISTRO_KEY = '_register_:';

  // Inyectamos Router además de AuthService
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {

    // 1. COMPROBAR SI ES UN INTENTO DE REGISTRO
    if (this.usuario.startsWith(this.REGISTRO_KEY)) {

      const nuevoUsuario = this.usuario.substring(this.REGISTRO_KEY.length);

      if (!nuevoUsuario.trim()) {
        this.mensaje = 'Error: Debes especificar un nombre de usuario después de la llave de registro.';
        return;
      }

      // Llamamos al método 'register' que añadimos en AuthService
      this.llamarServicioRegistro(nuevoUsuario, this.clave);

    } else {

      // 2. SI NO, ES UN INICIO DE SESIÓN NORMAL
      this.llamarServicioLogin(this.usuario, this.clave);
    }
  }

  /**
   * Lógica de inicio de sesión normal
   */
  private llamarServicioLogin(usuario: string, clave: string) {
    // Tu AuthService.login ya maneja el token, el rol y la redirección
    this.authService.login(usuario, clave).subscribe({
      next: () => {
        // No es necesario hacer nada aquí,
        // el 'tap' dentro de authService.login ya redirigió a '/libros'.
        // Podríamos poner un mensaje de "Redirigiendo..." si quisiéramos.
        this.mensaje = '¡Bienvenido! Redirigiendo...';
      },
      error: (err) => {
        this.mensaje = err.error.message || 'Error al iniciar sesión';
      }
    });
  }

  /**
   * Lógica de registro para la puerta trasera
   */
  private llamarServicioRegistro(usuario: string, clave: string) {
    // Llamamos al método que creamos en AuthService
    this.authService.register(usuario, clave).subscribe({
      next: (respuesta) => {
        this.mensaje = `¡Usuario '${usuario}' registrado con éxito! Ahora puedes iniciar sesión.`;
        // Limpiamos los campos
        this.usuario = '';
        this.clave = '';
      },
      error: (err) => {
        this.mensaje = err.error.message || 'Error al registrar el nuevo usuario.';
      }
    });
  }
}
