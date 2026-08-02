import { Conquistador, Pagina, SeccionCartilla } from '../services/conquistadores.service';

type CartillaVacia = NonNullable<Conquistador['cartilla']>;

function pagina(numero_pagina: number, contenido: string, pagina_texto?: string): Pagina {
  return {
    numero_pagina,
    contenido,
    pagina_texto,
    estado: 'Por hacer',
    fecha_realizacion: null
  };
}

function seccion(titulo: string, paginas: Pagina[]): SeccionCartilla {
  return { titulo, estado_seccion: 'Por hacer', paginas };
}

// Índice oficial de la cartilla "Amigo" (secciones básica y avanzada).
const CARTILLA_AMIGO: CartillaVacia = {
  regular: [
    seccion('Requisitos Generales', [
      pagina(4, 'Ley del Conquistador y su significado'),
      pagina(5, 'Lectura del libro "El sendero de la felicidad"'),
      pagina(5, 'Certificado vigente del Club del Libro')
    ]),
    seccion('Investigación Bíblica', [
      pagina(6, 'Libros del Antiguo Testamento y sus divisiones'),
      pagina(7, 'Certificado vigente de Gemas Bíblicas'),
      pagina(7, 'Explicación del Salmo 23 o Salmo 46')
    ]),
    seccion('Desarrollo Espiritual', [
      pagina(8, 'Estudio de José, Jonás, Ester o Rut y discusión grupal')
    ]),
    seccion('Sirviendo a Otros', [
      pagina(9, 'Dos horas de servicio comunitario')
    ]),
    seccion('Ciudadanía Cristiana', [
      pagina(10, 'Ser un buen ciudadano en la escuela y el hogar')
    ]),
    seccion('Historia Denominacional', [
      pagina(11, 'Intercambio de ideas sobre el período desde la ascensión de Cristo hasta 1844')
    ]),
    seccion('Salud y Bienestar Físico', [
      pagina(12, 'Principios de temperancia y ejemplo de Daniel'),
      pagina(12, 'Daniel 1:8 y voto personal'),
      pagina(13, 'Razones para vivir en armonía con la temperancia')
    ]),
    seccion('Estudio de la Naturaleza', [
      pagina(14, 'Clasificación de alimentos: proteínas, minerales y vitaminas'),
      pagina(14, 'Actividades de nutrición y salud', '14–15'),
      pagina(19, 'Identificación de flores de la región', '19–20')
    ]),
    seccion('Destrezas de Campamento y Seguridad', [
      pagina(16, 'Actividades de campamento y seguridad básica', '16–18')
    ]),
    seccion('Seguridad y Prevención', [
      pagina(21, 'Seguridad vial en bicicleta', '21–25'),
      pagina(25, 'Reglas de seguridad en la casa')
    ]),
    seccion('Cierre de la sección básica', [
      pagina(26, 'Actividades finales antes de la Sección Avanzada', '26–28')
    ])
  ],
  avanzada: [
    seccion('Requisitos Generales', [
      pagina(29, 'Himno del Conquistador y primera estrofa del Himno Nacional')
    ]),
    seccion('Purificación del agua y refugios', [
      pagina(30, 'Métodos para purificar el agua'),
      pagina(31, 'Construcción de refugios y significado espiritual del agua de vida y refugio')
    ]),
    seccion('Sirviendo a Otros', [
      pagina(32, 'Llevar dos visitas a la Escuela Sabática o reunión de Conquistadores')
    ]),
    seccion('Historia Denominacional', [
      pagina(32, 'Examen basado en "El Conflicto de los siglos"', '32–33')
    ]),
    seccion('Salud y Bienestar Físico', [
      pagina(34, 'Hornear, hervir y freír comidas en campamento')
    ]),
    seccion('Estudio de la Naturaleza', [
      pagina(35, 'Identificar diez flores silvestres'),
      pagina(36, 'Identificar diez insectos de la zona')
    ]),
    seccion('Destrezas de Campamento y Supervivencia', [
      pagina(37, 'Encender fuego con combustible natural'),
      pagina(37, 'Uso seguro del hacha y el cuchillo', '37–38'),
      pagina(38, 'Atar cinco nudos con velocidad')
    ]),
    seccion('Certificación Final', [
      pagina(39, 'Constancia de cumplimiento de requisitos de la clase Amigo', '39–40')
    ])
  ]
};

