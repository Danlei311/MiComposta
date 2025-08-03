import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VentasServicio } from '../../services/ventas-servicio';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ventas',
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class Ventas implements OnInit {
  cotizacionesProceso: any[] = [];
  cotizacionSeleccionada: any = null;

  ventasCompletadas: any[] = [];
  ventaSeleccionada: any = null;
  fechaFiltro: string = '';
  ventasFiltradas: any[] = [];

  @ViewChild('detallesModal') detallesModal!: TemplateRef<any>;
  @ViewChild('detallesVentaModal') detallesVentaModal!: TemplateRef<any>;

  constructor(
    private ventasService: VentasServicio,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.cargarCotizacionesProceso();
    this.cargarVentasCompletadas();
  }

  cargarCotizacionesProceso(): void {
    Swal.fire({
      title: 'Cargando cotizaciones...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.ventasService.getCotizacionesProceso().subscribe({
      next: (response) => {
        this.cotizacionesProceso = response;
        Swal.close();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las cotizaciones en proceso',
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

  cancelarCotizacion(idCotizacion: number): void {
    Swal.fire({
      title: '¿Cancelar cotización?',
      text: 'Esta acción cambiará el estado de la cotización a "Cancelada"',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#254635',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, volver'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Cancelando cotización...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.ventasService.cancelarCotizacion(idCotizacion).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Cotización cancelada!',
              text: 'La cotización ha sido cancelada correctamente',
              confirmButtonColor: '#254635'
            }).then(() => {
              this.cargarCotizacionesProceso();
              this.cargarVentasCompletadas();
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
    });
  }

  completarVenta(idCotizacion: number): void {
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
      title: '¿Completar venta?',
      text: 'Esta acción registrará la venta y cambiará el estado de la cotización',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#254635',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, completar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Procesando venta...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.ventasService.completarVenta(idCotizacion, parseInt(userId)).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: '¡Venta completada!',
              text: response.message || 'La venta ha sido registrada exitosamente',
              confirmButtonColor: '#254635'
            }).then(() => {
              this.cargarCotizacionesProceso();
              this.cargarVentasCompletadas();
            });
          },
          error: (err) => {
            if (err.error?.materialesFaltantes) {
              let mensaje = 'No hay suficiente stock para completar la venta:<br><br>';
              err.error.materialesFaltantes.forEach((material: any) => {
                mensaje += `- ${material.nombreVenta}: Disponible ${material.stockDisponible}, Necesario ${material.cantidadRequerida}<br>`;
              });

              Swal.fire({
                icon: 'error',
                title: 'Stock insuficiente',
                html: mensaje,
                confirmButtonColor: '#254635'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.error?.message || 'No se pudo completar la venta',
                confirmButtonColor: '#254635'
              });
            }
            console.error('Error al completar venta:', err);
          }
        });
      }
    });
  }

  // Cargar ventas completadas -----------------------------
  cargarVentasCompletadas(): void {
    Swal.fire({
      title: 'Cargando ventas...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.ventasService.getVentasCompletadas().subscribe({
      next: (response) => {
        this.ventasCompletadas = response;
        this.ventasFiltradas = response;
        Swal.close();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las ventas completadas',
          confirmButtonColor: '#254635'
        });
        console.error('Error al cargar ventas:', err);
      }
    });
  }

  filtrarPorFecha(): void {
    if (this.fechaFiltro) {
      this.ventasFiltradas = this.ventasCompletadas.filter(venta =>
        this.esMismaFecha(venta.fechaVenta, this.fechaFiltro)
      );
    } else {
      this.ventasFiltradas = [...this.ventasCompletadas];
    }
  }

  private esMismaFecha(fechaA: string | Date, fechaB: string | Date): boolean {
    const a = new Date(fechaA);
    const [yearB, monthB, dayB] = typeof fechaB === 'string'
      ? fechaB.split('-').map(Number)
      : [fechaB.getFullYear(), fechaB.getMonth() + 1, fechaB.getDate()];

    return a.getFullYear() === yearB &&
      (a.getMonth() + 1) === monthB &&
      a.getDate() === dayB;
  }

  mostrarTodasVentas(): void {
    this.fechaFiltro = '';
    this.ventasFiltradas = this.ventasCompletadas;
  }

  verDetallesVenta(venta: any): void {
    this.ventaSeleccionada = venta;
    this.modalService.open(this.detallesVentaModal, { size: 'lg' });
  }

}
