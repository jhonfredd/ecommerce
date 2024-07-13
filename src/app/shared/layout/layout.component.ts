import { Component, effect, Injector,inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/common.model';
import { JsonPipe } from '@angular/common';
import { ResponsiveService } from '../../validators/responsiveMovil.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, JsonPipe],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  authService = inject(AuthService);
  injector = inject(Injector);
  isLoggedIn = false;
  user!: User;

  isMobile!: boolean;

  constructor(private responsiveService: ResponsiveService) {}

  
  ngOnInit(): void {
    effect(()=>{
        this.isLoggedIn = this.authService.isLoggeIn();
        if(this.isLoggedIn){
          this.authService.me().subscribe({
            next: (response) => {
              this.user = response.data;
            }
          });
        }
    }, {injector: this.injector})

    this.responsiveService.isMobile().subscribe(
      result => {
        this.isMobile = result;
      }
    );
    
  }

  logout(){
    this.authService.logout();
  }
}
