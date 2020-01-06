import { NgModule } from '@angular/core';

import {
  MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
  MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,
  MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatTabsModule, 
  MatSelectModule, MatCardModule, MatExpansionModule,MatListModule,MatChipsModule,
  MatButtonToggleModule,MatBadgeModule, MatAutocompleteModule
} from '@angular/material';
@NgModule({
  imports: [
    MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,
    MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatTabsModule,
    MatSelectModule, MatCardModule, MatExpansionModule,MatListModule,MatChipsModule,
    MatButtonToggleModule,MatBadgeModule,MatAutocompleteModule
  ],
  exports: [
    MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule,
    MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatTabsModule,
    MatSelectModule, MatCardModule,MatExpansionModule,MatListModule,MatChipsModule,
    MatButtonToggleModule,MatBadgeModule,MatAutocompleteModule
  ],
})
export class SharedModule { }