import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Expense } from 'src/app/interface/expense'

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor( private http: HttpClient ) { }
  
  public getExpenses():Observable<Expense[]>{
    return this.http.get<Expense[]>(`${this.apiServerUrl}/expense/all`);
  }

  public addExpense(expense: Expense):Observable<Expense>{
    return this.http.post<Expense>(`${this.apiServerUrl}/expense/add`, expense);
  }

  public updateExpense(expense: any):Observable<Expense>{
    return this.http.put<Expense>(`${this.apiServerUrl}/expense/update`, expense);
  }

  public deleteExpense(expenseId: number):Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}/expense/delete/${expenseId}`);
  }
}
