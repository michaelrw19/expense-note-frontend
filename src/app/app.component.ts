import { ExpenseService } from './services/expense.service';
import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

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

  constructor (
    private expenseService: ExpenseService
  ) { }

  ngOnInit(): void {
    this.getTotalCost()
    this.getTotalCostPerMonth()
  }

  //Add a button to call for this function again

  public getTotalCost(): void {
    this.expenseService.getTotalCost(this.currentYear).subscribe(
      (response: string) => {
        console.log(response)
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
        console.log(this.costs);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);  
      }
    );
  }

  public updateCostsInfo(): void {
    console.log("Event accepted")
    this.getTotalCost()
    this.getTotalCostPerMonth()
  }

}
