import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SaveEvent } from '../models/saveEvent.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit , OnDestroy{

  minDate = new Date();

  createEventForm: FormGroup;
  saveEvent = new SaveEvent();

  addEventSubscription: Subscription;

  constructor(
    private _formBuilder: FormBuilder,
    private _spinner: NgxSpinnerService,
    private _router: Router,
    private _eventService: EventService
  ) { }

  ngOnInit(): void {

    this.createEventForm = this._formBuilder.group(
      {
        title: ['', Validators.required],
        type: ['', Validators.required],
        description: ['', Validators.required],
        date: ['', Validators.required],
        venue: ['', Validators.required]
      }
    );
  }

  get createEventFormControls() {
    return this.createEventForm.controls;
  }


  submit() {
    if(this.createEventForm.valid){

      this._spinner.show();
      this.setValues();

      this.addEventSubscription = this._eventService.createEvent(this.saveEvent).subscribe((result) => {
        console.log(result);
        this.alertConfirmation();
      }, error => {
        console.log(error);
        this.alertError();
      }
      );

      this._spinner.hide();

      console.log(this.saveEvent);
    }
  }

  private setValues(){
    
    const controls = this.createEventFormControls;

      this.saveEvent.title = controls['title'].value;
      this.saveEvent.description = controls['description'].value;
      this.saveEvent.eventType = controls['type'].value;
      this.saveEvent.venue = controls['venue'].value;

      let date = controls['date'].value;

      this.saveEvent.scheduledAt = `${date.getDate().toString()}/0${date.getMonth().toString()}/${date.getFullYear().toString()}`;
  }

  private alertConfirmation() {
    const options = {
      title: 'Thank You',
      text: 'Your event has been created successfully.',
      type: 'success',
      showCancelButton: false,
      confirmButtonColor: '#5533ff',
      confirmButtonText: 'Close'
    };

    Swal.fire(options).then(result => {
      if (result.value) {
        this.redirectToHome();
      }
    });
  }



  private alertError() {
    const options = {
      title: 'Opps!',
      text: 'Sorry event creation was not successful, please try again.',
      type: 'error',
      showCancelButton: false,
      confirmButtonColor: '#5533ff',
      confirmButtonText: 'Close'
    };

    Swal.fire(options).then(result => {
      if (result.value) {
      }
    });
  }

  private redirectToHome() {
    this._router.navigateByUrl('/');
  }

  ngOnDestroy(){
    this.addEventSubscription.unsubscribe();
  }

}
