import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import { catchError, EMPTY } from 'rxjs';
import { Dasboard } from '../../core/models/common.model';

@Component({
  selector: 'app-registrar-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './registrar-productos.component.html',
  styleUrl: './registrar-productos.component.css'
})
export class RegistrarProductosComponent implements OnInit {
  formulario = 0;
  form: FormGroup;
  productos: Dasboard[] = [];
  authService = inject(AuthService);
  router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      _id: '',
      title: new FormControl('', [Validators.required]),
      sub_title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      status: 1
    });
  }

  ngOnInit(): void {
    this.authService.getDasboard().subscribe({
      next: (response) => {
        if (response.data) {
          if (Array.isArray(response.data)) {
            response.data.forEach(element => {
              this.productos.push(element);
            });
          }
        }
      }
    })
  }

  validarFormulario(vali: number) {
    this.formulario = vali;
  }

  private resetInformacion(message: string) {
    Swal.fire({
      title: message,
      icon: 'success',
    })
    this.form.controls['_id'].reset();
    this.form.controls['title'].reset();
    this.form.controls['sub_title'].reset();
    this.form.controls['description'].reset();
    this.form.controls['price'].reset();
    this.form.controls['status'].setValue(1);
    this.formulario = 0;
    this.productos = [];
    this.ngOnInit();
  }

  obSubmit() {
    if (this.form.valid) {
      if (this.formulario === 1) {
        this.authService.registerDasboard(this.form.value)
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
              this.resetInformacion('La marca se ha registrado');
            }
          });
      } else if (this.formulario === 2) {
        this.authService.updateDasboard(this.form.value)
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
              this.resetInformacion('La marca se ha actualizado');
            }
          });
      }
    }
  }

  update(id: string, title: string, sub_title: string, description: string, price: number,status: number) {
    this.form.controls['_id'].setValue(id);
    this.form.controls['title'].setValue(title);
    this.form.controls['sub_title'].setValue(sub_title);
    this.form.controls['description'].setValue(description);
    this.form.controls['price'].setValue(price);
    this.form.controls['status'].setValue(status);
    this.validarFormulario(2);
  }

  cambiarEstado(id: string, estado: number) {
    const vali = { id: id, status: estado };//common.models.ts los mismos valores
    const mensaje = estado == 0 ? 'Inactivado.' : 'Activado.';
    this.authService.cambiarEstadoDasboard(vali).subscribe({
      next: (response) => {
        this.resetInformacion('La marca se ha ' + mensaje);
      }
    })
  }
}
