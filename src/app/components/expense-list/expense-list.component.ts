import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
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
  
  @ViewChild(FilterComponent)
  public filter: FilterComponent;

  constructor(
    private expenseService: ExpenseService,
    public dialog: MatDialog
    ) { 
  }

  ngAfterViewInit(): void {
   
  }

  public testStr: String = "";
  public search: String = "";

  public filterType: String = "";

  public displayedExpenses: Expense[];
  public allExpenses: Expense[];
  public startPage: number;
  public paginationLimit: number;
  public totalCost: number = 0;

  ngOnInit(): void {
    this.getExpenses();
    this.startPage = 0;
    this.paginationLimit = 5;
  }

  ///// Total Cost Functions /////
  public getTotalExpense(expenses: Expense[]): void{
    //Use this only when loading the totalCost for the first time
    let total = 0;
    for (var val of expenses) {
      total += val.cost;
    }
    this.totalCost = total;
  }

  public updateTotalExpense(id: String, val: number){
    //Use this after loading the totalCost, no need to iterate over the list all the time
    if(id === "add") {
      this.totalCost += val;
    }
    else if(id === "sub") {
      this.totalCost -= val;
    }
  }
  ///// Total Cost Functions /////


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
  public showCostFilter(): void{
    this.filterType = "cost";
    this.filter.showCostFilter();
  }

  public showDateFilter(): void{
    this.filterType = "date";
    this.filter.showDateFilter();
  }
  ///// Filter Functions /////


  ///// Search Bar Functions /////
  //To Fix: search filter not applied when new expenses added (FIXED)
  public searchFilter(filter: String): void{
    let result: Expense[] = [];

    this.expenseService.getExpenses().subscribe(
      (response: Expense[]) => {
        response.filter((expense) => {
          if(expense.description.toLowerCase().includes(filter.trim().toLowerCase())) {
            result.push((expense))
          }
        });
        //Updates the list of expenses on the page
        this.displayedExpenses = result;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public findExpense(): void{
    if(this.search !== "") {
      this.searchFilter(this.search);
      console.log(this.displayedExpenses);
    }
  }
  ///// Search Bar Functions /////


  ///// Dialog Functions /////
  public openDialogAdd(): void {
    const dialogRef = this.dialog.open(DialogAddEditComponent, {
      width: '255px',
    });
    
    dialogRef.afterClosed().subscribe(
      result => { 
        if(result != null) {
          this.addExpense(result)
        }
    });
  }

  public openDialogUpdate(expense: Expense): void {
    const dialogRef = this.dialog.open(DialogAddEditComponent, {
      width: '255px',
      data: expense
    });
    
    dialogRef.afterClosed().subscribe(
      result => {
        if(result != null) {
          this.updateExpense(result)
        }
    });
  }

  public openDialogDelete(expense: Expense): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '255px',
      data: expense
    });
    
    dialogRef.afterClosed().subscribe(
      result => { 
        if(result != null) {
          this.deleteExpense(result)
        }
    });
  }
  ///// Dialog Functions /////


  ///// Service Functions /////
  public getExpenses(): void {
    this.expenseService.getExpenses().subscribe(
      (response: Expense[]) => {
        console.log(response);
        this.allExpenses = response;    //Update the list of transactions
        this.displayedExpenses = this.allExpenses;
        this.findExpense();
        if(this.totalCost === 0) {
          this.getTotalExpense(response);
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public addExpense(expense: Expense){
    this.expenseService.addExpense(expense).subscribe(
      (response: Expense) => {
        console.log(response);
        this.allExpenses.push(expense);
        this.getExpenses();
        if(this.totalCost !== 0) {
          this.updateTotalExpense("add", expense.cost);
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
  //TODO: Total Price not updated when calling this function (FIXED)
  public updateExpense(expense: any) {
    this.expenseService.updateExpense(expense).subscribe(
      (response: Expense) => {
        console.log(response);
        this.getExpenses();
        if (expense.oldCost !== response.cost) {
          this.updateTotalExpense("sub", expense.oldCost);
          this.updateTotalExpense("add", response.cost);
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public deleteExpense(expense: Expense) {
    this.expenseService.deleteExpense(expense.id).subscribe(
      (response: void) => {
        console.log(response);
        this.getExpenses();
        this.updateTotalExpense("sub", expense.cost);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    }
  }
  ///// Service Functions /////