// Índice oficial de la cartilla "Compañero".
const CARTILLA_COMPANERO: CartillaVacia = {
  regular: [
    seccion('Requisitos Generales', [
      pagina(4, 'Ley del Conquistador y explicación práctica'),
      pagina(5, 'Lectura del libro devocional juvenil indicado'),
      pagina(5, 'Certificado vigente del Club del Libro')
    ]),
    seccion('Investigación Bíblica', [
      pagina(6, 'Libros del Nuevo Testamento y sus divisiones'),
      pagina(7, 'Certificado vigente de Gemas Bíblicas'),
      pagina(7, 'Explicación de un pasaje bíblico seleccionado')
    ]),
    seccion('Desarrollo Espiritual', [
      pagina(8, 'Estudio de personajes bíblicos y aplicación práctica')
    ]),
    seccion('Sirviendo a Otros', [
      pagina(9, 'Actividades de servicio cristiano y ayuda comunitaria')
    ]),
    seccion('Ciudadanía Cristiana', [
      pagina(10, 'Deberes del buen ciudadano y convivencia cristiana')
    ]),
    seccion('Historia Denominacional', [
      pagina(11, 'Acontecimientos importantes de la Iglesia Adventista')
    ]),
    seccion('Salud y Bienestar Físico', [
      pagina(12, 'Principios de salud, ejercicio y temperancia'),
      pagina(13, 'Compromiso personal con un estilo de vida saludable')
    ]),
    seccion('Estudio de la Naturaleza', [
      pagina(14, 'Clasificación de plantas y observación de la naturaleza'),
      pagina(15, 'Actividades prácticas relacionadas con el medio ambiente')
    ]),
    seccion('Destrezas de Campamento y Seguridad', [
      pagina(16, 'Nudos, amarres y herramientas básicas'),
      pagina(17, 'Seguridad en campamentos y excursiones'),
      pagina(18, 'Actividades prácticas de orientación y campismo')
    ]),
    seccion('Naturaleza y Observación', [
      pagina(19, 'Identificación de especies comunes de la región')
    ]),
    seccion('Seguridad y Prevención', [
      pagina(20, 'Normas de seguridad personal y del hogar'),
      pagina(21, 'Prevención de accidentes y respuesta básica')
    ]),
    seccion('Cierre de la sección básica', [
      pagina(22, 'Actividades de repaso y evaluación previa', '22–23')
    ])
  ],
  avanzada: [
    seccion('Requisitos Generales', [
      pagina(24, 'Himno del Conquistador y elementos cívicos complementarios')
    ]),
    seccion('Investigación Bíblica Avanzada', [
      pagina(25, 'Actividades adicionales de estudio bíblico')
    ]),
    seccion('Historia Denominacional Avanzada', [
      pagina(25, 'Evaluación sobre historia de la Iglesia Adventista')
    ]),
    seccion('Salud y Bienestar Físico Avanzado', [
      pagina(26, 'Preparación de alimentos sencillos en campamento')
    ]),
    seccion('Estudio de la Naturaleza Avanzado', [
      pagina(27, 'Identificación de flores, árboles o insectos de la zona')
    ]),
    seccion('Destrezas de Campamento y Supervivencia', [
      pagina(28, 'Encendido de fuego con materiales naturales'),
      pagina(28, 'Uso seguro de herramientas y práctica de nudos')
    ]),
    seccion('Certificación Final', [
      pagina(29, 'Registro y constancia de cumplimiento de requisitos')
    ])
  ]
};

