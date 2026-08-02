import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  cargando = signal(false);
  error = signal<string | null>(null);

  async ingresar() {
    this.error.set(null);
    this.cargando.set(true);
    try {
      await this.authService.login(this.email, this.password);
      await this.router.navigateByUrl('/');
    } catch {
      this.error.set('Correo o contraseña incorrectos.');
    } finally {
      this.cargando.set(false);
    }
  }
}
