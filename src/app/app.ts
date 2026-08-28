import { Component, HostListener, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import emailjs from '@emailjs/browser';

interface Tienda {
  nombre: string;
  logo: string;
  url: string;
  }
  
@Component({
  selector: 'app-root',
  standalone:true,
  imports: [
    
    FormsModule,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  
  copiado = false;
  private cdr = inject(ChangeDetectorRef);
   

  copiarTexto(texto: string): void {

  navigator.clipboard.writeText(texto)
    .then(() => {

      this.copiado = true;

      this.cdr.detectChanges();

      setTimeout(() => {

        this.copiado = false;

        this.cdr.detectChanges();

      }, 2000);

    })
    .catch((error) => {

      console.error('Error al copiar:', error);

    });

}
  menuAbierto = false;
  pesoPaquete: number = 0;
  precioPaquete: number = 0;

  flete: number = 0;
  igv: number = 0;
  impuestoSunat: number = 0;
  desaduanaje: number = 9;
  total: number = 0;

  calcularEnvio(): void {

    const peso = Number(this.pesoPaquete) || 0;
    const precio = Number(this.precioPaquete) || 0;

    this.flete = peso * 8;

    this.igv = this.desaduanaje * 0.18;

    if (precio > 200) {
      this.impuestoSunat = precio * 0.22;
    } else {
      this.impuestoSunat = 0;
    }

    this.total =
      this.flete +
      this.igv +
      this.impuestoSunat +
      this.desaduanaje;
  }
  contacto = {
  nombre: '',
  email: '',
  telefono: '',
  mensaje: ''
};

mensajeEnviado = false;
enviandoFormulario = false;

enviarFormulario(formulario: NgForm): void {

  if (formulario.invalid || this.enviandoFormulario) {
    return;
  }

  this.enviandoFormulario = true;
  this.mensajeEnviado = false;

  const datos = {
    nombre: this.contacto.nombre,
    email: this.contacto.email,
    telefono: this.contacto.telefono,
    mensaje: this.contacto.mensaje
  };

  emailjs.send(
    'service_4ljltny',
    'template_5kcjb8b',
    datos,
    {
      publicKey: '5O_Z9AmjPopoTYyO1'
    }
  )
  .then(() => {

    console.log('Formulario enviado correctamente');

    this.mensajeEnviado = true;

    formulario.resetForm();

    setTimeout(() => {
      this.mensajeEnviado = false;
    }, 5000);

  })
  .catch((error) => {

    console.error('Error al enviar el formulario:', error);

    alert('No se pudo enviar el mensaje. Inténtalo nuevamente.');

  })
  .finally(() => {

    this.enviandoFormulario = false;

  });
}
  
  navbarVisible = true;
  private ultimoScroll = 0;

@HostListener('window:scroll', [])
onWindowScroll(): void {

  const scrollActual = window.scrollY;

  // Siempre visible al estar arriba
  if (scrollActual <= 50) {
    this.navbarVisible = true;
    this.ultimoScroll = scrollActual;
    return;
  }

  // Bajando
  if (scrollActual > this.ultimoScroll) {
    this.navbarVisible = false;
  }

  // Subiendo
  if (scrollActual < this.ultimoScroll) {
    this.navbarVisible = true;
  }

  this.ultimoScroll = scrollActual;
  }
  
  irASeccion(id: string): void {

  const elemento = document.getElementById(id);

  if (!elemento) {
    return;
  }

  this.menuAbierto = false;

  elemento.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

}


  tiendas: Tienda[] = [
    {
      nombre: 'Amazon',
      logo: '/tiendas/AmazonLogo.png',
      url:'https://www.amazon.com/ '
    },
    {
      nombre: 'eBay',
      logo: '/tiendas/EbayLogo.svg',
      url:'https://www.ebay.com/'
    },
    {
      nombre: 'Jomashop',
      logo: '/tiendas/JomashopLogo.png',
      url:'https://www.jomashop.com/'
    },
    {
      nombre: 'Walmart',
      logo: 'tiendas/WalmartLogo.png',
      url:'https://www.walmart.com/'
    },
    {
      nombre: 'Best Buy',
      logo: 'tiendas/BestBuyLogo.png',
      url:'https://www.bestbuy.com/'
    },
    {
      nombre: '6pm',
      logo: 'tiendas/6pmLogo.png',
      url: 'https://www.6pm.com/'
    }
  ];

  indiceTienda: number = 0;

  get tiendasVisibles(): Tienda[] {
  return [
    this.tiendas[this.indiceTienda],
    this.tiendas[(this.indiceTienda + 1) % this.tiendas.length],
    this.tiendas[(this.indiceTienda + 2) % this.tiendas.length]
  ];
}

tiendaSiguiente(): void {
  this.indiceTienda =
    (this.indiceTienda + 1) % this.tiendas.length;
}

tiendaAnterior(): void {
  this.indiceTienda =
    (this.indiceTienda - 1 + this.tiendas.length)
    % this.tiendas.length;
}
}
