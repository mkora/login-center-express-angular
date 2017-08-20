import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

import { AuthService } from '../auth.service';

import { User } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = new User();

  constructor(
    private router: Router,
    private authService: AuthService,
    private flashMessagesService: FlashMessagesService
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    this.authService
      .getRegister(this.user)
      .then(data => {
        if (data.success === false) {
          this.flashMessagesService.show(
            `Something went wrong! Details: ${data.msg}`,
            { cssClass: 'alert-danger', timeout: 6000 });
          this.router.navigate(['/register']);
        } else {
          this.flashMessagesService.show(
            `You're now registered! Please, login.`,
            { cssClass: 'alert-success', timeout: 3000 });
          this.router.navigate(['/login']);
        }
      });
  }

}
