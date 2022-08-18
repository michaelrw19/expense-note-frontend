import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Expense } from 'src/app/interface/expense';

@Component({
  selector: 'app-dialog-add-edit',
  templateUrl: './dialog-add-edit.component.html',
  styleUrls: ['./dialog-add-edit.component.css']
})
export class DialogAddEditComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}
  public title: string;

  public id?: number;
  public cost: number;
  public description: string;
  public date: string;
  public Date: Date;
  public editData: boolean;

  public dateFilterMin: string;
  public dateFilterMax: string;

  ngOnInit(): void {
    this.dialogRef.updatePosition({top: '100px'});

    this.setDateRange(this.data.dateRange)
    if(this.data != null) {
      this.setData(this.data)
      this.editData = true
      this.title = "Edit Expense"
    }
    else {
      this.editData = false
      this.title = "Add Expense"
    }
  }
  
  //add this to HTML
  setDateToString(newDate: Date): void {
    this.date = newDate.toDateString();
  }

  setData(data: Expense){
    this.id = data.id;
    this.cost = data.cost;
    this.description = data.description;
    this.date = data.date;
  }

  checkInputs(): Boolean{
    //return true if one the inputs is empty
    return (this.cost == undefined) || (this.description == undefined) || (this.date == undefined)
  }

  public setDateRange(range: any) {
    this.dateFilterMin = range.minDate
    this.dateFilterMax = range.maxDate
  }

  onSubmit(): void {
    if(!(this.cost && this.description && this.date)) {
      this.onCancel()

    }
    else {
      if(this.editData) {
        const newExpense = {
          id: this.id,
          cost: this.cost,
          description: this.description,
          date: this.date,

          oldCost: this.data.cost
        }
        this.dialogRef.close(newExpense)
      }

      else {
        const newExpense = {

          cost: this.cost,
          description: this.description,
          date: this.date
        }
        this.dialogRef.close(newExpense)
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(null)
  }

}

