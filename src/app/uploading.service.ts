import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class UploadingService {
  token: string;

  constructor(
    @Inject('API_URL') private url: string,
    @Inject('DOC_URL') private docUrl: string,
    private authHttp: AuthHttp
  ) {
    this.token = sessionStorage.getItem('token');
  }

  makeFileRequest(documentCode: string, files: Array<File>, comment: string = null) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();
      for (let i = 0; i < files.length; i++) {
        formData.append("files[]", files[i], files[i].name);
      }
      formData.append('document_code', documentCode);
      formData.append("token", this.token);
      formData.append('comment', comment);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      const url = `${this.docUrl}/uploads`;
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  uploadHisTransaction(files: File) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append("file", files, files.name);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      const url = `${this.url}/his-transaction/upload?token=${this.token}`;
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  uploadTmtMapping(files: File) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append("file", files, files.name);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      const url = `${this.url}/products/mapping/tmt/upload?token=${this.token}`;
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  uploadIssueTransaction(files: File) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append("file", files, files.name);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      const url = `${this.url}/his-transaction/upload/issue?token=${this.token}`;
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  uploadIssueTransactionHIS(files: File) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append("file", files, files.name);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      const url = `${this.url}/his-transaction/upload/issue-his?token=${this.token}`;
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  uploadIssueTransactionMMIS(files: File) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append("file", files, files.name);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      const url = `${this.url}/his-transaction/upload/issue-mmis?token=${this.token}`;
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  uploadStaffIssueTransactionHIS(files: File) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append("file", files, files.name);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      const url = `${this.url}/staff/upload/issue-his?token=${this.token}`;
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  uploadStaffIssueTransactionMMIS(files: File) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append("file", files, files.name);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      const url = `${this.url}/staff/upload/issue-mmis?token=${this.token}`;
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  // =============== document service =============== //
  async getFiles(documentCode) {
    const res: any = await this.authHttp.get(`${this.docUrl}/uploads/info/${documentCode}`).toPromise();
    return res.json();
  }

  async removeFile(documentId) {
    const res: any = await this.authHttp.delete(`${this.docUrl}/uploads/${documentId}`).toPromise();
    return res.json();
  }

}
