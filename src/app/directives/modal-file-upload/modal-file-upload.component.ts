import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { UploadingService } from './../../uploading.service';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'wm-modal-file-upload',
  templateUrl: './modal-file-upload.component.html',
  styles: []
})
export class ModalFileUploadComponent implements OnInit {
  open: any;
  @Output('onClose') onClose: EventEmitter<any> = new EventEmitter<any>();
  @Output('onSuccess') onSuccess: EventEmitter<any> = new EventEmitter<any>();

  files = [];
  isUploading = false;
  loadingFiles = false;
  filePath: string;
  fieldName: any;
  filesToUpload: Array<File>;
  documentCode: any;
  token: any;

  constructor(
    private alertService: AlertService,
    private uploadingService: UploadingService,
    @Inject('DOC_URL') private docUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    this.filesToUpload = [];
  }

  ngOnInit() {
    
  }

  openModal(docId: any, docPrefix: any) {
    this.open = true;
    this.documentCode = `${docPrefix}-${docId}`;
    console.log(this.documentCode);
    
    this.getFilesList();
  }

  closeModal() {
    this.onClose.emit();
    this.open = false;
  }

  saveSuccess() {
    this.onSuccess.emit();
    this.open = false;
  }

  // file upload
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = [];
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  async upload() {

    this.isUploading = true;
    try {
      const result: any = await this.uploadingService.makeFileRequest(this.documentCode, this.filesToUpload)
      this.isUploading = false;
      if (result.ok) {
        this.filesToUpload = [];
        this.alertService.success();
        this.getFilesList();
      } else {
        this.alertService.error(JSON.stringify(result.error));
      }

    } catch (error) {
      this.isUploading = false;
      this.alertService.error(JSON.stringify(error));
    }
  }

  async getFilesList() {
    this.files = [];
    this.loadingFiles = true;
    // const file = `${this.documentPrefix}-${this.documentId}`;
    try {
      let result: any = await this.uploadingService.getFiles(this.documentCode);
      if (result.ok) {
        this.files = result.rows;
      } else {
        this.alertService.error(JSON.stringify(result.error));
      }
      this.loadingFiles = false;
    } catch (error) {
      this.loadingFiles = false;
      this.alertService.error(error.message);
    }

  }

  getFile(documentId) {
    const url = `${this.docUrl}/uploads/files/${documentId}`;
    window.open(url, '_blank');
  }

  async removeFile(documentId, idx) {
    this.alertService.confirm('คุณต้องการลบไฟล์นี้ ใช่หรือไม่?')
      .then(() => {
        this.uploadingService.removeFile(documentId)
          .then((result: any) => {
            if (result.ok) {
              this.files.splice(idx, 1);
            } else {
              this.alertService.error(JSON.stringify(result.error));
            }
          })
          .catch(() => {
            this.alertService.serverError();
          });
      })
      .catch(() => {
        // cancel
      });
  }

}
