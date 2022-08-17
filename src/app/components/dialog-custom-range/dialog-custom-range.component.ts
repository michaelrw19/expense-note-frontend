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
    console.log(this.leftInputDisabled);
    this.leftInputDisabled = this.operation !== '-';
    this.val1 = "";
    this.val2 = "";
  }

  public makeCostRange(): void {
    console.log("Here");
    if (this.leftInputDisabled) {
      this.costRange = this.operation + " " + this.val2;
    }
    else {
      this.costRange = this.val1 + this.operation + this.val2;
    }

  }

}
