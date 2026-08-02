import { Injectable, inject } from '@angular/core';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';

export type Rol = 'Administrador' | 'Consejero';

export interface PerfilUsuario {
  uid: string;
  email: string;
  nombre: string;
  rol: Rol;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private fbService = inject(FirebaseService);
  private auth: Auth;

  private perfilSubject = new BehaviorSubject<PerfilUsuario | null | undefined>(undefined);
  perfil$: Observable<PerfilUsuario | null | undefined> = this.perfilSubject.asObservable();

  constructor() {
    this.auth = getAuth(this.fbService.app);
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (!user) {
        this.perfilSubject.next(null);
        return;
      }
      const perfil = await this.cargarPerfil(user);
      this.perfilSubject.next(perfil);
    });
  }

  get perfilActual(): PerfilUsuario | null | undefined {
    return this.perfilSubject.value;
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
    // Espera a que onAuthStateChanged termine de cargar el perfil desde Firestore
    // antes de continuar, para que el guard de rutas no lea el estado anterior (null).
    await firstValueFrom(this.perfil$.pipe(filter(perfil => !!perfil)));
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  private async cargarPerfil(user: User): Promise<PerfilUsuario> {
    const ref = doc(this.fbService.db, `usuarios/${user.uid}`);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : null;

    return {
      uid: user.uid,
      email: user.email ?? '',
      nombre: data?.['nombre'] ?? user.email ?? 'Usuario',
      rol: (data?.['rol'] as Rol) ?? 'Consejero'
    };
  }
}
