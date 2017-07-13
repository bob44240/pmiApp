import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {ParticipantService} from '../../services/participant.service';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {

  form: FormGroup;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;
  parts;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private partService: ParticipantService
  ) {
    this.createForm(); // Create Angular 2 Form when component loads
  }


  // Function to create participant form
  createForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(5), // Minimum length is 5 characters
        Validators.maxLength(30)
      ])],
      email: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(5), // Minimum length is 5 characters
        Validators.maxLength(30)
      ])],
      age: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(3), // Minimum length is 3 characters
        Validators.maxLength(15)
      ])],
      exposure: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(3), // Minimum length is 3 characters
        Validators.maxLength(15), // Maximum length is 15 characters
        this.validateUsername // Custom validation
      ])],
      mutations: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(3), // Minimum length is 3 characters
        Validators.maxLength(15)
      ])],
      siblings: ['', Validators.compose([
        Validators.required
      ])]
  });
  }

  // Function to disable the registration form
  disableForm() {
    this.form.controls['name'].disable();
    this.form.controls['age'].disable();
    this.form.controls['exposure'].disable();
    this.form.controls['mutations'].disable();
    this.form.controls['siblings'].disable();
    this.form.controls['email'].disable();
  }

  // Function to enable the registration form
  enableForm() {
    this.form.controls['name'].enable();
    this.form.controls['age'].enable();
    this.form.controls['exposure'].enable();
    this.form.controls['mutations'].enable();
    this.form.controls['siblings'].enable();
    this.form.controls['email'].enable();
  }

  // Function to validate e-mail is proper format
  validateEmail(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Test email against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid email
    } else {
      return { 'validateEmail': true } // Return as invalid email
    }
  }

  // Function to validate username is proper format
  validateUsername(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    // Test username against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid username
    } else {
      return { 'validateUsername': true } // Return as invalid username
    }
  }
  // Function to submit form
  onSubmit() {
    console.log('Submit');
    console.log(this.parts);
    this.processing = true; // Used to notify HTML that form is in processing, so that it can be disabled
    this.disableForm(); // Disable the form
    // Create user object form user's inputs
    const participant = {
      name: this.form.get('name').value, // E-mail input field
      age: this.form.get('age').value, // Username input field
      siblings: this.form.get('siblings').value,
      email: this.form.get('email').value,
      exposure: this.form.get('exposure').value,
      reviewed: 0,
      mutations: this.form.get('mutations').value
    }

    console.log(participant);
    // Function from authentication service to register user
    this.partService.createPart(participant).subscribe(data => {
      // Check if blog was saved to database or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = data.message; // Return error message
        this.processing = false; // Enable submit button
        this.enableForm(); // Enable form
      } else {
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = data.message; // Return success message

        // Clear form data after two seconds
        setTimeout(() => {

          this.processing = false; // Enable submit button
          this.message = false; // Erase error/success message
          this.form.reset(); // Reset all form fields
          this.enableForm(); // Enable the form fields
        }, 2000);
      }
    });

  }

  // Function to check if e-mail is taken
  checkEmail() {
    // Function from authentication file to check if e-mail is taken
    console.log("Check email");
    this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
      // Check if success true or false was returned from API
      if (!data.success) {
        this.emailValid = false; // Return email as invalid
        this.emailMessage = data.message; // Return error message
      } else {
        this.emailValid = true; // Return email as valid
        this.emailMessage = data.message; // Return success message
      }
    });
  }

  // Function to check if username is available
  checkUsername() {
    // Function from authentication file to check if username is taken
    this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
      // Check if success true or success false was returned from API
      if (!data.success) {
        this.usernameValid = false; // Return username as invalid
        this.usernameMessage = data.message; // Return error message
      } else {
        this.usernameValid = true; // Return username as valid
        this.usernameMessage = data.message; // Return success message
      }
    });
  }


  getAllParts() {
    // Function to GET all blogs from database
    this.partService.getAllParts().subscribe(data => {
      this.parts = data.blogs; // Assign array to use in HTML
    });
  }

  ngOnInit() {
  }

}
