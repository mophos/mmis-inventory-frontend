import { UsersService } from './../../users.service';
import { AlertService } from './../../alert.service';
import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wm-change-password-modal',
  templateUrl: './chage-password-modal.component.html',
  styleUrls: ['./chage-password-modal.component.css']
})
export class ChangePasswordModalComponent implements OnInit {

  @Output("onSuccess") onSuccess = new EventEmitter<boolean>();

  password: any = '';
  password2: any = '';
  open: boolean = false;
  isSaving: boolean = false;

  constructor(
    private userService: UsersService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  openModal() {
    this.open = true;
  }

  chanagePassword() {
    this.isSaving = true;
    this.alertService.confirm('ต้องการเปลี่ยนรหัสผ่าน ใช่หรือไม่?')
      .then(() => {
        this.userService.changePassword(this.password)
          .then((rs: any) => {
            if (rs.ok) {
              this.isSaving = false;
              this.alertService.success();
              this.open = false;
              this.onSuccess.emit(true);
            } else {
              this.isSaving = false;
              this.alertService.error(rs.error);
            }
          })
          .catch((error: any) => {
            this.isSaving = false;
            this.alertService.error(error.message);
          })
      }).catch(() => { });
  }

  closeModal() {
    this.onSuccess.emit(true);
    this.open = false;
    this.password = '';
    this.password2 = '';
  }

}
