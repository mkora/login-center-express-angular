import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

import { AuthService } from '../auth.service';

import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    this.authService
      .getAuthenticate(this.username, this.password)
      .then(data => {
        if (data.success === false) {
          this.flashMessagesService.show(
            `Something went wrong! Details: ${data.msg}`,
            { cssClass: 'alert-danger', timeout: 6000 });
          this.router.navigate(['/login']);
        } else {
          this.authService.authUser = data.user;
          this.authService.authToken = data.token;
          this.flashMessagesService.show(
            `You're now logged in!`,
            { cssClass: 'alert-success', timeout: 3000 });
          this.router.navigate(['/profile']);
        }
      });
  }

}
