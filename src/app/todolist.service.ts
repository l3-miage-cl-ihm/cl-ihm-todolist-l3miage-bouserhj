import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';

export interface TodoItem {
  readonly label: string;
  readonly isDone: boolean;
  readonly id: number;
}

export interface TodoList {
  readonly label: string;
  readonly items: readonly TodoItem[];
}

let idItem = 0;
const savedListName = 'TODOLIST MIAGE';
const defaultList: TodoList = {label: 'L3 MIAGE', items: []};

@Injectable({
  providedIn: 'root'
})
export class TodolistService /*implements OnDestroy*/{
  //private abo: Subscription;
  private subj = new BehaviorSubject<TodoList>(
    //localStorage.getItem(savedListName) ? JSON.parse(localStorage.getItem(savedListName)): defaultList);
    {label: 'L3 MIAGE', items: []});
  readonly observable = this.subj.asObservable();

  // si personne ne s'abonne à un observable, le code qui est dedans n'est jamais exécuté.
  // l'observable est froid --> utiliser share pour le rendre chaud


  constructor(private firestore: AngularFirestore) {
    /*this.abo = this.observable.subscribe( L => localStorage.setItem(savedListName, JSON.stringify(L)) )
    // abo = abonnement
*/
  }

  ngOnDestroy(){
    //this.abo.unsubscribe();
  }

  create(...labels: readonly string[]): this {
    const L: TodoList = this.subj.value;
    this.subj.next( {
      ...L,
      items: [
        ...L.items,
        ...labels.filter( l => l !== '').map(
            label => ({label, isDone: false, id: idItem++})
          )
      ]
    } );
    this.firestore.doc<TodoList>(`items/`+L.items).set(L, {merge: true});
    return this;
  }

  delete(...items: readonly TodoItem[]): this {
    const L = this.subj.value;
    this.subj.next( {
      ...L,
      items: L.items.filter(item => items.indexOf(item) === -1 )
    } );
    this.firestore.doc<TodoList>(`items/`+L.items).set(L, {merge: true});
    return this;
  }

  update(data: Partial<TodoItem>, ...items: readonly TodoItem[]): this {
    if(data.label !== "") {
      const L = this.subj.value;
      this.subj.next( {
        ...L,
        items: L.items.map( item => items.indexOf(item) >= 0 ? {...item, ...data} : item )
      } );
      this.firestore.doc<TodoList>(`items/`+L.items).set(L, {merge: true});
    } else {
      this.delete(...items);
    }
    return this;
  }

  //convert JSON to do list into a string
 //var laToDoListSauvegardee = JSON.stringify(TodolistService);
 
 //save it with local storage
 //window.localStorage.setItem('TodolistService', laToDoListSauvegardee);
 
 //get to do list and convert it back JSON
 //var recupDeLaToDoListSauvegardee = JSON.parse(window.localStorage.getItem());

 /*
 <script>
        
    // Convert the ToDoList object into JSON string and save it into storage
    localStorage.setItem("toDo", JSON.stringify(obsL));
        
    // Retrieve the JSON string
    var jsonString = localStorage.getItem("toDo");
        
    // Parse the JSON string back to TS object
    obsL = JSON.parse(jsonString);
</script>
*/
}
 