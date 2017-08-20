import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit() {
    this.authService
      .getProfile()
      .then(data => {
        if (!data.success) {
          this.flashMessagesService.show(
            `Something went wrong!`,
            { cssClass: 'alert-danger', timeout: 6000 });
          this.router.navigate(['/login']);
        }
      });
  }

}
