import { HttpErrorResponse } from '@angular/common/http';
import { Component, Output, EventEmitter, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Expense } from 'src/app/interface/expense';

import { ExpenseService } from 'src/app/services/expense.service';
import { DialogDeleteComponent } from 'src/app/components/dialog-delete/dialog-delete.component'
import { DialogAddEditComponent } from 'src/app/components/dialog-add-edit/dialog-add-edit.component';
import { DialogCustomRangeComponent } from '../dialog-custom-range/dialog-custom-range.component';

import { decodeEntity } from 'html-entities';

import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit, AfterViewInit {
  @Input() year: string;
  @Input() month: string;

  @Output() costChangedEvent = new EventEmitter<string>();

  constructor(
    private expenseService: ExpenseService,
    public dialog: MatDialog
  ) {
  }

  ngAfterViewInit(): void {

  }
  public displayedExpenses: Expense[] = [];
  public allExpenses: Expense[] = [];

  public startPage: number;
  public paginationLimit: number;
  public totalCost: string = "";

  public months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  public monthFilter: string;

  //Filters
  public searchKeyword: string = "";

  public sortFilter: string = "";
  public previousSortFilter: string = this.sortFilter;

  public costFilter: string = "";
  public previousCostFilter: string = this.costFilter;
  public displayedCostRanges: string[] = ['$0 - $20', '$20 - $40', '$40 - $60', '$60 - $80', '$80 - $100'];

  //Line Chart
  public costPerMonth: number[] = []
  public lineChartData: ChartConfiguration<'line'>['data']
  public lineChartOptions: ChartOptions<'line'>
  public lineChartLegend = false;

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
  public showLess(): void {
    this.paginationLimit -= 5;
  }
  public showLessCheck(): boolean {
    if (this.displayedExpenses.length == 5) {
      return true;
    }
    return this.paginationLimit == 5
  }
  ///// Pagination Functions /////

  ///// Line Chart Functions /////
  public async generateLineChart() {
    //Chart only shown in Janury, not in other months
    //console.log(this.costPerMonth)
    await this.delay(1000)
    //console.log(this.costPerMonth)
    let lineChartData: ChartConfiguration<'line'>['data'] = {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      datasets: [
        {
          data: this.costPerMonth,
          label: this.year,
          fill: false,
          tension: 0.5,
          borderColor: 'black',
          backgroundColor: 'rgba(255,0,0,0)'
        }
      ]
    };
    let lineChartOptions: ChartOptions<'line'> = {
      responsive: false
    };

    this.lineChartData = lineChartData;
    this.lineChartOptions = lineChartOptions;
  }
  ///// Line Chart Functions /////

  ///// Submit All Filter /////
  public submitFilters(): void {
    let costFilter = this.convertCostFilter()
    this.expenseService.applyFilters(this.monthFilter, costFilter, this.sortFilter, this.searchKeyword).subscribe(
      (response: Expense[]) => {
        if (this.sortFilter === "CHL" || this.sortFilter === "DRO") {
          this.displayedExpenses = response.reverse()
        }
        else if (this.sortFilter === "CLH" || this.sortFilter === "DOR") {
          this.displayedExpenses = response
        }
        this.displayedExpenses = response
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    this.previousCostFilter = this.costFilter;
    this.previousSortFilter = this.sortFilter;
  }
  ///// Submit All Filter /////

  ///// Cost Filter Functions /////
  public openDialogAddFilter(): void {
    const dialogRef = this.dialog.open(DialogCustomRangeComponent, {
      width: '255px',
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result !== null) {
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

  public convertCostFilter(): string {
    let filter = this.costFilter
    if (filter.includes(decodeEntity('&gt;'))) {
      return filter.replace(decodeEntity('&gt;'), ">")
    }
    else if (filter.includes(decodeEntity('&ge;'))) {
      return filter.replace(decodeEntity('&ge;'), ">=")
    }
    else if (filter.includes(decodeEntity('&lt;'))) {
      return filter.replace(decodeEntity('&lt;'), "<")
    }
    else if (filter.includes(decodeEntity('&le;'))) {
      return filter.replace(decodeEntity('&le;'), "<=")
    }
    return filter;
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
  ///// Sort Filter Functions ////

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
        if (result != null) {
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
        if (result != null) {
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
        if (result != null) {
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

  public getTotalCostPerMonth(year: string): void {
    this.expenseService.getTotalCostPerMonth(year).subscribe(
      (response: number[]) => {
        this.costPerMonth = response;
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
        this.submitFilters();

        this.getTotalCostPerMonth(this.year);
        this.generateLineChart();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public addExpense(expense: Expense) {
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

  public async delay(ms: number): Promise<void> {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
