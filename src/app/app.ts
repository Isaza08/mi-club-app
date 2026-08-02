import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'mi-club-app';

  private authService = inject(AuthService);
  private router = inject(Router);

  perfil = toSignal(this.authService.perfil$, { initialValue: undefined });

  enLogin = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects.startsWith('/login')),
      startWith(this.router.url.startsWith('/login'))
    ),
    { initialValue: this.router.url.startsWith('/login') }
  );

  async logout() {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }
}
