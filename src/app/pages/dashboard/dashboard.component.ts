import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Dasboard } from '../../core/models/common.model';
import { CurrencyPipe, JsonPipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, SlicePipe, JsonPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  authService = inject(AuthService);
  dasboard: Dasboard [] = [];

  ngOnInit(): void {
      this.authService.getDasboard().subscribe({
        next: (response) => {
          if(response.data){
            if (Array.isArray(response.data)) {
              response.data.forEach(element => {
                if(element.status == 1){
                  this.dasboard.push(element);
                }
              });
            }
          }
        }
      })
  }
  
 
}
