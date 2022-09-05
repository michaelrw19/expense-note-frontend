import { ExpenseService } from './services/expense.service';
import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Expense } from './interface/expense';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'expense-note';
  public currentYear: string = new Date().getFullYear().toString();
  public years: string[] = [this.currentYear];
  //To be added: add year functionality 

  public months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
 
  public allCosts: Map<string, number[]> = new Map<string, number[]>([])

  public totalCost: string = "";

  public allExpenses: Map<string, Expense[]> = new Map<string, Expense[]>([])
  public fileName = 'ExcelSheet.xlsx'
  public disableExcelDownload: boolean = true
  public downloadButtonMessage: string = "Generate excel file first to download the file"

  constructor (
    private expenseService: ExpenseService
  ) { }

  ngOnInit(): void {
    this.getTotalCost()
    this.getAllCost() 
  }

  public updateCostsInfo(year: string): void {
    console.log(year)
    this.getTotalCost()
    this.getTotalCostPerMonth(year)
    this.disableExcelDownload = true
    this.downloadButtonMessage = "Generate excel file first to download the file"
  }

  public getTotalCost(): void {
    this.expenseService.getTotalCost(this.currentYear).subscribe(
      (response: string) => {
        this.totalCost = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);  
      }
    );
  }

  public getCost(year: string, index: number): number {
    let arr = this.allCosts.get(year)
    if(arr) {
      return arr[index]
    }
    return 0;
  }

  public getAllCost(): void {
    for (var year of this.years) {
      this.getTotalCostPerMonth(year);
    }
  }

  public getTotalCostPerMonth(year: string): void {
    //Convert this to a loop to cover all year, add the response to the appropriate key, then call each key from html 
    //Also consider this function to handle any updates (maybe add year paramter to update only specific year, not all)
    this.expenseService.getTotalCostPerMonth(year).subscribe(
      (response: number[]) => {
        this.allCosts.set(year, response)
      },
      (error: HttpErrorResponse) => {
        alert(error.message);  
      }
    );
  }

  public setYearlyExpense(year: string): void {
    this.expenseService.getExpensesByYear(year).subscribe(
      (response: Expense[]) => {
        this.allExpenses = this.allExpenses.set(year, response)
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public async generateExcel(): Promise<void> {
    for(var year of this.years) {
      this.setYearlyExpense(year)
    }
    await this.delay(2000)
    this.downloadButtonMessage = "";
    this.disableExcelDownload = false;
  }

  public exportExcel(): void {
     /* table id is passed over here */   
     let element = document.getElementById('excel-table'); 
     const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
     XLSX.writeFile(wb, this.fileName);
  }

  public async delay(ms: number): Promise<void> {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
