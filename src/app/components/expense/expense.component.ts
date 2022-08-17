import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Expense } from 'src/app/interface/expense';


@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  @Input() expense: Expense;
  @Output() deleteOnClickExpense: EventEmitter<Expense> = new EventEmitter();
  @Output() updateOnClickExpense: EventEmitter<Expense> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  deleteOnClick(expense: Expense){
    this.deleteOnClickExpense.emit(expense);
  }

  updateOnClick(expense: Expense){
    this.updateOnClickExpense.emit(expense);
  }
}


