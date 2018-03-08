import { Component, Inject } from '@angular/core';

@Component({
  selector: 'wm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(@Inject('API_URL') private url: string) {
    console.log(this.url);
  }
}
