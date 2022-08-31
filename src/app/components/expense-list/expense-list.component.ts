import { HttpErrorResponse } from '@angular/common/http';
import { Component, Output, EventEmitter, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Expense } from 'src/app/interface/expense';

import { ExpenseService } from 'src/app/services/expense.service';
import { DialogDeleteComponent } from 'src/app/components/dialog-delete/dialog-delete.component'
import { DialogAddEditComponent } from 'src/app/components/dialog-add-edit/dialog-add-edit.component';

import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit, AfterViewInit { 
  @Input() year: string;
  @Input() month: string;

  @Output() costChangedEvent = new EventEmitter<boolean>();

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

  ngOnInit(): void {
    this.setMonthFilter();
    this.getExpenses();
    this.startPage = 0;
    this.paginationLimit = 5;
  }

  ///// Emmit Output Functions /////

  public emit(): void {
    this.costChangedEvent.emit(true)
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

  ///// Filter Functions /////
  public showCostFilter(): void {
    this.filterType = "cost";
    this.filter.showCostFilter();
  }
  public sortInputCheck(): boolean {
    return this.sortFilter === "" || this.sortFilter === undefined
  }
  ///// Filter Functions /////


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
