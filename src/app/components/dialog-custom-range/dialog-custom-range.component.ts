import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-custom-range',
  templateUrl: './dialog-custom-range.component.html',
  styleUrls: ['./dialog-custom-range.component.css']
})
export class DialogCustomRangeComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogCustomRangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  public title: string;

  public id?: number;
  public cost: number;
  public description: string;
  public date: string;
  public Date: Date;
  public editData: boolean;

  public val1: string;
  public val2: string;
  public operation: string = "-";
  public leftInputDisabled: boolean = false;
  public costRange: string = "";

  ngOnInit(): void {
  }

  public isLeftInputDisabled(): void {
    this.leftInputDisabled = this.operation !== '-';
    this.val1 = "";
    this.val2 = "";
  }

  public makeCostRange(): void {
    if (this.leftInputDisabled) {
      this.costRange = this.operation + " " + this.val2;
    }
    else {
      this.costRange = this.val1 + this.operation + this.val2;
    }

  }

  checkInputs(): boolean {
    //return true if one the inputs is empty
    let val1: boolean = this.val1 === undefined || this.val1 === null || this.val1 === ""
    let val2: boolean = this.val2 === undefined || this.val2 === null || this.val2 === ""

    if (this.leftInputDisabled) {
      return val2
    }
    return val1 || val2
  }

  public onCancel(): void {
    this.dialogRef.close(null)
  }

  public onSubmit(): void {
    this.makeCostRange()
    this.dialogRef.close(this.costRange);
  }

}
