import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'wm-page-not-found',
  templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent implements OnInit {
  redirectUrl: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.redirectUrl = this.route.snapshot.params.url;
  }

  ngOnInit() {
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
