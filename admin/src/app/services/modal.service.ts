import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalOpen = new BehaviorSubject<boolean>(false);
  itemToDelete!: string;

  constructor() { }

  openModal(item: string): void {
    this.modalOpen.next(true);
    this.itemToDelete = item;
  }

  closeModal(): void {
    this.modalOpen.next(false);
  }

  getModalState() {
    return this.modalOpen.asObservable();
  }

  getItemToDelete(): string {
    return this.itemToDelete;
  }
}
