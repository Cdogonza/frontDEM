import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { TallerService } from '../../services/taller.service';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-taller',
  imports: [NgFor,CommonModule,MatIconModule,HttpClientModule,NavBarComponent,RouterModule],
  templateUrl: './taller.component.html',
  styleUrl: './taller.component.css'
})
export class TallerComponent {


  taller: any[] = [];
  tallerFiltrados: any[] = [];
  static dem: number;


  constructor(private tallerService: TallerService,private cdr: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.loadTaller();
  }
  async loadTaller() {
    this.tallerService.getTaller().subscribe(data => {
      this.taller = data;
      this.tallerFiltrados = data;
      this.cdr.detectChanges();
    });
  }

  openTallerForm() {
    this.tallerService.showForm();
  }



}
