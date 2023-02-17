import { Component } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentTypeListModel } from 'src/app/interfaces/document.list.interface';
import { ErrorTypes } from 'src/app/interfaces/error-type.interface';
import { AuthService } from 'src/app/login/services/auth.service';
import { AppService } from '../../../app.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  show: boolean = true;
  error = {description: "error.description", state: false};

  documentTypes: DocumentTypeListModel[] = [];
  documentTypeCurrent: string = "cedula de identidad";

  editForm = this.formBuilder.group({
    name: "",
    email: new FormControl("", Validators.email),
    documentType: new FormControl(0),
    document: "",
    phone: "",
    password: "",
    avatarUrl: ""
  });

  editor = false;

  constructor(private formBuilder: FormBuilder, protected auth: AuthService, private api: AppService) {}

  onEdit() {
    if (this.editForm.valid){
      this.api.editProfile({
        customerId: this.auth.currentUser!.customer.id,
        documentTypeName: this.documentTypes[this.editForm.controls.documentType.value || 0].name,
        document: this.editForm.controls.document.value!,
        fullName: this.editForm.controls.name.value!,
        email: this.editForm.controls.email.value!,
        phone: this.editForm.controls.phone.value!,
        password: this.editForm.controls.password.value!,
        avatarUrl: this.editForm.controls.avatarUrl.value!,
      }).subscribe({
        error: () => { this.catchError(ErrorTypes.alredyexist) },
        complete: () => {
          this.error.state = false;
          this.auth.reloadCurrentUser();
          this.toEdit();
        }
      })
    } else this.catchError(ErrorTypes.invalid)
  }

  catchError(error: ErrorTypes){
    this.error.state = true;
    this.error.description = error;
  }

  ngOnInit() {
    this.documentTypes.push({value: "0", name: "Cedula de identidad"});
    this.documentTypes.push({value: "1", name: "Pasaporte"});
    this.documentTypes.push({value: "2", name: "Libreta de conducir"});
    this.editForm.controls.documentType.setValue(this.documentTypes.findIndex((value) => value.name === this.auth.currentUser!.customer.documentType.name));
    this.editForm.controls.document.setValue(this.auth.currentUser!.customer.document);
    this.editForm.controls.email.setValue(this.auth.currentUser!.customer.email);
    this.editForm.controls.name.setValue(this.auth.currentUser!.customer.fullName);
    this.editForm.controls.password.setValue(this.auth.currentUser!.customer.password);
    this.editForm.controls.phone.setValue(this.auth.currentUser!.customer.phone.toString());
    this.editForm.controls.avatarUrl.setValue(this.auth.currentUser!.customer.avatarUrl!);
  }

  switchPassword(){
    this.show = !this.show;
  }

  switchDocumentType(value: number){
    this.documentTypeCurrent = this.documentTypes[value].name.toLowerCase();
  }

  toEdit() {
    this.editor = !this.editor;
  }

}
