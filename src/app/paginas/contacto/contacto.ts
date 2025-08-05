import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CotizacionServicio } from '../../services/cotizacion-servicio';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class Contacto implements OnInit {

  productos: any[] = [];
  materiales: any[] = [];
  selectedProducto: any = null;
  usuario = { nombre: '', apellido: '', correo: '', telefono: '' };
  cotizacionPrevia: any = null;
  productoSeleccionado: any = null;

  @ViewChild('cotizacionModal') cotizacionModal!: TemplateRef<any>;

  constructor(private cotizacionService: CotizacionServicio, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.obtenerProductos(); // Cargar productos desde el backend
  }

  obtenerProductos(): void {
    this.cotizacionService.getProductosYMateriales().subscribe({
      next: (response) => {
        this.productos = response;
      },
      error: (err) => {
        console.error('Error al obtener los productos:', err);
      }
    });
  }

  cargarMateriales(): void {
    // Convertir selectedProducto a número
    const id = Number(this.selectedProducto); // <-- Convertir a número

    // Encontrar el producto seleccionado
    this.productoSeleccionado = this.productos.find(p => p.idProducto === id);
    if (this.productoSeleccionado) {
        this.materiales = this.productoSeleccionado.materiales.map((material: any) => ({
            ...material,
            selected: false
        }));
    } else {
        this.materiales = [];
    }
  }

  cotizar(): void {
    if (!this.selectedProducto) {
      Swal.fire({
        icon: 'warning',
        title: 'Selección requerida',
        text: 'Por favor selecciona un producto',
        confirmButtonColor: '#254635'
      });
      return;
    }

    // Validar datos del usuario
    if (!this.usuario.nombre || !this.usuario.correo || !this.usuario.telefono || !this.usuario.apellido) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor completa todos tus datos',
        confirmButtonColor: '#254635'
      });
      return;
    }

    // Validación específica para el correo
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.usuario.correo || !emailRegex.test(this.usuario.correo)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor ingresa un correo electrónico válido',
        confirmButtonColor: '#254635'
      });
      return;
    }

    const materialesSeleccionados = this.materiales
      .filter(m => m.selected)
      .map(m => ({ idMaterial: m.idMaterial, cantidad: 1 }));

    const request = {
      idProducto: Number(this.selectedProducto),
      materialesSeleccionados: materialesSeleccionados
    };

    this.cotizacionService.calcularCotizacionPrevia(request).subscribe({
      next: (response) => {
        this.cotizacionPrevia = response;
        this.mostrarModalCotizacion();
      },
      error: (err) => {
        console.error('Error al calcular cotización:', err);
        alert('Error al calcular la cotización');
      }
    });
  }

  mostrarModalCotizacion(): void {
    const modalRef = this.modalService.open(this.cotizacionModal, { size: 'lg' });

    modalRef.result.then((result) => {
      if (result === 'Confirmar') {
        this.confirmarCotizacion();
      }
    }, (reason) => {
      console.log('Modal cerrado:', reason);
    });
  }

  confirmarCotizacion(): void {
    // Usamos directamente los materiales de la cotización previa
    const materialesParaGuardar = this.cotizacionPrevia.materiales.map((m: any) => ({
      idMaterial: m.idMaterial,
      cantidad: m.cantidad,
      costoUnitario: m.costoUnitario
    }));

    const cotizacionData = {
      idProducto: this.cotizacionPrevia.idProducto,
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      correo: this.usuario.correo,
      telefono: this.usuario.telefono,
      costoProduccion: this.cotizacionPrevia.costoProduccion,
      precioVenta: this.cotizacionPrevia.precioVenta,
      materiales: materialesParaGuardar
    };

    this.cotizacionService.realizarCotizacion(cotizacionData).subscribe({
      next: (response) => {
        this.modalService.dismissAll();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: response.message || 'Cotización registrada con éxito',
          confirmButtonColor: '#254635',
          timer: 6000
        });
        this.resetForm();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Error al registrar la cotización',
          confirmButtonColor: '#254635'
        });
      }
    });
  }

  // Método para resetear el formulario
  resetForm(): void {
    this.usuario = { nombre: '', apellido: '', correo: '', telefono: '' };
    this.selectedProducto = null;
    this.materiales = [];
    this.cotizacionPrevia = null;
  }

}
