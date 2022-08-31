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
 
  public costs: number[] = [];

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
    this.getTotalCostPerMonth()
  }

  //Add a button to call for this function again

  public updateCostsInfo(): void {
    this.getTotalCost()
    this.getTotalCostPerMonth()
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

  public getTotalCostPerMonth(): void {
    this.expenseService.getTotalCostPerMonth(this.currentYear.toString()).subscribe(
      (response: number[]) => {
        this.costs = response;
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
        console.log(this.allExpenses)
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
