import { Component, inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage = "";

  constructor(private fb: FormBuilder, private renderer: Renderer2){
    this.form = this.fb.group({
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required])
    })
  }

  togglePasswordVisibility(inputId: string, iconId: string ): void {
      const inputElement = document.getElementById(inputId);
      const iconElement = document.getElementById(iconId);

      if (inputElement && iconElement) {
        const type = inputElement.getAttribute('type') === 'password' ? 'text' : 'password';
        this.renderer.setAttribute(inputElement, 'type', type);
        
        if (type === 'text') {
          this.renderer.removeClass(iconElement, 'fa-eye');
          this.renderer.addClass(iconElement, 'fa-eye-slash');
        } else {
          this.renderer.removeClass(iconElement, 'fa-eye-slash');
          this.renderer.addClass(iconElement, 'fa-eye');
        }
      }
  }

  onSubmit(){
    if(this.form.valid){
      // console.log(this.form.value);//que es lo que envia el formulario
      this.errorMessage = '';
      this.authService.login(this.form.value).pipe(
        catchError((error: string) => {
          this.errorMessage = error;
          return EMPTY;
        })
      )
      .subscribe({
        next:(response)=>{
          this.router.navigate(['']);
          // console.log(response);//validamos que trae el response
        }
      });
    }
  }
}
