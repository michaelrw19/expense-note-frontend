import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.css']
})
export class DialogDeleteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}

  public name: string;

  ngOnInit(): void {
    this.dialogRef.updatePosition({top: '100px'});
    this.name = this.data.description;
  }

  onDelete(): void {
    this.dialogRef.close(this.data)
  }

  onCancel(): void {
    this.dialogRef.close(null)
  }
}