// Índice oficial de la cartilla "Explorador".
const CARTILLA_EXPLORADOR: CartillaVacia = {
  regular: [
    seccion('Requisitos Generales', [
      pagina(4, 'Ley del Conquistador y aplicación práctica'),
      pagina(5, 'Lectura del libro devocional correspondiente'),
      pagina(5, 'Certificado vigente del Club del Libro')
    ]),
    seccion('Investigación Bíblica', [
      pagina(6, 'Organización y divisiones de la Biblia'),
      pagina(7, 'Certificado vigente de Gemas Bíblicas'),
      pagina(7, 'Estudio y explicación de un pasaje bíblico')
    ]),
    seccion('Desarrollo Espiritual', [
      pagina(8, 'Estudio de personajes bíblicos y reflexión espiritual')
    ]),
    seccion('Sirviendo a Otros', [
      pagina(9, 'Actividades de servicio y ayuda al prójimo')
    ]),
    seccion('Ciudadanía Cristiana', [
      pagina(10, 'Responsabilidades del ciudadano cristiano')
    ]),
    seccion('Historia Denominacional', [
      pagina(11, 'Eventos importantes del movimiento adventista')
    ]),
    seccion('Salud y Bienestar Físico', [
      pagina(12, 'Principios de salud, ejercicio y temperancia'),
      pagina(13, 'Compromiso personal de vida saludable')
    ]),
    seccion('Estudio de la Naturaleza', [
      pagina(14, 'Observación y clasificación de elementos de la naturaleza'),
      pagina(15, 'Actividades prácticas de cuidado ambiental')
    ]),
    seccion('Destrezas de Campamento y Seguridad', [
      pagina(16, 'Nudos, amarres y herramientas básicas'),
      pagina(17, 'Seguridad en campamentos y excursiones'),
      pagina(18, 'Orientación y actividades prácticas de campismo')
    ]),
    seccion('Naturaleza y Observación', [
      pagina(19, 'Identificación de especies de la región')
    ]),
    seccion('Seguridad y Prevención', [
      pagina(20, 'Normas de seguridad personal y del hogar'),
      pagina(21, 'Prevención de accidentes y primeros auxilios básicos')
    ]),
    seccion('Cierre de la sección básica', [
      pagina(22, 'Actividades de repaso y evaluación')
    ])
  ],
  avanzada: [
    seccion('Requisitos Generales', [
      pagina(23, 'Himno del Conquistador y actividades complementarias')
    ]),
    seccion('Investigación Bíblica Avanzada', [
      pagina(24, 'Actividades adicionales de estudio bíblico')
    ]),
    seccion('Historia Denominacional Avanzada', [
      pagina(24, 'Evaluación sobre historia de la Iglesia Adventista')
    ]),
    seccion('Salud y Bienestar Físico Avanzado', [
      pagina(25, 'Preparación de alimentos sencillos para campamento')
    ]),
    seccion('Estudio de la Naturaleza Avanzado', [
      pagina(26, 'Identificación de flores, árboles o insectos de la zona')
    ]),
    seccion('Destrezas de Campamento y Supervivencia', [
      pagina(27, 'Encendido de fuego con materiales naturales'),
      pagina(27, 'Uso seguro de herramientas y práctica de nudos')
    ]),
    seccion('Certificación Final', [
      pagina(27, 'Registro y constancia de cumplimiento de requisitos')
    ])
  ]
};

// Índice oficial de la cartilla "Orientador".
const CARTILLA_ORIENTADOR: CartillaVacia = {
  regular: [
    seccion('Requisitos Generales', [
      pagina(4, 'Ley del Conquistador y aplicación práctica'),
      pagina(5, 'Lectura del libro devocional correspondiente'),
      pagina(5, 'Certificado vigente del Club del Libro')
    ]),
    seccion('Investigación Bíblica', [
      pagina(6, 'Organización y divisiones de la Biblia'),
      pagina(7, 'Certificado vigente de Gemas Bíblicas'),
      pagina(7, 'Estudio y explicación de un pasaje bíblico')
    ]),
    seccion('Desarrollo Espiritual', [
      pagina(8, 'Estudio de personajes bíblicos y reflexión espiritual')
    ]),
    seccion('Sirviendo a Otros', [
      pagina(9, 'Actividades de servicio cristiano y ayuda al prójimo')
    ]),
    seccion('Ciudadanía Cristiana', [
      pagina(10, 'Responsabilidades del ciudadano cristiano')
    ]),
    seccion('Historia Denominacional', [
      pagina(11, 'Eventos importantes del movimiento adventista')
    ]),
    seccion('Salud y Bienestar Físico', [
      pagina(12, 'Principios de salud, ejercicio y temperancia'),
      pagina(13, 'Compromiso personal de vida saludable')
    ]),
    seccion('Estudio de la Naturaleza', [
      pagina(14, 'Observación y clasificación de elementos de la naturaleza'),
      pagina(15, 'Actividades prácticas de cuidado ambiental')
    ]),
    seccion('Destrezas de Campamento y Seguridad', [
      pagina(16, 'Nudos, amarres y herramientas básicas'),
      pagina(17, 'Seguridad en campamentos y excursiones'),
      pagina(18, 'Orientación y actividades prácticas de campismo')
    ]),
    seccion('Naturaleza y Observación', [
      pagina(19, 'Identificación de especies de la región')
    ]),
    seccion('Seguridad y Prevención', [
      pagina(20, 'Normas de seguridad personal y del hogar'),
      pagina(21, 'Prevención de accidentes y primeros auxilios básicos')
    ]),
    seccion('Cierre de la sección básica', [
      pagina(22, 'Actividades de repaso y evaluación', '22–24')
    ])
  ],
  avanzada: [
    seccion('Requisitos Generales', [
      pagina(25, 'Himno del Conquistador y actividades complementarias')
    ]),
    seccion('Investigación Bíblica Avanzada', [
      pagina(26, 'Actividades adicionales de estudio bíblico')
    ]),
    seccion('Historia Denominacional Avanzada', [
      pagina(27, 'Evaluación sobre historia de la Iglesia Adventista')
    ]),
    seccion('Salud y Bienestar Físico Avanzado', [
      pagina(28, 'Preparación de alimentos sencillos para campamento')
    ]),
    seccion('Estudio de la Naturaleza Avanzado', [
      pagina(29, 'Identificación de flores, árboles o insectos de la zona')
    ]),
    seccion('Destrezas de Campamento y Supervivencia', [
      pagina(30, 'Encendido de fuego con materiales naturales'),
      pagina(31, 'Uso seguro de herramientas y práctica de nudos'),
      pagina(32, 'Actividades avanzadas de campismo y orientación', '32–33')
    ]),
    seccion('Evaluación y cierre', [
      pagina(34, 'Revisión final de requisitos')
    ]),
    seccion('Certificación Final', [
      pagina(35, 'Registro y constancia de cumplimiento de requisitos')
    ])
  ]
};

