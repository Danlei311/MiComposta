import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteComprasServicio } from '../../services/cliente-compras-servicio';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compras-cliente',
  imports: [CommonModule, FormsModule],
  templateUrl: './compras-cliente.html',
  styleUrl: './compras-cliente.css'
})
export class ComprasCliente implements OnInit {
  cotizacionesPendientes: any[] = [];
  cotizacionSeleccionada: any = null;

  datosPago: any = {
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
    nombreTitular: ''
  };

  misCompras: any[] = [];
  compraSeleccionada: any = null;
  nuevoComentario: any = {
    texto: '',
    valoracion: 0,
    idUsuario: 0,
    idVenta: 0
  };

  @ViewChild('detallesModal') detallesModal!: TemplateRef<any>;
  @ViewChild('confirmCancelModal') confirmCancelModal!: TemplateRef<any>;
  @ViewChild('pagoModal') pagoModal!: TemplateRef<any>;
  @ViewChild('comentarioModal') comentarioModal!: TemplateRef<any>;

  constructor(
    private comprasService: ClienteComprasServicio,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.cargarCotizacionesPendientes();
    this.cargarMisCompras();
  }

  cargarCotizacionesPendientes(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo identificar al usuario',
        confirmButtonColor: '#254635'
      });
      return;
    }

    Swal.fire({
      title: 'Cargando cotizaciones...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.comprasService.getCotizacionesPendientes(parseInt(userId)).subscribe({
      next: (response) => {
        this.cotizacionesPendientes = response;
        Swal.close();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las cotizaciones',
          confirmButtonColor: '#254635'
        });
        console.error('Error al cargar cotizaciones:', err);
      }
    });
  }

  verDetalles(cotizacion: any): void {
    this.cotizacionSeleccionada = cotizacion;
    this.modalService.open(this.detallesModal, { size: 'lg' });
  }

  solicitarCancelacion(): void {
    this.modalService.dismissAll();
    this.modalService.open(this.confirmCancelModal);
  }

  solicitarPago(): void {
    this.modalService.dismissAll();
    this.modalService.open(this.pagoModal, { size: 'lg' });
  }

  confirmarCancelacion(): void {
    Swal.fire({
      title: 'Procesando cancelación...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.comprasService.cancelarCotizacion(this.cotizacionSeleccionada.idCotizacion).subscribe({
      next: () => {
        this.modalService.dismissAll();
        Swal.fire({
          icon: 'success',
          title: '¡Cotización cancelada!',
          text: 'La cotización ha sido cancelada correctamente.',
          confirmButtonColor: '#254635',
          timer: 3000,
          timerProgressBar: true
        }).then(() => {
          this.cargarCotizacionesPendientes();
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cancelar la cotización',
          confirmButtonColor: '#254635'
        });
        console.error('Error al cancelar cotización:', err);
      }
    });
  }

  procesarPago(): void {
    // Validar que todos los campos estén llenos
    if (!this.datosPago.numeroTarjeta || !this.datosPago.fechaExpiracion ||
      !this.datosPago.cvv || !this.datosPago.nombreTitular) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor complete todos los datos de pago',
        confirmButtonColor: '#254635'
      });
      return;
    }

    const pagoRequest = {
      IdCotizacion: this.cotizacionSeleccionada.idCotizacion
    };

    this.comprasService.procesarPago(pagoRequest).subscribe({
      next: () => {
        this.modalService.dismissAll();
        this.resetearDatosPago();
        Swal.fire({
          title: '<strong style="color: #254635; font-size: 1.5em;">¡Gracias por tu compra!</strong>',
          html: `
            <div style="color: #3a3a3a; font-size: 1.1em; margin: 1em 0;">
              Tu pago ha sido procesado exitosamente.
            </div>
            <div style="margin: 1.5em 0;">
              <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" 
                   width="100" 
                   height="100" 
                   alt="Gracias">
            </div>
          `,
          width: '32em',
          padding: '2em',
          background: '#fff',
          backdrop: `
            rgba(37, 70, 53, 0.4)
            left top
            no-repeat
          `,
          showConfirmButton: true,
          confirmButtonColor: '#254635',
          confirmButtonText: '¡Genial!',
          customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            htmlContainer: 'swal2-html-custom'
          }
        }).then(() => {
          this.cargarCotizacionesPendientes();
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo procesar el pago',
          confirmButtonColor: '#254635'
        });
        console.error('Error al procesar pago:', err);
      }
    });
  }

  resetearDatosPago(): void {
    this.datosPago = {
      numeroTarjeta: '',
      fechaExpiracion: '',
      cvv: '',
      nombreTitular: ''
    };
  }


  // Cargar las compras del cliente ------------------------------
  cargarMisCompras(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.comprasService.getVentasPorUsuario(parseInt(userId)).subscribe({
      next: (compras) => {
        this.misCompras = compras.map((compra: any) => ({
          ...compra,
          valoracion: compra.valoracion || 0,
          estadoComentario: compra.estadoComentario || 'Sin comentario'
        }));
      },
      error: (err) => {
        console.error('Error al cargar compras:', err);
      }
    });
  }

  abrirModalComentario(event: Event, compra: any): void {
    event.stopPropagation();
    this.compraSeleccionada = compra;
    const userId = localStorage.getItem('userId');

    this.nuevoComentario = {
      texto: '',
      valoracion: 0, // Inicializa en 0
      idUsuario: userId ? parseInt(userId) : 0,
      idVenta: compra.idVenta
    };

    this.modalService.open(this.comentarioModal);
  }

  guardarComentario(): void {
    // Validaciones
    if (!this.nuevoComentario.texto) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor escribe tu comentario',
        confirmButtonColor: '#254635'
      });
      return;
    }

    if (this.nuevoComentario.valoracion < 1 || this.nuevoComentario.valoracion > 5) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor selecciona una valoración entre 1 y 5 estrellas',
        confirmButtonColor: '#254635'
      });
      return;
    }

    this.comprasService.guardarComentario(this.nuevoComentario).subscribe({
      next: (response) => {
        // Actualizar la compra localmente
        const compraIndex = this.misCompras.findIndex(c => c.idVenta === this.compraSeleccionada.idVenta);
        if (compraIndex !== -1) {
          this.misCompras[compraIndex].tieneComentario = true;
          this.misCompras[compraIndex].comentario = this.nuevoComentario.texto;
          this.misCompras[compraIndex].valoracion = this.nuevoComentario.valoracion;
          this.misCompras[compraIndex].estadoComentario = 'Pendiente';
        }

        this.modalService.dismissAll();
        Swal.fire({
          icon: 'success',
          title: '¡Comentario enviado!',
          html: `
            <p>Tu comentario ha sido enviado para revisión.</p>
            <p class="text-muted small">Estará visible una vez aprobado.</p>
          `,
          confirmButtonColor: '#254635',
          timer: 3000
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo guardar el comentario',
          confirmButtonColor: '#254635'
        });
        console.error('Error al guardar comentario:', err);
      }
    });
  }

}
