import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { TodoItem, TodoList } from '../todolist.service';

@Component({
  selector: 'app-todo-item[data]',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnInit {
  @Input() data!: TodoItem;
  @Output() remove = new EventEmitter<TodoItem>();
  @Output() update = new EventEmitter<Partial<TodoItem>>();

  @ViewChild("newTextInput") newTextInput!: ElementRef<HTMLInputElement>;
  
  private _editing = false;
  get editing(): boolean {return this._editing}
  set editing(e: boolean) {
    this._editing = e;
    if (this._editing) {
      requestAnimationFrame(
        () => this.newTextInput.nativeElement?.focus()
      );
    }
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  miseAjour(up: Partial<TodoItem>): void {
    this.update.emit(up);
    this.editing = false;
  }

  // j'aurais besoin d'une methode qui utilise l'evenement cree (remove ou update) (elle prend des choses en param)
  // cette methode sera appelée dans la vue correspondante (todo-item html)
}