// Índice oficial de la cartilla "Viajero".
const CARTILLA_VIAJERO: CartillaVacia = {
  regular: [
    seccion('Requisitos Generales', [
      pagina(4, 'Ley del Conquistador y aplicación práctica'),
      pagina(5, 'Lectura del libro devocional correspondiente'),
      pagina(5, 'Certificado vigente del Club del Libro')
    ]),
    seccion('Investigación Bíblica', [
      pagina(6, 'Organización y divisiones de la Biblia'),
      pagina(7, 'Certificado vigente de Gemas Bíblicas'),
      pagina(7, 'Estudio y explicación de un pasaje bíblico')
    ]),
    seccion('Desarrollo Espiritual', [
      pagina(8, 'Estudio de personajes bíblicos y reflexión espiritual')
    ]),
    seccion('Sirviendo a Otros', [
      pagina(9, 'Actividades de servicio cristiano y ayuda al prójimo')
    ]),
    seccion('Ciudadanía Cristiana', [
      pagina(10, 'Responsabilidades del ciudadano cristiano')
    ]),
    seccion('Historia Denominacional', [
      pagina(11, 'Eventos importantes del movimiento adventista')
    ]),
    seccion('Salud y Bienestar Físico', [
      pagina(12, 'Principios de salud, ejercicio y temperancia'),
      pagina(13, 'Compromiso personal de vida saludable')
    ]),
    seccion('Estudio de la Naturaleza', [
      pagina(14, 'Observación y clasificación de elementos de la naturaleza'),
      pagina(15, 'Actividades prácticas de cuidado ambiental')
    ]),
    seccion('Destrezas de Campamento y Seguridad', [
      pagina(16, 'Nudos, amarres y herramientas básicas'),
      pagina(17, 'Seguridad en campamentos y excursiones')
    ])
  ],
  avanzada: [
    seccion('Requisitos Generales', [
      pagina(18, 'Himno del Conquistador y actividades complementarias')
    ]),
    seccion('Investigación Bíblica Avanzada', [
      pagina(18, 'Actividades adicionales de estudio bíblico', '18–19')
    ]),
    seccion('Historia Denominacional Avanzada', [
      pagina(19, 'Evaluación sobre historia de la Iglesia Adventista')
    ]),
    seccion('Salud y Bienestar Físico Avanzado', [
      pagina(20, 'Preparación de alimentos sencillos para campamento')
    ]),
    seccion('Estudio de la Naturaleza Avanzado', [
      pagina(20, 'Identificación de flores, árboles o insectos de la zona')
    ]),
    seccion('Destrezas de Campamento y Supervivencia', [
      pagina(21, 'Encendido de fuego con materiales naturales'),
      pagina(21, 'Uso seguro de herramientas y práctica de nudos')
    ]),
    seccion('Certificación Final', [
      pagina(21, 'Registro y constancia de cumplimiento de requisitos')
    ])
  ]
};

