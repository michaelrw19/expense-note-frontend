import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { DialogAddEditComponent } from './components/dialog-add-edit/dialog-add-edit.component';
import { DialogDeleteComponent } from './components/dialog-delete/dialog-delete.component';
//import { ExpenseService } from './services/expense.service';

import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { FilterComponent } from './components/filter/filter.component';
import { DialogCustomRangeComponent } from './components/dialog-custom-range/dialog-custom-range.component';

@NgModule({
  declarations: [
    AppComponent,
    //ExpenseService,
    ExpenseListComponent,
    ExpenseComponent,
    DialogAddEditComponent,
    DialogDeleteComponent,
    FilterComponent,
    DialogCustomRangeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
    {provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'accent' }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
