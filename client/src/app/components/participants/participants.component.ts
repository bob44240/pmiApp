import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {ParticipantService} from '../../services/participant.service';
import {Participant} from '../models/participant.model';
import {Pipe, PipeTransform} from '@angular/core';
import {SiblingPipe} from '../../sibling.pipe';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {

  form: FormGroup;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  selectedParticipant : Participant;
  usernameMessage;
  parts;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private partService: ParticipantService
  ) {
    this.parts = [{name: 'bob' }];
  }

  setTextColor(part: Participant): string {
    let color = 'red';

    if (+part.reviewed === 1) { color = 'blue'; }
    if (+part.reviewed === 2) { color = 'green'; }
    if (+part.reviewed === 3) { color = 'red'; }

    return color;
  }

  onChange(newVal){
    this.selectedParticipant.reviewed = newVal;
    this.partService.updatePart(this.selectedParticipant);
  }

  selectParticipant(part: Participant) {
    this.selectedParticipant = part;
  }

  createNewParticipant() {
    const part: Participant = {
      name: '',
      email: '',
      age: 1,
      reviewed: 1,
      siblings: false,
      lastUpdate: new Date(),
      created: new Date(),
      mutations: '',
      exposures: '',
      phone: {
        work: '',
        mobile: ''
      }
    };

    // By default, a newly-created contact will have the selected state.
    this.selectParticipant(part);
  }

  // Function to check if e-mail is taken
  checkEmail() {
    // Function from authentication file to check if e-mail is taken

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

  showParts(){
    this.getAllParts();
    console.log(this.parts)
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
      this.parts = data.participants; // Assign array to use in HTML
      console.log(this.parts);
    });
  }

  ngOnInit() {
    this.getAllParts();

  }

}