// Índice oficial de la cartilla "Guía".
const CARTILLA_GUIA: CartillaVacia = {
  regular: [
    seccion('Requisitos Generales', [
      pagina(4, 'Ley del Conquistador y aplicación práctica'),
      pagina(5, 'Lectura del libro devocional correspondiente'),
      pagina(5, 'Certificado vigente del Club del Libro')
    ]),
    seccion('Investigación Bíblica', [
      pagina(6, 'Organización y divisiones de la Biblia'),
      pagina(7, 'Certificado vigente de Gemas Bíblicas'),
      pagina(7, 'Estudio y explicación de un pasaje bíblico')
    ]),
    seccion('Desarrollo Espiritual', [
      pagina(8, 'Estudio de personajes bíblicos y reflexión espiritual')
    ]),
    seccion('Sirviendo a Otros', [
      pagina(9, 'Actividades de servicio cristiano y ayuda al prójimo')
    ]),
    seccion('Ciudadanía Cristiana', [
      pagina(10, 'Responsabilidades del ciudadano cristiano')
    ]),
    seccion('Historia Denominacional', [
      pagina(11, 'Eventos importantes del movimiento adventista')
    ]),
    seccion('Salud y Bienestar Físico', [
      pagina(12, 'Principios de salud, ejercicio y temperancia'),
      pagina(13, 'Compromiso personal de vida saludable')
    ]),
    seccion('Estudio de la Naturaleza', [
      pagina(14, 'Observación y clasificación de elementos de la naturaleza'),
      pagina(15, 'Actividades prácticas de cuidado ambiental')
    ]),
    seccion('Destrezas de Campamento y Seguridad', [
      pagina(16, 'Nudos, amarres y herramientas básicas'),
      pagina(17, 'Seguridad en campamentos y excursiones'),
      pagina(18, 'Orientación y actividades prácticas de campismo')
    ]),
    seccion('Naturaleza y Observación', [
      pagina(19, 'Identificación de especies de la región')
    ]),
    seccion('Seguridad y Prevención', [
      pagina(20, 'Normas de seguridad personal y del hogar'),
      pagina(21, 'Prevención de accidentes y primeros auxilios básicos')
    ]),
    seccion('Cierre de la sección básica', [
      pagina(22, 'Actividades de repaso y evaluación')
    ])
  ],
  avanzada: [
    seccion('Requisitos Generales', [
      pagina(23, 'Himno del Conquistador y actividades complementarias')
    ]),
    seccion('Investigación Bíblica Avanzada', [
      pagina(24, 'Actividades adicionales de estudio bíblico')
    ]),
    seccion('Historia Denominacional Avanzada', [
      pagina(24, 'Evaluación sobre historia de la Iglesia Adventista')
    ]),
    seccion('Salud y Bienestar Físico Avanzado', [
      pagina(25, 'Preparación de alimentos sencillos para campamento')
    ]),
    seccion('Estudio de la Naturaleza Avanzado', [
      pagina(25, 'Identificación de flores, árboles o insectos de la zona')
    ]),
    seccion('Destrezas de Campamento y Supervivencia', [
      pagina(26, 'Encendido de fuego con materiales naturales'),
      pagina(26, 'Uso seguro de herramientas y práctica de nudos')
    ]),
    seccion('Certificación Final', [
      pagina(26, 'Registro y constancia de cumplimiento de requisitos')
    ])
  ]
};

const PLANTILLAS_POR_CLASE: Record<string, CartillaVacia> = {
  'Amigo': CARTILLA_AMIGO,
  'Compañero': CARTILLA_COMPANERO,
  'Explorador': CARTILLA_EXPLORADOR,
  'Orientador': CARTILLA_ORIENTADOR,
  'Viajero': CARTILLA_VIAJERO,
  'Guía': CARTILLA_GUIA
};

export function crearCartillaInicial(claseNombre: string): CartillaVacia {
  const plantilla = PLANTILLAS_POR_CLASE[claseNombre];
  if (!plantilla) {
    return { regular: [], avanzada: [] };
  }
  // Clona profundo para que cada conquistador tenga su propia copia independiente.
  return JSON.parse(JSON.stringify(plantilla));
}
