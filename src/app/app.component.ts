import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoItem, TodoList, TodolistService } from './todolist.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'l3m-tpX-todolist-angular-y2022';

  readonly obsL : Observable<TodoList> | undefined;

  constructor(private tdlS : TodolistService, public auth: AngularFireAuth) {
    this.obsL = tdlS.observable;
  }

  create(label : string) : void {
    this.tdlS.create(label);
  }

  update(item : TodoItem, up : Partial<TodoItem>) : void {
    this.tdlS.update(up, item);
  }

  delete(item : TodoItem) : void {
    this.tdlS.delete(item);
  }

  trackById(i : number, item : TodoList) : number {
    return item.items[i].id;
  } 

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.auth.signOut();
  }
}
