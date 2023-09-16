import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { AdminService } from 'src/app/services/admin.service';
import { ModalService } from 'src/app/services/modal.service';

declare const jQuery: any;
declare const $: any;

@Component({
  selector: 'app-index-admin',
  templateUrl: './index-admin.component.html',
  styleUrls: ['./index-admin.component.css']
})
export class IndexAdminComponent implements OnInit, OnDestroy {
  admins: Admin[] = [];
  filteredAdmin = '';
  page = 1;
  pageSize = 20;
  token = '';
  modalSwitch!: boolean;
  modalSubscription$: any = Subscription;
  adminSubscription$: any = Subscription;
  dataLoading = true;
  adminToDelete!: string;

  constructor( private adminService: AdminService, private modalService: ModalService) { }

  ngOnInit(): void {
    this.token = this.adminService.getToken();
    this.getAdmins();
    this.modalSubscription$ = this.modalService.getModalState().subscribe((modalState: boolean) => {
      this.modalSwitch = modalState;
    });
  }

  ngOnDestroy(): void {
    this.modalSubscription$.unsubscribe();
    this.adminSubscription$.unsubscribe();
  }

  private getAdmins(): void {
      this.adminSubscription$ = this.adminService.getAdmins(this.token).subscribe(admins => {
        this.admins = admins.data;
        this.dataLoading = false;
      });
  }

  openModal(admin: any, item: string): void {
    this.adminService.setAdminToDelete(admin); // the admin to delete is set so the modal can access the id to delete the recocrd
    this.modalService.openModal(item);
    this.modalSubscription$ = this.modalService.getModalState().subscribe((modalState: boolean) => {
      this.modalSwitch = modalState;
    });

  }

  onCloseModal(event: void): void {
    this.getAdmins();
  }

}
