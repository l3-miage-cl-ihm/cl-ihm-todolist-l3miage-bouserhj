import { Component, OnInit, ChangeDetectionStrategy, Injectable, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { TodoItem, TodoList, TodolistService } from '../todolist.service';


type FctFilter = (item: TodoItem) => boolean;
interface TodoListPlus extends TodoList {
  remaining: number;
  filter: FctFilter;
  displayedItems: readonly TodoItem[];
  allDone: boolean;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {
  @Input() data!: TodoList;

  readonly allItems: FctFilter = () => true;
  readonly completedItems: FctFilter = (item) => item.isDone;
  readonly activeItems: FctFilter = (item) => !item.isDone;

  private filterBS = new BehaviorSubject<FctFilter>(this.allItems);

  readonly todoListObs: Observable<TodoListPlus>;

  constructor(private todoListService:TodolistService, public fireAuth:AngularFireAuth) {
    this.todoListObs = combineLatest([todoListService.observable, this.filterBS]).pipe(
      map( ([L, f]) => ({
        ...L, // je recopie ma TodoList
        remaining: L.items.reduce( (nb, item) => item.isDone ? nb : nb + 1, 0),
        filter: f,
        displayedItems: L.items.filter(f),
        // allDone: !L.items.find( it => !it.isDone ),
      }) ),
      map( inter => ({
        ...inter,
        allDone: inter.remaining === 0
      }) )
    );
  }

  ngOnInit(): void {
  }

  ajouter(label: string): void {
    this.todoListService.create(label);
  }

  mettreAjour(up: Partial<TodoItem>, ...items: TodoItem[]): void {
    this.todoListService.update(up, ...items);
  }

  supprimer(item: TodoItem): void {
    this.todoListService.delete(item);
  } 
  // ^ cette méthode est utile pour remonter la suppression du service item au service list, 
  // puis du service list au service de la composante racine


  setFilter(f: FctFilter): void {
    this.filterBS.next(f);
  }

  updateAllDone(done: boolean, L: readonly TodoItem[]): void {
    this.mettreAjour({isDone: done}, ...L); //updates all items as done
    // utilisation d'un booleen en parametre et non pas juste "true" pour pouvoir décocher aussi
  }

  supprimerAllDone(L: readonly TodoItem[]): void {
    let completedItems = L.filter(this.completedItems);
    completedItems.map(item => this.supprimer(item));
    // deletes all the done items
  }

  login() {
    this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.fireAuth.signOut();
  }
 
}
