export interface Propuesta {
  pilar: string;
  titulo: string;
  descripcion: string;
  imagen: string;
}

export const propuestas: Propuesta[] = [
  // ══════════════════════════════════════════
  // TRANSPARENCIA
  // ══════════════════════════════════════════
  {
    pilar: "transparencia",
    titulo: "Portal de gestión abierto",
    descripcion: "Cada peso público rastreable en línea. Sin secretos.",
    imagen: "https://picsum.photos/seed/portal-transparencia/600/400",
  },
  {
    pilar: "transparencia",
    titulo: "Auditoría ciudadana",
    descripcion:
      "Los vecinos podrán revisar y auditar las cuentas municipales.",
    imagen: "https://picsum.photos/seed/auditoria/600/400",
  },
  {
    pilar: "transparencia",
    titulo: "Declaración jurada en línea",
    descripcion: "Todos los funcionarios con sus declaraciones públicas.",
    imagen: "https://picsum.photos/seed/declaracion-jurada/600/400",
  },

  // ══════════════════════════════════════════
  // LIBERTAD
  // ══════════════════════════════════════════
  {
    pilar: "libertad",
    titulo: "Desburocratización municipal",
    descripcion: "Reducir trámites y agilizar la apertura de negocios.",
    imagen: "https://picsum.photos/seed/desburocratizacion/600/400",
  },
  {
    pilar: "libertad",
    titulo: "Fomento al emprendedor",
    descripcion:
      "Programas de apoyo y financiamiento para nuevos emprendimientos.",
    imagen: "https://picsum.photos/seed/emprendedor/600/400",
  },
  {
    pilar: "libertad",
    titulo: "Eliminación de tasas municipales",
    descripcion: "Revisión y reducción de impuestos que frenan la inversión.",
    imagen: "https://picsum.photos/seed/tasas-municipales/600/400",
  },

  // ══════════════════════════════════════════
  // TERRITORIO
  // ══════════════════════════════════════════
  {
    pilar: "territorio",
    titulo: "Presupuesto participativo barrial",
    descripcion:
      "Cada barrio decide en qué invertir parte del presupuesto municipal.",
    imagen: "https://picsum.photos/seed/presupuesto-participativo/600/400",
  },
  {
    pilar: "territorio",
    titulo: "Plan de obras por barrio",
    descripcion:
      "Infraestructura y servicios priorizados según las necesidades de cada zona.",
    imagen: "https://picsum.photos/seed/obras-barrio/600/400",
  },
  {
    pilar: "territorio",
    titulo: "Consejos vecinales",
    descripcion:
      "Espacios de participación donde los vecinos proponen y deciden.",
    imagen: "https://picsum.photos/seed/consejos-vecinales/600/400",
  },

  // ══════════════════════════════════════════
  // ORDEN
  // ══════════════════════════════════════════
  {
    pilar: "orden",
    titulo: "Plan de seguridad vial",
    descripcion: "Mejora de señalización, alumbrado y cruces seguros.",
    imagen: "https://picsum.photos/seed/seguridad-vial/600/400",
  },
  {
    pilar: "orden",
    titulo: "Ordenamiento urbano",
    descripcion:
      "Planificación y control del crecimiento ordenado de la ciudad.",
    imagen: "https://picsum.photos/seed/ordenamiento-urbano/600/400",
  },
  {
    pilar: "orden",
    titulo: "Mantenimiento de espacios públicos",
    descripcion: "Plazas, parques y veredas en condiciones óptimas.",
    imagen: "https://picsum.photos/seed/espacios-publicos/600/400",
  },
];