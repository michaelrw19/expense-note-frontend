import { HttpErrorResponse } from '@angular/common/http';
import { Component, Output, EventEmitter, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Expense } from 'src/app/interface/expense';

import { ExpenseService } from 'src/app/services/expense.service';
import { DialogDeleteComponent } from 'src/app/components/dialog-delete/dialog-delete.component'
import { DialogAddEditComponent } from 'src/app/components/dialog-add-edit/dialog-add-edit.component';
import { DialogCustomRangeComponent } from '../dialog-custom-range/dialog-custom-range.component';

import { FilterComponent } from '../filter/filter.component';

import { decodeEntity } from 'html-entities';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit, AfterViewInit { 
  @Input() year: string;
  @Input() month: string;

  @Output() costChangedEvent = new EventEmitter<string>();

  @ViewChild(FilterComponent)
  public filter: FilterComponent;

  constructor(
    private expenseService: ExpenseService,
    public dialog: MatDialog
    ) { 
  }

  ngAfterViewInit(): void {
   
  }
  public search: string = "";

  public filterType: String = "";

  public displayedExpenses: Expense[] = [];
  public allExpenses: Expense[] = [];
  public startPage: number;
  public paginationLimit: number;
  public totalCost: string = "";

  public months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  public monthFilter: string;

  public sortFilter: string = "";
  public previousSortFilter: string = this.sortFilter;

  public costFilter: string = "";
  public previousCostFilter: string = this.costFilter;
  public displayedCostRanges: string[] = ['$0 - $20', '$20 - $40', '$40 - $60', '$60 - $80', '$80 - $100'];

  ngOnInit(): void {
    this.setMonthFilter();
    this.getExpenses();
    this.startPage = 0;
    this.paginationLimit = 5;
  }

  ///// Emmit Output Functions /////

  public emit(): void {
    this.costChangedEvent.emit(this.year)
  }
  ///// Emmit Output Functions /////

  ///// Pagination Functions /////
  public showMore(): void {
      this.paginationLimit += 5;
  }
  public showMoreCheck(): boolean {
    return this.displayedExpenses.length <= this.paginationLimit
  }
  public showLess(): void{
    this.paginationLimit -= 5;
  }
  public showLessCheck(): boolean {
    if(this.displayedExpenses.length == 5) {
      return true;
    }
    return this.paginationLimit == 5
  }
  ///// Pagination Functions /////

  ///// Cost Filter Functions /////
  public showCostFilter(): void {
    this.filterType = "cost";
    this.filter.showCostFilter();
  }

  public openDialogAddFilter(): void {
    const dialogRef = this.dialog.open(DialogCustomRangeComponent, {
      width: '255px',
    });
    
    dialogRef.afterClosed().subscribe(
      result => { 
        if(result !== null) {
          this.displayedCostRanges.push(result)
        }
    });
  }

  public costInputCheck(): boolean {
    return this.costFilter === "" || this.costFilter === undefined
  }

  public cancelCostFilter(): void {
    this.costFilter = this.previousCostFilter;
  }

  public resetCostFilter(): void {
    this.costFilter = "";
  }

  public getCostFilterCode(filter: string): string {
    if(filter.includes(decodeEntity('&gt;'))) {
      return "GT"
    }
    else if(filter.includes(decodeEntity('&ge;'))) {
      return "GTE"
    }
    else if(filter.includes(decodeEntity('&lt;'))) {
      return "LT"
    }
    else if(filter.includes(decodeEntity('&le;'))) {
      return "LTE"
    }
    return "B";
  }

  public submitCostFilter(): void {
    this.previousCostFilter = this.costFilter;
    let code = this.getCostFilterCode(this.costFilter)
    
    if(this.costFilter !== "") {
      this.expenseService.applyCostFilter(this.costFilter, code, this.monthFilter).subscribe(
        (response: Expense[]) => {
          console.log(response)
          this.displayedExpenses = response
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
    else {
      this.displayedExpenses = this.allExpenses
    }
  }
  ///// Cost Filter Functions /////

  ///// Sort Filter Functions /////
  public sortInputCheck(): boolean {
    return this.sortFilter === "" || this.sortFilter === undefined
  }

  public cancelSortFilter(): void {
    this.sortFilter = this.previousSortFilter;
  }

  public resetSortFilter(): void {
    this.sortFilter = "";
  }

  public submitSortFilter(): void {
    this.previousSortFilter = this.sortFilter;
    if(this.sortFilter !== "") {
      this.expenseService.getExpensesByMonthSorted(this.monthFilter, this.sortFilter).subscribe(
        (response: Expense[]) => {
          if(this.sortFilter === "CHL" || this.sortFilter === "DRO") {
            this.displayedExpenses = response.reverse()
          }
          else if (this.sortFilter === "CLH" || this.sortFilter === "DOR") {
            this.displayedExpenses = response
          }
          this.previousSortFilter = this.sortFilter;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
    else {
      this.displayedExpenses = this.allExpenses;
    }
  }
  ///// Sort Filter Functions /////


  ///// Search Bar Functions /////
  //To Fix: search filter not applied when new expenses added (FIXED)
  public searchFilter(keyword: string): void {
    this.expenseService.applySearchFilter(keyword, this.monthFilter).subscribe(
      (response: Expense[]) => {
        this.displayedExpenses = response
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public findExpense(): void{
    if(this.search !== "") {
      this.searchFilter(this.search);
    }
    else {
      this.displayedExpenses = this.allExpenses;
    }
  }
  ///// Search Bar Functions /////

  ///// Dialog Functions /////
  public openDialogAdd(): void {
    const newData = {
      dateRange: this.getDateMinMax()
    }
    const dialogRef = this.dialog.open(DialogAddEditComponent, {
      width: '255px',
      data: newData
    });
    
    dialogRef.afterClosed().subscribe(
      result => { 
        if(result != null) {
          this.addExpense(result)
        }
    });
  }

  public openDialogUpdate(expense: Expense): void {
    const newData = {
      id: expense.id,
      cost: expense.cost,
      description: expense.description,
      date: expense.date,
      dateRange: this.getDateMinMax()
    }
    const dialogRef = this.dialog.open(DialogAddEditComponent, {
      width: '255px',
      data: newData
    });
    
    dialogRef.afterClosed().subscribe(
      result => {
        if(result != null) {
          this.updateExpense(result)
        }
    });
  }

  public openDialogDelete(expense: Expense): void {
    const newData = {
      id: expense.id,
      cost: expense.cost,
      description: expense.description,
      date: expense.date,
      dateRange: this.getDateMinMax()
    }
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '255px',
      data: newData
    });
    
    dialogRef.afterClosed().subscribe(
      result => { 
        if(result != null) {
          this.deleteExpense(result)
        }
    });
  }
  ///// Dialog Functions /////

  ///// Dialog Sub Functions /////

  public getDateMinMax(): any {
    let month = this.months.indexOf(this.month) + 1;
    let max = new Date(parseInt(this.year), month, 0).getDate();
    if (month < 10) {
      const dateRange = {
        minDate: this.year + '-0' + month + '-01',
        maxDate: this.year + '-0' + month + '-' + max
      }
      return dateRange;
    }
    else {
      const dateRange = {
        minDate: this.year + '-' + month + '-01',
        maxDate: this.year + '-' + month + '-' + max
      }
      return dateRange;
    }
  }

  ///// Dialog Sub Functions /////

  ///// Service Functions /////
  public getTotalCost(): void {
    this.expenseService.getTotalCost(this.monthFilter).subscribe(
      (response: string) => {
        this.totalCost = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getExpenses(): void {
    this.expenseService.getExpensesByMonth(this.monthFilter).subscribe(
      (response: Expense[]) => {
        this.getTotalCost();
        this.allExpenses = response;    
        this.displayedExpenses = this.allExpenses;
        this.findExpense();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public addExpense(expense: Expense){
    this.expenseService.addExpense(expense).subscribe(
      (response: Expense) => {
        this.getExpenses();
        this.emit();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  
  public updateExpense(expense: any) {
    this.expenseService.updateExpense(expense).subscribe(
      (response: Expense) => {
        this.getExpenses();
        this.emit();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public deleteExpense(expense: Expense) {
    this.expenseService.deleteExpense(expense.id).subscribe(
      (response: void) => {
        this.getExpenses();
        this.emit();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    }

  ///// Service Functions /////

  ///// Service Helper Functions /////

  public setMonthFilter(): void {
    let month = this.months.indexOf(this.month) + 1;
    if (month < 10) {
      this.monthFilter = this.year + '-0' + month
    }
    else {
      this.monthFilter = this.year + '-' + month
    }
  }
  ///// Service Helper Functions /////
  }
