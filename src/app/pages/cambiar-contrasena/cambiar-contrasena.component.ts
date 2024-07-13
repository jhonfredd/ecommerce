import { Component, inject, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule, JsonPipe } from '@angular/common';
import { catchError, EMPTY } from 'rxjs';
import Swal from 'sweetalert2';

function hasSequentialCharacters(password: string): boolean {
  if (!password || password.length < 2) return false;

  for (let i = 0; i < password.length - 1; i++) {
    const currentCharCode = password.charCodeAt(i);
    const nextCharCode = password.charCodeAt(i + 1);

    // Detecta secuencias consecutivas en el alfabeto (ej. "abcd")
    if (nextCharCode === currentCharCode + 1) {
      return true;
    }
  }

  return false;
}
@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrl: './cambiar-contrasena.component.css'
})
export class CambiarContrasenaComponent {
  isEmailDisabled(){ return true};
  form: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  message = '(por ejemplo, !@#$%^&*()-_=+[]{}|;:",.><?/).';
  passwordErrors: string[] = [];

  constructor(private fb: FormBuilder, private renderer: Renderer2) {
    this.form = this.fb.group({
      _id: '',
      nombres: [{ value: '', disabled: true }, Validators.required],
      apellidos: [{ value: '', disabled: true }, Validators.required],
      usuario: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      password: ['', [Validators.required]],
      password2: ['', [Validators.required]],
    },{validators: this.passwordMatchValidator});
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const password2 = control.get('password2')?.value;

    const errors: { [key: string]: boolean } = {};

    if(password){
      if(password !== '' && password2 !== '') {
        password === password2 ? null : errors['verify_password'] = true;
      }else{
        errors['verify_password'] = true
      }

      password.length < 6 ?  errors['minLength'] = true : null;
      !/[a-z]/.test(password) ?  errors['lowercase'] = true : null;
      !/[A-Z]/.test(password) ?  errors['uppercase'] = true : null;
      !/[0-9]/.test(password) ?  errors['number'] = true : null;
      !/[!@#$%^&*(),.?":{}|<>]/.test(password) ?  errors['special'] = true : null;
      hasSequentialCharacters(password) ?  errors['sequence'] = true : null;
    }else{
      errors['verify_password'] = true;
      errors['minLength'] = true;
      errors['lowercase'] = true;
      errors['uppercase'] = true;
      errors['number'] = true;
      errors['special'] = true;
      errors['sequence'] = true;
    }

    return errors;
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

  ngOnInit(): void {
    this.authService.me().subscribe({
      next: (response) => {
        if(response.data){
          this.form.controls['_id'].setValue(response.data._id);
          this.form.controls['email'].setValue(response.data.email);
          this.form.controls['usuario'].setValue(response.data.name);
          this.form.controls['nombres'].setValue(response.data.first_name);
          this.form.controls['apellidos'].setValue(response.data.last_name);
        }
      }
    });
  }

  obSubmit(){
    if(this.form.valid){
      this.authService.cambiarPassword(this.form.value)
      .pipe(
        catchError((error: string) => {
          const errorMessage = error;
          Swal.fire({
            title: 'Ocurrio un error',
            text: errorMessage,
            icon: 'error',
          })
          return EMPTY;
        })
      ).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'La clave se ha cambiado con exito.',
            icon: 'success',
          })
          this.form.controls['password'].reset();
          this.form.controls['password2'].reset();
        }
      });
    }
  }

}
