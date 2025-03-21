import { Component } from '@angular/core';
import { EquiposService } from '../../services/equipos.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  equipos: any[] = [];
  otro:boolean = true;
  constructor(private equiposService: EquiposService) { }
  loadEquipos(): void {
    this.equiposService.getEquipos().subscribe(data => {
      this.equipos = data;
    });


  }

}
