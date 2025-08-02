import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DashboardService } from '../../services/dashboard-services';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  nombreUsuario: string ='';
  usuariosActivos = 0;
  inversion = 0;
  ganancias = 0;
  comprasTotales = 0;
  proveedoresMasComprados: any[] = [];

  desde!: string;
  hasta!: string;
  lineChart!: Chart;
  polarChart!: Chart;
  gananciasChart: Chart | undefined;
  resumenCotizaciones: any;
  ventasChart: Chart | undefined;
  desdeVentas: string = '';
  hastaVentas: string = '';
  mesInicio: string = '';
  mesFin: string = '';

  @ViewChild('lineChartCanvas') lineChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('polarChartCanvas') polarChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ventasChartCanvas') ventasChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('gananciasChartCanvas') gananciasChartCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private dashboardService: DashboardService, private authService: Auth) { }

  ngOnInit(): void {
    this.nombreUsuario = localStorage.getItem('nombre') || 'Usuario Administrador';
    this.cargarMetricas();
    this.obtenerTopComprasAltas();
    this.obtenerResumenCotizaciones();
    this.mostrarGananciasMensuales();

    const hoy = new Date();
    this.hasta = hoy.toISOString().split('T')[0];
    this.desde = new Date(hoy.getFullYear(), hoy.getMonth() - 2, 1).toISOString().split('T')[0];

    setTimeout(() => this.obtenerTendenciaCompras(), 0);
  }

  cargarMetricas(): void {
    this.dashboardService.getClientesActivos().subscribe(resp => {
      this.usuariosActivos = resp.cantidad;
    });

    const fechaActual = new Date();
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();

    this.dashboardService.getGananciasTotales().subscribe(resp => {
      this.ganancias = resp.gananciaTotal;
    });

    this.dashboardService.getInversion().subscribe(resp => {
      this.inversion = resp.inversionTotal;
    })

    this.dashboardService.getComprasTotales().subscribe(resp => {
      this.comprasTotales = resp.sumaTotal;
    });

    this.dashboardService.getProveedoresMasComprados().subscribe(resp => {
      this.proveedoresMasComprados = resp.map((proveedor: any) => ({
        nombre: proveedor.nombre,
        cantidadCompras: proveedor.cantidadCompras,
        totalComprado: proveedor.totalComprado
      }));
    });

  }

  obtenerTendenciaCompras(): void {
    if (!this.desde || !this.hasta) return;

    this.dashboardService.getTendenciaComprasPorMes(this.desde, this.hasta).subscribe(resp => {
      console.log('Tendencia de compras:', resp);

      const labels = resp.map((item: any) => `${item.nombreMes} ${item.año}`);
      const data = resp.map((item: any) => item.totalCompras);

      if (labels.length === 0 || data.length === 0) {
        console.warn('No hay datos para mostrar en el gráfico.');
        return;
      }

      this.renderizarGrafico(labels, data);
    });
  }

  renderizarGrafico(labels: string[], data: number[]): void {
    if (this.lineChart) {
      this.lineChart.destroy();
    }

    this.lineChart = new Chart(this.lineChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Compras mensuales',
            data,
            borderColor: '#3e95cd',
            backgroundColor: 'rgba(62, 149, 205, 0.4)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Tendencia de Compras por Mes'
          },
          legend: {
            display: true
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  calcularPorcentaje(cantidad: number): number {
    if (!this.proveedoresMasComprados || this.proveedoresMasComprados.length === 0) return 0;
    const max = Math.max(...this.proveedoresMasComprados.map(p => p.cantidadCompras));
    return (cantidad / max) * 100;
  }

  obtenerTopComprasAltas(): void {
    this.dashboardService.getTopComprasAltas().subscribe(resp => {
      console.log('Top compras altas:', resp);

      const labels = resp.map((item: any) => item.nombreProveedor);
      const data = resp.map((item: any) => item.totalCompras);

      this.renderizarPolarChart(labels, data);
    });
  }
  renderizarPolarChart(labels: string[], data: number[]): void {
    if (this.polarChart) {
      this.polarChart.destroy();
    }

    this.polarChart = new Chart(this.polarChartCanvas.nativeElement, {
      type: 'polarArea',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Compras más altas por proveedor'
          },
          legend: {
            position: 'right'
          }
        },
        scales: {
          r: {
            beginAtZero: true
          }
        }
      }
    });
  }

  obtenerResumenCotizaciones(): void {
    this.dashboardService.getResumenCotizaciones().subscribe(resp => {
      console.log('Resumen cotizaciones:', resp);
      this.resumenCotizaciones = resp;
    });
  }

  estadoColor(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'aprobada': return 'bg-success text-white';
      case 'pendiente': return 'bg-warning text-dark';
      case 'rechazada': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }

  obtenerTendenciaVentas(): void {
    if (!this.desde || !this.hasta) return;

    this.dashboardService.getTendenciaVentasPorMes(this.desde, this.hasta).subscribe(resp => {
      console.log('Ventas:', resp);

      const labels = resp.map((item: any) => `${item.nombreMes} ${item.año}`);
      const data = resp.map((item: any) => item.totalVentas);

      this.renderizarGraficoVentas(labels, data);
    });
  }

  renderizarGraficoVentas(labels: string[], data: number[]): void {
    if (this.ventasChart) {
      this.ventasChart.destroy();
    }

    const ctx = this.ventasChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.ventasChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ventas por mes',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            stack: 'ventas'
          },
          {
            label: 'Tendencia',
            data: data,
            type: 'line',
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false,
            tension: 0.3,
            stack: 'tendencia'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Tendencia de Ventas por Mes'
          },
          legend: {
            position: 'top'
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            beginAtZero: true
          }
        }
      }
    });
  }

  mostrarGananciasMensuales(): void {
    this.dashboardService.getGananciasMensuales().subscribe(resp => {
      const labels = resp.map((item: any) => `${item.nombreMes} ${item.año}`);
      const ventas = resp.map((item: any) => item.totalVentas);
      const costos = resp.map((item: any) => item.totalCosto);
      const ganancias = resp.map((item: any) => item.ganancia);

      this.renderizarGraficoGanancias(labels, ventas, costos, ganancias);
    });
  }

  renderizarGraficoGanancias(labels: string[], ventas: number[], costos: number[], ganancias: number[]): void {
    if (this.gananciasChart) {
      this.gananciasChart.destroy();
    }

    const ctx = this.gananciasChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.gananciasChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ventas',
            data: ventas,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.3,
            fill: false,
            pointRadius: 5
          },
          {
            label: 'Costo',
            data: costos,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.3,
            fill: false,
            pointRadius: 5
          },
          {
            label: 'Ganancia',
            data: ganancias,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.3,
            fill: true,
            pointRadius: 6,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Ganancias Mensuales'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          },
          legend: {
            position: 'top'
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }


}
