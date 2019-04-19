import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService  } from '../services/share-flight-details.service';
import { UserDataService } from '../services/user-data.service';
import { User } from '../model/User';

@Component({
  selector: 'app-passenger-details',
  templateUrl: './passenger-details.component.html',
  styleUrls: ['./passenger-details.component.css']
})
export class PassengerDetailsComponent implements OnInit {
  no: any;
  passDetailsForm: FormGroup;
  details = [{name: '', age: '', gender: ''}];
  bookTickets = false;
  message: any;
  user: any;
  postBody: any;

  constructor(private modalService: NgbModal, private messageService: MessageService, private userService: UserDataService,
              private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {
    this.passDetailsForm = this.formBuilder.group({
      fullName: [''],
      age: [''],
      email: [''],
      contactNo: ['']
    });

    this.message = this.messageService.getMessage() ? this.messageService.getMessage() : JSON.parse(localStorage.getItem('flight'));
  }

  ngOnInit() {
    if (sessionStorage.getItem('User')) {
      this.user = JSON.parse(sessionStorage.getItem('User'));
    } else {
      this.router.navigate(['/login']);
    }
  }

  onSubmit(confirm: any) {
    this.bookTickets = true;
    this.message.passengers = this.details.length;

    this.postBody = {
      email: this.user.user.email,
      source: this.message.source,
      destination: this.message.destination,
      date: this.message.date.year + '/' + this.message.date.month + '/' + this.message.date.day,
      price: this.getClearedPrice(this.message.price),
      passengers: this.message.passengers,
      eventName: this.message.eventName
    };

    this.modalService.open(confirm, {centered: true}).result.then((result: string) => {
      if (result === 'yes') {
        this.userService.startPayment(this.postBody)
        .subscribe((response) => {
          window.location.href = response['url'];
        }, (error) => {
          console.log(error);
        });
      } else {
        console.log('no');
      }
    }).catch(error => {console.log(error); });
  }
  add() {
      this.details.push({name: '', age: '', gender: ''});
  }

  remove() {
    if (this.details.length === 1) {} else { this.details.pop(); }
  }

  getClearedPrice(price: string) {
    const regex: RegExp = /\D/g;
    return price.replace(regex, '');
  }
}
