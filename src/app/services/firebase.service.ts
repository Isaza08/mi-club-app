import { Injectable, NgZone, inject } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  Query,
  CollectionReference,
  DocumentReference,
  DocumentData
} from 'firebase/firestore';
import {
  getStorage,
  FirebaseStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private ngZone = inject(NgZone);

  public app: FirebaseApp;
  public db: Firestore;
  public storage: FirebaseStorage;

  constructor() {
    this.app = initializeApp(environment.firebase);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
  }

  // ─── Storage ─────────────────────────────────────────────────────
  async uploadFile(path: string, file: File): Promise<string> {
    const ref = storageRef(this.storage, path);
    await uploadBytes(ref, file);
    return getDownloadURL(ref);
  }

  // ─── Observable sobre una colección (con idField) ────────────────
  getCollection<T>(pathOrQuery: string | Query<DocumentData>): Observable<T[]> {
    const ref = typeof pathOrQuery === 'string'
      ? collection(this.db, pathOrQuery)
      : pathOrQuery;

    return new Observable<T[]>(subscriber => {
      const unsub = onSnapshot(ref, snapshot => {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T));
        this.ngZone.run(() => subscriber.next(items));
      }, err => {
        console.error('Error en consulta de Firestore:', err);
        this.ngZone.run(() => subscriber.error(err));
      });
      return () => unsub();
    });
  }

  // ─── Observable sobre un documento ──────────────────────────────
  getDocument<T>(path: string): Observable<T> {
    const ref = doc(this.db, path);
    return new Observable<T>(subscriber => {
      const unsub = onSnapshot(ref, snapshot => {
        this.ngZone.run(() => subscriber.next({ id: snapshot.id, ...snapshot.data() } as T));
      }, err => this.ngZone.run(() => subscriber.error(err)));
      return () => unsub();
    });
  }

  // ─── Escritura ───────────────────────────────────────────────────
  async addDocument(path: string, data: object): Promise<DocumentReference> {
    const ref = collection(this.db, path);
    return addDoc(ref, data);
  }

  async updateDocument(path: string, data: object): Promise<void> {
    const ref = doc(this.db, path);
    return updateDoc(ref, data);
  }

  async deleteDocument(path: string): Promise<void> {
    const ref = doc(this.db, path);
    return deleteDoc(ref);
  }
}
