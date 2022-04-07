import { Injectable } from '@angular/core';
import { TodoList } from './todolist.service';
import firebase from 'firebase/compat/app';

type TodoListState = { user : undefined} | { user : firebase.User, TDL : TodoList}

@Injectable({
  providedIn: 'root'
})
export class TodoFirebaseService {

  constructor() { }
}
