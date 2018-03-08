import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wm-deny',
  templateUrl: './deny.component.html',
  styleUrls: ['./deny.component.css']
})
export class DenyComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['login']);
  }

}
