import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'expense-note';
  public months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  public currentYear: number = new Date().getFullYear();
  public years: string[] = [this.currentYear.toString()];

  ngOnInit(): void {

  }
}
