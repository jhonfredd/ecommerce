import { Component, inject, Renderer2} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);

  constructor(private fb: FormBuilder, private renderer: Renderer2) {
    this.form = this.fb.group({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      telephone: ['', [Validators.required]],
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      password2: new FormControl('', [Validators.required]),
    }, { validators: this.passwordMatchValidator });
  }

  telephoneValidator(control: FormControl): { [key: string]: any } | null {
    const value = control.value;

    if (/^\d{10}$/.test(value)) {
      return null;
    }

    return { invalidTelephone: true };
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const password2 = control.get('password2');
    return password?.value === password2?.value ? null : { 'passwordMismatch': true};
  }

  togglePasswordVisibility(inputIds: string, iconId: string): void {
    const ids = inputIds.split(',');
    const iconElement = document.getElementById(iconId);
    ids.forEach(id => {
        const inputElement = document.getElementById(id);
        if (inputElement && iconElement ) {
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
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      // console.log(this.form.value); // vemos si esta enviado correctamente los atos
      this.authService.register(this.form.value).pipe(
        catchError((error: string) =>{
          const errorMessage = error;
          Swal.fire({
            title: 'Ocurrio un error',
            text: errorMessage,
            icon: 'error',
          })
          return EMPTY;
        })
      ).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Registro exitoso',
            text: '¡Te has registrado exitosamente!',
            icon: 'success',
          });
          this.router.navigate(['login']);
        },
        error: (error: any) => {
          const errorMessage = error.error?.message || 'Ocurrió un error';
          Swal.fire({
            title: 'Ocurrió un error',
            text: errorMessage,
            icon: 'error',
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Formulario no válido',
        text: 'Por favor, completa todos los campos correctamente.',
        icon: 'error',
      });
    }
  }
}
