import { Component, OnInit, Input} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogCustomRangeComponent } from '../dialog-custom-range/dialog-custom-range.component';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input() showFilter: String;

  constructor(
    public dialog: MatDialog
  ) { }

  public isCostFilterHidden: boolean = false;
  public isDateFilterHidden: boolean = true;
  public costRanges: string[] = ['$0 - $20', '$20 - $40', '$40 - $60', '$60 - $80', '$80 - $100'];
  public costRange: string = "";
  public val1: string;
  public val2: string;
  public operation: string = "-";
  public leftInputDisabled: boolean = false;

  ngOnInit(): void {
  }

  //Called by parent (expense-list.component)
  public showCostFilter(): void {
    if(!this.isCostFilterHidden) {
      this.isCostFilterHidden = true;
    }
    else {
      this.isCostFilterHidden = false;
    }
    this.val1 = "";
    this.val2 = "";
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

  public applyCostFilter(): void {

  }

  public openDialogAddFilter(): void {
    const dialogRef = this.dialog.open(DialogCustomRangeComponent, {
      width: '255px',
    });
    
    dialogRef.afterClosed().subscribe(
      result => { 
        if(result != null) {
          console.log(result);
        }
    });
  }
}
