import { Injectable } from '@angular/core';
import { TodoList } from './todolist.service';
import firebase from 'firebase/compat/app';
import { combineLatest, map, Observable, of, shareReplay, Subscription, switchMap } from 'rxjs';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

type TodoListState = { user : undefined} | { user : firebase.User, TDL : TodoList}

@Injectable({
  providedIn: 'root'
})
export class TodoFirestoreService {

  readonly observable!: Observable<TodoListState>;
  private state: TodoListState = {user: undefined};
  private subscriptionState!: Subscription;

  constructor(fireAuth: AngularFireAuth, fireStoreDB: AngularFirestore) { 
    this.observable = combineLatest([
      fireAuth.authState,
      fireAuth.authState.pipe(
        switchMap( U => {
          if (U) {
            return fireStoreDB.doc<TodoList>(`/${U.uid}/default`).valueChanges().pipe(
              map( L => L ?? {label: "Défaut", items: []})
            );
          } 
          else {
            return of({label: "unlogged", items: []});
          }
        })
      )
    ]).pipe(
      map( ([user, TDL]) => ! !user ? {user, TDL} : {user: undefined} ),
      shareReplay(1)
    );
    this.subscriptionState = this.observable.subscribe( S => this.state = S );
  }

}
