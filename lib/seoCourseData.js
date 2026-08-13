export const SITE_URL = "https://www.mycdlclass.com";

const shared = {
  en: {
    languageName: "English",
    freeLabel: "Free 3-question preview",
    startLabel: "Start the free practice test",
    buyLabel: "Unlock the full course",
    catalogLabel: "View all CDL courses",
    ebookLabel: "Prefer a PDF? Browse CDL ebooks",
    oneTimeLabel: "One-time purchase",
    scoreLabel: "Your preview score",
    disclaimer:
      "MyCDLClass is an independent CDL study resource and is not affiliated with or endorsed by any state licensing agency or the FMCSA. Always check your current state CDL manual.",
  },
  es: {
    languageName: "Español",
    freeLabel: "Vista previa gratis de 3 preguntas",
    startLabel: "Comenzar el examen de práctica gratis",
    buyLabel: "Desbloquear el curso completo",
    catalogLabel: "Ver todos los cursos CDL",
    ebookLabel: "¿Prefieres PDF? Ver libros digitales CDL",
    oneTimeLabel: "Compra única",
    scoreLabel: "Resultado de la práctica",
    disclaimer:
      "MyCDLClass es un recurso independiente de estudio para la CDL y no está afiliado ni respaldado por ninguna agencia estatal de licencias ni por la FMCSA. Consulta siempre el manual CDL vigente de tu estado.",
  },
};

const courses = [
  {
    slug: "general-knowledge",
    en: {
      title: "CDL General Knowledge",
      shortTitle: "General Knowledge",
      primaryKeyword: "CDL general knowledge practice test",
      metaDescription:
        "Take a free CDL general knowledge practice test with instant explanations, then unlock the full MyCDLClass course in English.",
      heading: "Free CDL General Knowledge Practice Test",
      intro: [
        "The CDL general knowledge test checks the safety information every commercial driver needs before operating a commercial motor vehicle. It commonly covers vehicle inspection, basic control, shifting, speed and space management, cargo safety, emergencies, and hazardous driving conditions.",
        "Use this short exam-style preview to find a weak area quickly. Each answer includes a plain-language explanation. When you are ready for more practice, continue with the complete MyCDLClass General Knowledge course.",
      ],
      learn: [
        "Safe vehicle operation and hazard awareness",
        "Pre-trip inspection and basic vehicle control",
        "Cargo, emergencies, weather, and road conditions",
      ],
      faq: [
        {
          q: "What is covered on the CDL general knowledge test?",
          a: "The test generally covers safe operation, inspections, vehicle control, shifting, communication, speed and space management, cargo, emergencies, and hazardous conditions. Your state manual is the final authority.",
        },
        {
          q: "What score is normally required to pass?",
          a: "Most state CDL knowledge tests require at least 80 percent, but candidates should confirm the current requirement with their state licensing agency.",
        },
        {
          q: "Is this an official DMV or DDS test?",
          a: "No. MyCDLClass provides independent exam-style study questions based on common CDL manual topics and is not a government agency.",
        },
      ],
      questions: [
        {
          question: "Before starting down a long, steep downgrade, what should you do?",
          option_a: "Shift to a lower gear",
          option_b: "Wait until the vehicle gains speed",
          option_c: "Coast in neutral",
          option_d: "Apply the brakes continuously",
          correct_answer: "A",
          explanation:
            "Select a safe lower gear before the downgrade. This helps control speed without overusing and overheating the brakes.",
        },
        {
          question: "Why must cargo be inspected during a trip?",
          option_a: "To make the vehicle look balanced",
          option_b: "To prevent shifting or loose cargo from affecting safety",
          option_c: "To reduce the vehicle registration fee",
          option_d: "To increase engine power",
          correct_answer: "B",
          explanation:
            "Cargo can shift or loosen while traveling. Reinspection helps keep the load secure and the vehicle stable.",
        },
        {
          question: "If your vehicle begins to hydroplane, what is the safest response?",
          option_a: "Brake hard immediately",
          option_b: "Turn the steering wheel sharply",
          option_c: "Release the accelerator and avoid sudden braking",
          option_d: "Accelerate to regain traction",
          correct_answer: "C",
          explanation:
            "Ease off the accelerator and avoid abrupt steering or braking until the tires regain contact with the road.",
        },
      ],
    },
    es: {
      title: "Conocimientos Generales CDL",
      shortTitle: "Conocimientos Generales",
      primaryKeyword: "examen de conocimientos generales CDL en español",
      metaDescription:
        "Haz gratis un examen de conocimientos generales CDL en español con explicaciones y continúa con el curso completo de MyCDLClass.",
      heading: "Examen Gratis de Conocimientos Generales CDL",
      intro: [
        "El examen de conocimientos generales CDL evalúa la información de seguridad que todo conductor comercial necesita. Normalmente incluye inspección del vehículo, control básico, cambios de marcha, manejo de velocidad y espacio, seguridad de la carga, emergencias y condiciones peligrosas.",
        "Usa esta práctica breve para identificar rápidamente un tema que debes repasar. Cada respuesta incluye una explicación clara. Después puedes continuar con el curso completo de Conocimientos Generales de MyCDLClass.",
      ],
      learn: [
        "Operación segura y reconocimiento de peligros",
        "Inspección previa y control básico del vehículo",
        "Carga, emergencias, clima y condiciones del camino",
      ],
      faq: [
        {
          q: "¿Qué incluye el examen de conocimientos generales CDL?",
          a: "Generalmente cubre operación segura, inspecciones, control del vehículo, comunicación, velocidad, espacio, carga, emergencias y condiciones peligrosas. El manual de tu estado es la fuente final.",
        },
        {
          q: "¿Qué puntuación se necesita para aprobar?",
          a: "La mayoría de los exámenes estatales CDL requieren al menos 80 por ciento, pero debes confirmar el requisito vigente con la agencia de licencias de tu estado.",
        },
        {
          q: "¿Este es un examen oficial del DMV o DDS?",
          a: "No. MyCDLClass ofrece preguntas independientes de práctica basadas en temas comunes de los manuales CDL y no es una agencia gubernamental.",
        },
      ],
      questions: [
        {
          question: "Antes de comenzar un descenso largo y empinado, ¿qué debes hacer?",
          option_a: "Cambiar a una marcha más baja",
          option_b: "Esperar a que el vehículo gane velocidad",
          option_c: "Bajar en neutral",
          option_d: "Aplicar los frenos continuamente",
          correct_answer: "A",
          explanation:
            "Selecciona una marcha baja y segura antes del descenso. Esto ayuda a controlar la velocidad sin sobrecalentar los frenos.",
        },
        {
          question: "¿Por qué se debe inspeccionar la carga durante el viaje?",
          option_a: "Para que el vehículo se vea equilibrado",
          option_b: "Para evitar que la carga suelta o desplazada afecte la seguridad",
          option_c: "Para reducir el costo del registro",
          option_d: "Para aumentar la potencia del motor",
          correct_answer: "B",
          explanation:
            "La carga puede moverse o aflojarse durante el viaje. Volver a inspeccionarla ayuda a mantenerla segura y al vehículo estable.",
        },
        {
          question: "Si el vehículo comienza a hidroplanear, ¿cuál es la respuesta más segura?",
          option_a: "Frenar con fuerza inmediatamente",
          option_b: "Girar el volante bruscamente",
          option_c: "Soltar el acelerador y evitar frenar de repente",
          option_d: "Acelerar para recuperar tracción",
          correct_answer: "C",
          explanation:
            "Suelta suavemente el acelerador y evita movimientos o frenadas bruscas hasta que las llantas recuperen contacto con el camino.",
        },
      ],
    },
  },
  {
    slug: "air-brakes",
    en: {
      title: "CDL Air Brakes",
      shortTitle: "Air Brakes",
      primaryKeyword: "air brakes practice test",
      metaDescription:
        "Try a free CDL air brakes practice test with answer explanations and prepare for the air-brake knowledge test in English.",
      heading: "Free CDL Air Brakes Practice Test",
      intro: [
        "The air brakes knowledge test focuses on the parts of an air-brake system, normal pressure ranges, warning devices, inspections, and safe braking methods. Drivers must understand how air pressure is created, stored, and used before operating an air-brake-equipped vehicle.",
        "This free preview checks three high-value concepts and explains every answer. Use the complete Air Brakes course for broader practice across system components, inspections, and braking procedures.",
      ],
      learn: [
        "Air compressor, tanks, valves, and brake chambers",
        "Low-air warnings and pressure checks",
        "Safe braking, parking, and emergency procedures",
      ],
      faq: [
        {
          q: "Who needs the CDL air brakes test?",
          a: "Drivers who want to operate a commercial vehicle equipped with air brakes generally must pass the air brakes knowledge test and complete the required skills checks.",
        },
        {
          q: "What causes an air brakes restriction?",
          a: "A driver who does not pass the required air-brake knowledge or skills testing may receive a restriction that prevents operating vehicles with full air brakes.",
        },
        {
          q: "Does this practice replace the state manual?",
          a: "No. Use this practice with the current CDL manual issued or adopted by your state.",
        },
      ],
      questions: [
        {
          question: "The low air pressure warning must activate before pressure drops below approximately:",
          option_a: "20 psi",
          option_b: "40 psi",
          option_c: "60 psi",
          option_d: "100 psi",
          correct_answer: "C",
          explanation:
            "The warning must come on before pressure falls below 60 psi in the air tank or system with the lowest pressure.",
        },
        {
          question: "What is the purpose of draining air tanks?",
          option_a: "To remove moisture and oil",
          option_b: "To increase tire pressure",
          option_c: "To cool the brake drums",
          option_d: "To release the parking brakes",
          correct_answer: "A",
          explanation:
            "Compressed air can carry water and oil into the tanks. Draining helps prevent contamination, freezing, and brake-system problems.",
        },
        {
          question: "The parking brake control is commonly identified as a:",
          option_a: "Blue round knob",
          option_b: "Yellow diamond-shaped knob",
          option_c: "Green square knob",
          option_d: "Red foot pedal",
          correct_answer: "B",
          explanation:
            "The parking brake control is normally a yellow, diamond-shaped push-pull control on air-brake vehicles.",
        },
      ],
    },
    es: {
      title: "Frenos de Aire CDL",
      shortTitle: "Frenos de Aire",
      primaryKeyword: "examen de frenos de aire CDL en español",
      metaDescription:
        "Practica gratis para el examen de frenos de aire CDL en español con explicaciones claras y acceso al curso completo.",
      heading: "Examen Gratis de Frenos de Aire CDL",
      intro: [
        "El examen de frenos de aire se concentra en las partes del sistema, los niveles normales de presión, las señales de advertencia, las inspecciones y los métodos de frenado seguro. El conductor debe entender cómo se produce, almacena y utiliza el aire comprimido.",
        "Esta práctica gratis revisa tres conceptos importantes y explica cada respuesta. El curso completo de Frenos de Aire ofrece práctica adicional sobre componentes, inspecciones y procedimientos de frenado.",
      ],
      learn: [
        "Compresor, tanques, válvulas y cámaras de freno",
        "Advertencias de baja presión y pruebas del sistema",
        "Frenado seguro, estacionamiento y emergencias",
      ],
      faq: [
        {
          q: "¿Quién necesita el examen de frenos de aire CDL?",
          a: "Por lo general, quienes desean operar un vehículo comercial equipado con frenos de aire deben aprobar el examen de conocimientos y las pruebas prácticas requeridas.",
        },
        {
          q: "¿Qué causa una restricción de frenos de aire?",
          a: "No aprobar las pruebas de conocimientos o habilidades requeridas puede producir una restricción que impide operar vehículos con frenos de aire completos.",
        },
        {
          q: "¿Esta práctica reemplaza el manual estatal?",
          a: "No. Utiliza esta práctica junto con el manual CDL vigente emitido o adoptado por tu estado.",
        },
      ],
      questions: [
        {
          question: "La advertencia de baja presión de aire debe activarse antes de que la presión baje de aproximadamente:",
          option_a: "20 psi",
          option_b: "40 psi",
          option_c: "60 psi",
          option_d: "100 psi",
          correct_answer: "C",
          explanation:
            "La advertencia debe activarse antes de que la presión baje de 60 psi en el tanque o sistema con menor presión.",
        },
        {
          question: "¿Para qué se drenan los tanques de aire?",
          option_a: "Para eliminar humedad y aceite",
          option_b: "Para aumentar la presión de las llantas",
          option_c: "Para enfriar los tambores de freno",
          option_d: "Para soltar los frenos de estacionamiento",
          correct_answer: "A",
          explanation:
            "El aire comprimido puede llevar agua y aceite a los tanques. Drenarlos ayuda a prevenir contaminación, congelamiento y problemas del sistema.",
        },
        {
          question: "El control del freno de estacionamiento normalmente es una perilla:",
          option_a: "Azul y redonda",
          option_b: "Amarilla en forma de diamante",
          option_c: "Verde y cuadrada",
          option_d: "Roja accionada con el pie",
          correct_answer: "B",
          explanation:
            "En vehículos con frenos de aire, el control del freno de estacionamiento suele ser una perilla amarilla en forma de diamante.",
        },
      ],
    },
  },
  {
    slug: "combination-vehicles",
    en: {
      title: "CDL Combination Vehicles",
      shortTitle: "Combination Vehicles",
      primaryKeyword: "combination vehicles practice test",
      metaDescription:
        "Take a free CDL combination vehicles practice test covering coupling, rollover prevention, and trailer safety with explanations.",
      heading: "Free Combination Vehicles Practice Test",
      intro: [
        "The combination vehicles test is required for most Class A applicants. It covers tractor-trailer handling, coupling and uncoupling, air and electrical connections, trailer skid prevention, rollover risk, and combination-vehicle inspections.",
        "Answer these three questions to preview the MyCDLClass learning format. The full course provides additional exam-style practice designed to strengthen the concepts drivers use when operating tractor-trailers.",
      ],
      learn: [
        "Coupling and uncoupling procedures",
        "Trailer air lines, fifth wheels, and inspections",
        "Rollover, skid, and off-tracking prevention",
      ],
      faq: [
        {
          q: "Who takes the combination vehicles test?",
          a: "Applicants seeking a Class A CDL generally take this test because Class A vehicles commonly consist of a power unit towing one or more units.",
        },
        {
          q: "Why are combination vehicles more likely to roll over?",
          a: "They are longer, may have a high center of gravity, and can amplify steering movement through the combination, especially when entering curves too fast.",
        },
        {
          q: "Should the trailer hand valve be used for parking?",
          a: "No. It is used to test trailer brakes. Parking with it can allow air to leak away and release the brakes.",
        },
      ],
      questions: [
        {
          question: "After coupling, what should you see between the upper and lower fifth wheel?",
          option_a: "A small air gap",
          option_b: "No gap",
          option_c: "Visible landing gear grease",
          option_d: "The release arm fully extended",
          correct_answer: "B",
          explanation:
            "There should be no space between the trailer apron and the fifth-wheel plate. A gap can indicate an improper coupling.",
        },
        {
          question: "What is the trailer hand valve mainly used for?",
          option_a: "Parking the combination overnight",
          option_b: "Testing the trailer brakes",
          option_c: "Releasing the tractor parking brakes",
          option_d: "Controlling the landing gear",
          correct_answer: "B",
          explanation:
            "Use the trailer hand valve only to test trailer brakes. Do not use it for driving or parking because this can cause a skid or loss of braking.",
        },
        {
          question: "What is the best way to reduce rollover risk in a combination vehicle?",
          option_a: "Brake hard while in every curve",
          option_b: "Enter curves slowly and steer smoothly",
          option_c: "Keep the trailer lightly loaded at the rear",
          option_d: "Use the trailer hand valve in turns",
          correct_answer: "B",
          explanation:
            "Slow down before curves and use smooth steering. Excess speed and sudden movement increase rollover risk.",
        },
      ],
    },
    es: {
      title: "Vehículos Combinados CDL",
      shortTitle: "Vehículos Combinados",
      primaryKeyword: "examen de vehículos combinados CDL en español",
      metaDescription:
        "Haz gratis una práctica de vehículos combinados CDL en español sobre acoplamiento, vuelcos y seguridad del remolque.",
      heading: "Examen Gratis de Vehículos Combinados CDL",
      intro: [
        "El examen de vehículos combinados se requiere para la mayoría de los solicitantes de Clase A. Incluye manejo de tractor-remolque, acoplamiento, conexiones de aire y electricidad, prevención de derrapes, riesgo de vuelco e inspecciones.",
        "Responde estas tres preguntas para conocer el formato de MyCDLClass. El curso completo ofrece más práctica para reforzar los conceptos necesarios al operar vehículos combinados.",
      ],
      learn: [
        "Procedimientos de acoplamiento y desacoplamiento",
        "Líneas de aire, quinta rueda e inspecciones",
        "Prevención de vuelcos, derrapes y desvío de trayectoria",
      ],
      faq: [
        {
          q: "¿Quién toma el examen de vehículos combinados?",
          a: "Generalmente lo toman los solicitantes de una CDL Clase A porque estos vehículos suelen incluir una unidad motriz que remolca una o más unidades.",
        },
        {
          q: "¿Por qué pueden volcarse los vehículos combinados?",
          a: "Son largos, pueden tener un centro de gravedad alto y amplifican movimientos de dirección, especialmente al entrar demasiado rápido en una curva.",
        },
        {
          q: "¿Se debe usar la válvula manual del remolque para estacionar?",
          a: "No. Se utiliza para probar los frenos del remolque. El aire puede escapar y soltar los frenos si se usa para estacionar.",
        },
      ],
      questions: [
        {
          question: "Después del acoplamiento, ¿qué debe verse entre la quinta rueda superior e inferior?",
          option_a: "Un pequeño espacio de aire",
          option_b: "Ningún espacio",
          option_c: "Grasa visible del tren de aterrizaje",
          option_d: "El brazo de liberación extendido",
          correct_answer: "B",
          explanation:
            "No debe haber espacio entre la plataforma del remolque y la placa de la quinta rueda. Un espacio puede indicar acoplamiento incorrecto.",
        },
        {
          question: "¿Para qué se usa principalmente la válvula manual del remolque?",
          option_a: "Para estacionar durante la noche",
          option_b: "Para probar los frenos del remolque",
          option_c: "Para soltar los frenos del tractor",
          option_d: "Para controlar el tren de aterrizaje",
          correct_answer: "B",
          explanation:
            "Usa la válvula manual solamente para probar los frenos del remolque. No la uses al conducir ni para estacionar.",
        },
        {
          question: "¿Cuál es la mejor forma de reducir el riesgo de vuelco?",
          option_a: "Frenar fuerte dentro de cada curva",
          option_b: "Entrar lentamente en las curvas y girar suavemente",
          option_c: "Mantener poco peso en la parte trasera",
          option_d: "Usar la válvula manual al girar",
          correct_answer: "B",
          explanation:
            "Reduce la velocidad antes de las curvas y gira suavemente. La velocidad excesiva y los movimientos bruscos aumentan el riesgo de vuelco.",
        },
      ],
    },
  },
  {
    slug: "doubles-triples",
    en: {
      title: "CDL Doubles and Triples",
      shortTitle: "Doubles/Triples",
      primaryKeyword: "doubles and triples CDL practice test",
      metaDescription:
        "Practice free doubles and triples CDL questions about converter dollies, coupling, inspections, and crack-the-whip safety.",
      heading: "Free Doubles and Triples Practice Test",
      intro: [
        "The doubles and triples endorsement test covers safe operation of multiple-trailer combinations. Important topics include coupling order, converter dollies, air connections, inspecting every coupling device, managing space, and preventing rollover or rear-trailer instability.",
        "This free preview focuses on three practical safety concepts. Continue into the complete course for additional questions covering the systems and procedures used with multiple trailers.",
      ],
      learn: [
        "Converter dolly and coupling inspections",
        "Air-line connections and shutoff valves",
        "Crack-the-whip, rollover, and stopping distance",
      ],
      faq: [
        {
          q: "What does the doubles and triples endorsement allow?",
          a: "The endorsement permits a properly licensed driver to operate double- or triple-trailer combinations where state law allows those configurations.",
        },
        {
          q: "Which trailer is most affected by crack-the-whip?",
          a: "The last trailer is most likely to overturn because steering movement can become amplified toward the rear of the combination.",
        },
        {
          q: "Are triples legal in every state?",
          a: "No. Vehicle configurations and routes vary by jurisdiction, so drivers must check applicable state rules in addition to studying for the endorsement.",
        },
      ],
      questions: [
        {
          question: "In a double or triple combination, which trailer is most likely to roll over?",
          option_a: "The first trailer",
          option_b: "The last trailer",
          option_c: "All trailers always react equally",
          option_d: "Only an empty trailer",
          correct_answer: "B",
          explanation:
            "The crack-the-whip effect becomes stronger toward the rear, making the last trailer the most likely to overturn.",
        },
        {
          question: "A converter dolly coupling inspection should confirm that the pintle hook is:",
          option_a: "Open and lightly resting on the eye",
          option_b: "Latched, with safety chains secured",
          option_c: "Held in place only by air pressure",
          option_d: "Disconnected from the rear trailer",
          correct_answer: "B",
          explanation:
            "The pintle hook must be properly latched and the safety chains secured so the dolly cannot separate.",
        },
        {
          question: "How should a driver reduce the crack-the-whip effect?",
          option_a: "Make quick steering corrections",
          option_b: "Accelerate through curves",
          option_c: "Steer gently and slow before curves",
          option_d: "Brake only the rear trailer",
          correct_answer: "C",
          explanation:
            "Smooth steering and lower entry speed reduce amplified movement in the rear trailers.",
        },
      ],
    },
    es: {
      title: "Remolques Dobles y Triples CDL",
      shortTitle: "Dobles/Triples",
      primaryKeyword: "examen CDL remolques dobles y triples en español",
      metaDescription:
        "Practica gratis preguntas CDL de remolques dobles y triples sobre plataformas convertidoras, acoplamiento e inspección.",
      heading: "Examen Gratis de Remolques Dobles y Triples",
      intro: [
        "El examen de dobles y triples cubre la operación segura de combinaciones con varios remolques. Incluye orden de acoplamiento, plataformas convertidoras, conexiones de aire, inspección de dispositivos, manejo del espacio y prevención de vuelcos.",
        "Esta vista previa se concentra en tres conceptos prácticos de seguridad. Continúa con el curso completo para practicar más preguntas sobre los sistemas y procedimientos de varios remolques.",
      ],
      learn: [
        "Plataforma convertidora e inspección del acoplamiento",
        "Conexiones de aire y válvulas de cierre",
        "Efecto látigo, vuelcos y distancia de frenado",
      ],
      faq: [
        {
          q: "¿Qué permite el endoso de dobles y triples?",
          a: "Permite que un conductor debidamente licenciado opere combinaciones de dos o tres remolques donde la ley estatal autoriza esas configuraciones.",
        },
        {
          q: "¿Qué remolque recibe más el efecto látigo?",
          a: "El último remolque tiene mayor riesgo de volcar porque el movimiento de dirección se amplifica hacia la parte trasera.",
        },
        {
          q: "¿Los triples son legales en todos los estados?",
          a: "No. Las configuraciones y rutas varían según la jurisdicción, por lo que se deben verificar las reglas estatales aplicables.",
        },
      ],
      questions: [
        {
          question: "En una combinación doble o triple, ¿qué remolque tiene mayor probabilidad de volcar?",
          option_a: "El primer remolque",
          option_b: "El último remolque",
          option_c: "Todos reaccionan siempre igual",
          option_d: "Solamente un remolque vacío",
          correct_answer: "B",
          explanation:
            "El efecto látigo aumenta hacia la parte trasera, por lo que el último remolque tiene mayor riesgo de volcar.",
        },
        {
          question: "La inspección de una plataforma convertidora debe confirmar que el gancho de clavija está:",
          option_a: "Abierto y apoyado ligeramente",
          option_b: "Cerrado y con las cadenas de seguridad aseguradas",
          option_c: "Sujeto solamente por presión de aire",
          option_d: "Desconectado del remolque trasero",
          correct_answer: "B",
          explanation:
            "El gancho debe estar correctamente cerrado y las cadenas aseguradas para que la plataforma no se separe.",
        },
        {
          question: "¿Cómo puede reducirse el efecto látigo?",
          option_a: "Haciendo correcciones rápidas con el volante",
          option_b: "Acelerando en las curvas",
          option_c: "Girando suavemente y reduciendo la velocidad antes de las curvas",
          option_d: "Frenando solamente el último remolque",
          correct_answer: "C",
          explanation:
            "La dirección suave y una velocidad menor antes de la curva reducen el movimiento amplificado de los remolques traseros.",
        },
      ],
    },
  },
  {
    slug: "tanker",
    en: {
      title: "CDL Tanker Vehicles",
      shortTitle: "Tanker Vehicles",
      primaryKeyword: "tanker endorsement practice test",
      metaDescription:
        "Take a free CDL tanker endorsement practice test about liquid surge, outage, baffles, and safe tanker operation.",
      heading: "Free CDL Tanker Practice Test",
      intro: [
        "The tanker endorsement test addresses the special handling risks of transporting liquids or gases in tanks. Drivers study liquid surge, high centers of gravity, smooth braking and steering, outage, bulkheads, baffles, and careful inspection for leaks.",
        "Use this three-question preview to test the fundamentals. The complete Tanker Vehicles course expands the practice across tanker inspection, loading effects, and safe driving techniques.",
      ],
      learn: [
        "Liquid surge and high center of gravity",
        "Outage, baffles, and bulkheads",
        "Tanker inspection and smooth vehicle control",
      ],
      faq: [
        {
          q: "What is liquid surge?",
          a: "Liquid surge is movement of liquid inside a partially filled tank. It can push the vehicle forward, backward, or sideways and affect control.",
        },
        {
          q: "Why do tankers need outage?",
          a: "Liquids expand as temperature rises. Outage is the unfilled space that allows expansion without overflowing the tank.",
        },
        {
          q: "Are baffled tanks protected from every type of surge?",
          a: "No. Baffles mainly reduce forward-and-back movement. Side-to-side surge can still occur and must be controlled with smooth driving.",
        },
      ],
      questions: [
        {
          question: "What is liquid surge in a tanker?",
          option_a: "Movement of the liquid inside the tank",
          option_b: "A sudden increase in tire pressure",
          option_c: "Fuel entering the engine",
          option_d: "Air escaping from the brake tanks",
          correct_answer: "A",
          explanation:
            "Liquid surge is the movement of cargo inside the tank. It can push the vehicle and make steering or stopping more difficult.",
        },
        {
          question: "Why is outage left in a liquid tank?",
          option_a: "To reduce the vehicle registration weight",
          option_b: "To allow the liquid to expand",
          option_c: "To make the tank easier to clean",
          option_d: "To eliminate all surge",
          correct_answer: "B",
          explanation:
            "Liquids expand as they warm. Outage is the space left so the cargo can expand without overflowing.",
        },
        {
          question: "Baffles in a tank mainly help control:",
          option_a: "Forward-and-back liquid surge",
          option_b: "Tire wear",
          option_c: "Engine temperature",
          option_d: "Air-brake pressure",
          correct_answer: "A",
          explanation:
            "Baffles have openings that slow forward-and-back liquid movement. They do not eliminate side-to-side surge.",
        },
      ],
    },
    es: {
      title: "Vehículos Cisterna CDL",
      shortTitle: "Vehículos Cisterna",
      primaryKeyword: "examen de vehículos cisterna CDL en español",
      metaDescription:
        "Haz gratis un examen de vehículos cisterna CDL en español sobre oleaje, espacio de expansión, deflectores y seguridad.",
      heading: "Examen Gratis de Vehículos Cisterna CDL",
      intro: [
        "El examen de vehículos cisterna trata los riesgos especiales de transportar líquidos o gases. Incluye el oleaje del líquido, centro de gravedad alto, frenado y dirección suaves, espacio de expansión, mamparos, deflectores e inspección de fugas.",
        "Usa esta práctica de tres preguntas para comprobar los fundamentos. El curso completo amplía la preparación sobre inspección, efectos de la carga y técnicas de conducción segura.",
      ],
      learn: [
        "Oleaje del líquido y centro de gravedad alto",
        "Espacio de expansión, deflectores y mamparos",
        "Inspección de cisternas y control suave",
      ],
      faq: [
        {
          q: "¿Qué es el oleaje del líquido?",
          a: "Es el movimiento del líquido dentro de un tanque parcialmente lleno. Puede empujar el vehículo hacia adelante, atrás o los lados y afectar el control.",
        },
        {
          q: "¿Por qué necesita espacio de expansión una cisterna?",
          a: "Los líquidos se expanden al aumentar la temperatura. El espacio sin llenar permite esa expansión sin que el tanque se desborde.",
        },
        {
          q: "¿Los deflectores eliminan todo tipo de oleaje?",
          a: "No. Principalmente reducen el movimiento hacia adelante y atrás. El movimiento lateral todavía puede ocurrir.",
        },
      ],
      questions: [
        {
          question: "¿Qué es el oleaje del líquido en una cisterna?",
          option_a: "El movimiento del líquido dentro del tanque",
          option_b: "Un aumento repentino en la presión de las llantas",
          option_c: "Combustible que entra al motor",
          option_d: "Aire que sale de los tanques de freno",
          correct_answer: "A",
          explanation:
            "El oleaje es el movimiento de la carga líquida dentro del tanque. Puede empujar el vehículo y dificultar la dirección o el frenado.",
        },
        {
          question: "¿Por qué se deja espacio sin llenar en un tanque de líquido?",
          option_a: "Para reducir el peso de registro",
          option_b: "Para permitir que el líquido se expanda",
          option_c: "Para facilitar la limpieza",
          option_d: "Para eliminar todo el oleaje",
          correct_answer: "B",
          explanation:
            "Los líquidos se expanden al calentarse. El espacio permite la expansión sin que la carga se desborde.",
        },
        {
          question: "Los deflectores dentro del tanque ayudan principalmente a controlar:",
          option_a: "El oleaje hacia adelante y atrás",
          option_b: "El desgaste de las llantas",
          option_c: "La temperatura del motor",
          option_d: "La presión de los frenos de aire",
          correct_answer: "A",
          explanation:
            "Los deflectores reducen el movimiento del líquido hacia adelante y atrás, pero no eliminan el oleaje lateral.",
        },
      ],
    },
  },
  {
    slug: "hazmat",
    en: {
      title: "CDL HazMat",
      shortTitle: "HazMat",
      primaryKeyword: "HazMat practice test",
      metaDescription:
        "Try a free CDL HazMat practice test about placards, shipping papers, and emergency safety, with instant answer explanations.",
      heading: "Free CDL HazMat Practice Test",
      intro: [
        "The hazardous materials endorsement test covers hazard communication, placards, labels, shipping papers, loading rules, segregation, parking, route restrictions, and emergency response. Applicants also face separate federal eligibility and security requirements.",
        "This preview tests three foundational safety concepts. Use the complete HazMat course for additional exam-style practice, and always verify current federal and state requirements before applying.",
      ],
      learn: [
        "Placards, labels, markings, and shipping papers",
        "Loading, segregation, parking, and routing",
        "Leaks, crashes, fires, and emergency response",
      ],
      faq: [
        {
          q: "Is a background check required for a HazMat endorsement?",
          a: "Federal security-threat assessment requirements generally apply. Check current TSA and state licensing instructions for eligibility, fingerprints, fees, and timing.",
        },
        {
          q: "Where must HazMat shipping papers be kept while driving?",
          a: "They must be clearly distinguished and within reach while the driver is belted, or in the driver's-door pouch when the driver is outside the vehicle.",
        },
        {
          q: "Does this course contain actual government test questions?",
          a: "No. It contains independent exam-style practice based on the subject areas drivers are expected to understand.",
        },
      ],
      questions: [
        {
          question: "What is the main purpose of hazardous materials placards?",
          option_a: "To advertise the carrier",
          option_b: "To identify the material's hazard class",
          option_c: "To show the driver's license class",
          option_d: "To display the vehicle's empty weight",
          correct_answer: "B",
          explanation:
            "Placards communicate a shipment's hazard class so drivers, inspectors, and emergency responders can recognize the risk.",
        },
        {
          question: "While driving, hazardous materials shipping papers should be:",
          option_a: "Locked in the trailer",
          option_b: "Within reach while you are wearing the seat belt",
          option_c: "Stored under the sleeper mattress",
          option_d: "Given to the receiver before departure",
          correct_answer: "B",
          explanation:
            "Shipping papers must be readily available and clearly identifiable. While driving, keep them within reach with the seat belt fastened.",
        },
        {
          question: "If hazardous material is leaking after a crash, your first priorities include:",
          option_a: "Touching the material to identify it",
          option_b: "Keeping people away and notifying emergency authorities",
          option_c: "Driving through a populated area",
          option_d: "Washing the material into a drain",
          correct_answer: "B",
          explanation:
            "Protect people from exposure, secure the area from a safe location, and contact appropriate emergency authorities. Do not handle an unknown material.",
        },
      ],
    },
    es: {
      title: "Materiales Peligrosos CDL",
      shortTitle: "Materiales Peligrosos",
      primaryKeyword: "examen HazMat CDL en español",
      metaDescription:
        "Practica gratis para el examen HazMat CDL en español sobre carteles, documentos de envío y seguridad de emergencias.",
      heading: "Examen Gratis de Materiales Peligrosos CDL",
      intro: [
        "El examen de materiales peligrosos incluye comunicación de riesgos, carteles, etiquetas, documentos de envío, carga, separación, estacionamiento, restricciones de ruta y respuesta a emergencias. También existen requisitos federales de elegibilidad y seguridad.",
        "Esta práctica revisa tres conceptos fundamentales. Utiliza el curso completo para más preguntas y verifica siempre los requisitos federales y estatales vigentes antes de solicitar el endoso.",
      ],
      learn: [
        "Carteles, etiquetas, marcas y documentos de envío",
        "Carga, separación, estacionamiento y rutas",
        "Fugas, choques, incendios y emergencias",
      ],
      faq: [
        {
          q: "¿Se necesita una verificación de antecedentes para HazMat?",
          a: "Generalmente se requiere una evaluación federal de amenazas. Consulta las instrucciones vigentes de TSA y de tu estado sobre elegibilidad, huellas, costos y plazos.",
        },
        {
          q: "¿Dónde deben estar los documentos HazMat al conducir?",
          a: "Deben distinguirse claramente y estar al alcance con el cinturón puesto, o en la bolsa de la puerta del conductor cuando esté fuera del vehículo.",
        },
        {
          q: "¿El curso contiene preguntas oficiales del gobierno?",
          a: "No. Contiene práctica independiente al estilo del examen basada en las materias que el conductor debe comprender.",
        },
      ],
      questions: [
        {
          question: "¿Cuál es el propósito principal de los carteles de materiales peligrosos?",
          option_a: "Anunciar la compañía transportista",
          option_b: "Identificar la clase de peligro del material",
          option_c: "Mostrar la clase de licencia del conductor",
          option_d: "Indicar el peso vacío del vehículo",
          correct_answer: "B",
          explanation:
            "Los carteles comunican la clase de peligro para que conductores, inspectores y personal de emergencia reconozcan el riesgo.",
        },
        {
          question: "Mientras conduces, los documentos de envío de materiales peligrosos deben estar:",
          option_a: "Bajo llave en el remolque",
          option_b: "Al alcance mientras llevas puesto el cinturón",
          option_c: "Debajo del colchón de la cabina dormitorio",
          option_d: "Con el destinatario antes de salir",
          correct_answer: "B",
          explanation:
            "Los documentos deben estar disponibles y claramente identificados. Al conducir, mantenlos al alcance con el cinturón abrochado.",
        },
        {
          question: "Si un material peligroso tiene una fuga después de un choque, las prioridades incluyen:",
          option_a: "Tocar el material para identificarlo",
          option_b: "Alejar a las personas y avisar a las autoridades de emergencia",
          option_c: "Conducir por una zona poblada",
          option_d: "Lavar el material hacia un desagüe",
          correct_answer: "B",
          explanation:
            "Protege a las personas, asegura el área desde un lugar seguro y avisa a las autoridades. No manipules un material desconocido.",
        },
      ],
    },
  },
  {
    slug: "passenger",
    en: {
      title: "CDL Passenger Vehicles",
      shortTitle: "Passenger Vehicles",
      primaryKeyword: "passenger endorsement practice test",
      metaDescription:
        "Take a free CDL passenger endorsement practice test about loading, standee lines, baggage, and post-trip safety.",
      heading: "Free CDL Passenger Practice Test",
      intro: [
        "The passenger endorsement test focuses on safely transporting people in buses and other qualifying commercial vehicles. Topics include vehicle inspection, boarding and unloading, baggage, standees, railroad crossings, prohibited practices, emergency exits, and post-trip checks.",
        "Answer this short preview for immediate feedback. The complete Passenger Vehicles course adds more practice across the inspection and operating rules passenger drivers need to understand.",
      ],
      learn: [
        "Passenger loading, unloading, and supervision",
        "Baggage, aisles, doors, and emergency exits",
        "Inspections, railroad crossings, and post-trip checks",
      ],
      faq: [
        {
          q: "Who needs a passenger endorsement?",
          a: "Drivers operating a vehicle designed to transport the number of passengers specified by federal and state rules generally need the passenger endorsement and applicable testing.",
        },
        {
          q: "What is the standee line?",
          a: "It marks the forward limit behind which standing passengers must remain so they do not obstruct the driver's view or controls.",
        },
        {
          q: "Why is a post-trip inspection important?",
          a: "The driver checks for passengers or belongings left behind and reports damage, defects, or safety concerns found after the trip.",
        },
      ],
      questions: [
        {
          question: "What does the standee line show?",
          option_a: "Where baggage must be stacked",
          option_b: "How close standing passengers may be to the driver",
          option_c: "Where the rear axle is located",
          option_d: "Where the bus must stop at a railroad crossing",
          correct_answer: "B",
          explanation:
            "Standing passengers must remain behind the standee line so the driver's view and movement are not obstructed.",
        },
        {
          question: "Baggage on a passenger vehicle must be secured so that it does not:",
          option_a: "Block an aisle or emergency exit",
          option_b: "Touch an outside wall",
          option_c: "Weigh less than a passenger",
          option_d: "Carry an identification tag",
          correct_answer: "A",
          explanation:
            "Aisles, doorways, and emergency exits must remain clear so passengers can move and evacuate safely.",
        },
        {
          question: "A post-trip inspection should include checking for:",
          option_a: "Passengers or belongings left behind",
          option_b: "Only the fuel level",
          option_c: "Only exterior cleanliness",
          option_d: "Future ticket reservations",
          correct_answer: "A",
          explanation:
            "After the trip, inspect the bus for passengers, belongings, damage, and safety issues that need to be reported.",
        },
      ],
    },
    es: {
      title: "Vehículos de Pasajeros CDL",
      shortTitle: "Vehículos de Pasajeros",
      primaryKeyword: "examen de pasajeros CDL en español",
      metaDescription:
        "Haz gratis una práctica del endoso de pasajeros CDL en español sobre carga, línea de pasajeros, equipaje y seguridad.",
      heading: "Examen Gratis de Vehículos de Pasajeros CDL",
      intro: [
        "El examen del endoso de pasajeros se concentra en transportar personas de forma segura. Incluye inspección, abordaje y descenso, equipaje, pasajeros de pie, cruces ferroviarios, salidas de emergencia y revisiones después del viaje.",
        "Responde esta práctica breve y recibe comentarios inmediatos. El curso completo añade más preparación sobre las reglas de inspección y operación que debe comprender un conductor de pasajeros.",
      ],
      learn: [
        "Abordaje, descenso y supervisión de pasajeros",
        "Equipaje, pasillos, puertas y salidas de emergencia",
        "Inspecciones, cruces ferroviarios y revisión final",
      ],
      faq: [
        {
          q: "¿Quién necesita el endoso de pasajeros?",
          a: "Generalmente lo necesitan quienes operan un vehículo diseñado para transportar la cantidad de pasajeros indicada por las reglas federales y estatales.",
        },
        {
          q: "¿Qué es la línea de pasajeros de pie?",
          a: "Marca el límite detrás del cual deben permanecer los pasajeros de pie para no obstruir la vista ni los controles del conductor.",
        },
        {
          q: "¿Por qué es importante la inspección después del viaje?",
          a: "Permite revisar si quedaron pasajeros u objetos y reportar daños, defectos o problemas de seguridad.",
        },
      ],
      questions: [
        {
          question: "¿Qué indica la línea para pasajeros de pie?",
          option_a: "Dónde debe apilarse el equipaje",
          option_b: "Qué tan cerca del conductor pueden estar los pasajeros de pie",
          option_c: "Dónde está el eje trasero",
          option_d: "Dónde detenerse en un cruce ferroviario",
          correct_answer: "B",
          explanation:
            "Los pasajeros de pie deben permanecer detrás de la línea para no obstruir la vista ni el movimiento del conductor.",
        },
        {
          question: "El equipaje debe asegurarse para que no:",
          option_a: "Bloquee un pasillo o una salida de emergencia",
          option_b: "Toque una pared exterior",
          option_c: "Pese menos que un pasajero",
          option_d: "Lleve una etiqueta de identificación",
          correct_answer: "A",
          explanation:
            "Los pasillos, puertas y salidas de emergencia deben permanecer libres para que los pasajeros puedan moverse o evacuar.",
        },
        {
          question: "La inspección después del viaje debe incluir la búsqueda de:",
          option_a: "Pasajeros u objetos olvidados",
          option_b: "Solamente el nivel de combustible",
          option_c: "Solamente la limpieza exterior",
          option_d: "Reservaciones futuras",
          correct_answer: "A",
          explanation:
            "Después del viaje, revisa si quedaron pasajeros u objetos y busca daños o problemas de seguridad que deban reportarse.",
        },
      ],
    },
  },
  {
    slug: "school-bus",
    en: {
      title: "CDL School Bus",
      shortTitle: "School Bus",
      primaryKeyword: "school bus endorsement practice test",
      metaDescription:
        "Try a free CDL school bus endorsement practice test covering the danger zone, loading, unloading, and railroad crossings.",
      heading: "Free CDL School Bus Practice Test",
      intro: [
        "The school bus endorsement test emphasizes protecting students during loading, unloading, driving, emergency procedures, and railroad crossings. Drivers must understand the danger zone around the bus, mirror use, student supervision, warning-light systems, and post-trip checks.",
        "This free practice preview covers three essential concepts. The complete School Bus course adds more exam-style questions for drivers preparing for the required knowledge testing.",
      ],
      learn: [
        "Danger zones, mirrors, and student visibility",
        "Loading, unloading, warning lights, and stop arms",
        "Railroad crossings and emergency procedures",
      ],
      faq: [
        {
          q: "Is the passenger endorsement also required for a school bus?",
          a: "School bus drivers generally need both the school bus and passenger endorsements, along with any state-specific qualifications and checks.",
        },
        {
          q: "What is the school bus danger zone?",
          a: "It is the area around the bus where children may be difficult for the driver to see, especially close to the front, sides, and rear.",
        },
        {
          q: "Do school bus rules vary by state?",
          a: "Yes. Study the federal CDL concepts and the current school bus rules, handbook, and procedures required by your state and employer.",
        },
      ],
      questions: [
        {
          question: "The school bus danger zone is the area where students are:",
          option_a: "Safest because the driver can always see them",
          option_b: "At greatest risk of being struck because visibility is limited",
          option_c: "Required to wait for another bus",
          option_d: "Allowed to retrieve dropped objects without permission",
          correct_answer: "B",
          explanation:
            "Areas close to the bus can be difficult to see. The driver must account for every student before moving.",
        },
        {
          question: "If a student drops an object near the bus, the student should:",
          option_a: "Retrieve it immediately",
          option_b: "Tell the driver and follow the driver's directions",
          option_c: "Crawl under the bus",
          option_d: "Signal the bus to move forward",
          correct_answer: "B",
          explanation:
            "A student should never approach or go under the bus for an object without the driver's knowledge and direction.",
        },
        {
          question: "At a railroad crossing, a school bus driver should generally stop:",
          option_a: "On the nearest rail",
          option_b: "15 to 50 feet before the nearest rail",
          option_c: "Only when passengers request it",
          option_d: "At least 200 feet away",
          correct_answer: "B",
          explanation:
            "School buses generally stop 15 to 50 feet before the nearest rail, then look and listen according to required procedures and local rules.",
        },
      ],
    },
    es: {
      title: "Autobús Escolar CDL",
      shortTitle: "Autobús Escolar",
      primaryKeyword: "examen de autobús escolar CDL en español",
      metaDescription:
        "Practica gratis para el endoso de autobús escolar CDL en español sobre zona de peligro, estudiantes y cruces ferroviarios.",
      heading: "Examen Gratis de Autobús Escolar CDL",
      intro: [
        "El examen de autobús escolar se concentra en proteger a los estudiantes durante el abordaje, descenso, conducción, emergencias y cruces ferroviarios. Incluye zona de peligro, espejos, supervisión, luces de advertencia y revisión final.",
        "Esta práctica gratis cubre tres conceptos esenciales. El curso completo añade más preguntas para quienes se preparan para los exámenes requeridos.",
      ],
      learn: [
        "Zonas de peligro, espejos y visibilidad de estudiantes",
        "Abordaje, descenso, luces de advertencia y brazo de parada",
        "Cruces ferroviarios y procedimientos de emergencia",
      ],
      faq: [
        {
          q: "¿También se necesita el endoso de pasajeros?",
          a: "Generalmente, los conductores de autobús escolar necesitan los endosos de autobús escolar y pasajeros, además de los requisitos específicos del estado.",
        },
        {
          q: "¿Qué es la zona de peligro del autobús?",
          a: "Es el área alrededor del autobús donde puede ser difícil ver a los niños, especialmente cerca del frente, los lados y la parte trasera.",
        },
        {
          q: "¿Las reglas varían por estado?",
          a: "Sí. Estudia los conceptos federales y las reglas, manuales y procedimientos vigentes de tu estado y empleador.",
        },
      ],
      questions: [
        {
          question: "La zona de peligro del autobús escolar es el área donde los estudiantes:",
          option_a: "Están más seguros porque siempre son visibles",
          option_b: "Tienen mayor riesgo porque la visibilidad es limitada",
          option_c: "Deben esperar otro autobús",
          option_d: "Pueden recoger objetos sin permiso",
          correct_answer: "B",
          explanation:
            "Las áreas cercanas al autobús pueden ser difíciles de ver. El conductor debe localizar a cada estudiante antes de moverse.",
        },
        {
          question: "Si un estudiante deja caer un objeto cerca del autobús, debe:",
          option_a: "Recogerlo inmediatamente",
          option_b: "Avisar al conductor y seguir sus instrucciones",
          option_c: "Gatear debajo del autobús",
          option_d: "Indicar al autobús que avance",
          correct_answer: "B",
          explanation:
            "El estudiante nunca debe acercarse ni pasar debajo del autobús sin que el conductor lo sepa y le dé instrucciones.",
        },
        {
          question: "En un cruce ferroviario, el conductor normalmente debe detener el autobús:",
          option_a: "Sobre el riel más cercano",
          option_b: "Entre 15 y 50 pies antes del riel más cercano",
          option_c: "Solo si lo pide un pasajero",
          option_d: "A por lo menos 200 pies",
          correct_answer: "B",
          explanation:
            "El autobús escolar normalmente se detiene entre 15 y 50 pies antes del riel y luego el conductor mira y escucha según el procedimiento requerido.",
        },
      ],
    },
  },
  {
    slug: "pre-trip-inspection",
    en: {
      title: "CDL Pre-Trip Inspection",
      shortTitle: "Pre-Trip Inspection",
      primaryKeyword: "CDL pre trip inspection practice test",
      metaDescription:
        "Take a free CDL pre-trip inspection practice test covering tires, brakes, leaks, and safety checks with answer explanations.",
      heading: "Free CDL Pre-Trip Inspection Practice Test",
      intro: [
        "A thorough pre-trip inspection helps a driver find defects before they cause a breakdown, violation, or crash. CDL applicants should understand the engine compartment, steering, suspension, brakes, tires, lights, coupling system, cargo area, emergency equipment, and in-cab checks.",
        "Use this short quiz to review three inspection fundamentals. The complete Pre-Trip Inspection course provides broader practice for recognizing components, describing their condition, and explaining safety checks.",
      ],
      learn: [
        "Engine compartment, fluids, belts, and hoses",
        "Steering, suspension, brakes, wheels, and tires",
        "Lights, coupling, cab checks, and emergency equipment",
      ],
      faq: [
        {
          q: "When should a pre-trip inspection be performed?",
          a: "A driver inspects before operating so defects can be identified and corrected. Required reports and procedures may also apply during and after a trip.",
        },
        {
          q: "What tire tread depth should CDL applicants remember?",
          a: "Federal inspection standards commonly require at least 4/32 inch on front steering-axle tires and 2/32 inch on other tires.",
        },
        {
          q: "Is the inspection test identical in every state?",
          a: "The core vehicle-safety concepts are similar, but testing procedures can vary. Follow the current instructions and manual for your testing state.",
        },
      ],
      questions: [
        {
          question: "When is the main pre-trip inspection performed?",
          option_a: "Before driving the vehicle",
          option_b: "Only after a collision",
          option_c: "Only when a warning light appears",
          option_d: "After the cargo is delivered",
          correct_answer: "A",
          explanation:
            "Inspect before driving so unsafe conditions can be found and corrected before the vehicle enters service.",
        },
        {
          question: "The minimum tread depth commonly required on front steering-axle tires is:",
          option_a: "1/32 inch",
          option_b: "2/32 inch",
          option_c: "4/32 inch",
          option_d: "8/32 inch",
          correct_answer: "C",
          explanation:
            "Front steering-axle tires commonly require at least 4/32 inch of tread depth in every major groove.",
        },
        {
          question: "During a brake inspection, linings and drums should be:",
          option_a: "Covered with oil to reduce noise",
          option_b: "Free of oil, grease, cracks, and unsafe wear",
          option_c: "Checked only after driving",
          option_d: "Loose enough to move by hand",
          correct_answer: "B",
          explanation:
            "Brake components must be secure and free from contamination, cracks, damage, or excessive wear that can reduce braking performance.",
        },
      ],
    },
    es: {
      title: "Inspección Previa al Viaje CDL",
      shortTitle: "Inspección Previa al Viaje",
      primaryKeyword: "inspección previa al viaje CDL en español",
      metaDescription:
        "Haz gratis una práctica de inspección previa al viaje CDL en español sobre llantas, frenos, fugas y seguridad.",
      heading: "Examen Gratis de Inspección Previa al Viaje CDL",
      intro: [
        "Una inspección completa ayuda a encontrar defectos antes de que causen una avería, infracción o choque. El solicitante CDL debe comprender el compartimiento del motor, dirección, suspensión, frenos, llantas, luces, acoplamiento, carga, equipo de emergencia y revisión de cabina.",
        "Usa esta práctica breve para repasar tres fundamentos. El curso completo ofrece más preparación para reconocer componentes, describir su condición y explicar las revisiones de seguridad.",
      ],
      learn: [
        "Motor, líquidos, correas y mangueras",
        "Dirección, suspensión, frenos, ruedas y llantas",
        "Luces, acoplamiento, cabina y equipo de emergencia",
      ],
      faq: [
        {
          q: "¿Cuándo se realiza la inspección previa?",
          a: "Se inspecciona antes de operar para identificar y corregir defectos. También pueden existir informes y procedimientos durante y después del viaje.",
        },
        {
          q: "¿Qué profundidad de dibujo deben tener las llantas?",
          a: "Las normas federales comúnmente exigen al menos 4/32 de pulgada en las llantas del eje delantero de dirección y 2/32 en las demás.",
        },
        {
          q: "¿La prueba es idéntica en todos los estados?",
          a: "Los conceptos básicos son similares, pero los procedimientos pueden variar. Sigue las instrucciones y el manual vigente de tu estado.",
        },
      ],
      questions: [
        {
          question: "¿Cuándo se realiza la inspección principal previa al viaje?",
          option_a: "Antes de conducir el vehículo",
          option_b: "Solamente después de un choque",
          option_c: "Solo cuando aparece una luz de advertencia",
          option_d: "Después de entregar la carga",
          correct_answer: "A",
          explanation:
            "Inspecciona antes de conducir para encontrar y corregir condiciones inseguras antes de poner el vehículo en servicio.",
        },
        {
          question: "La profundidad mínima comúnmente requerida en las llantas delanteras de dirección es:",
          option_a: "1/32 de pulgada",
          option_b: "2/32 de pulgada",
          option_c: "4/32 de pulgada",
          option_d: "8/32 de pulgada",
          correct_answer: "C",
          explanation:
            "Las llantas del eje delantero de dirección comúnmente necesitan al menos 4/32 de pulgada en cada ranura principal.",
        },
        {
          question: "Al inspeccionar los frenos, los forros y tambores deben estar:",
          option_a: "Cubiertos de aceite para reducir ruido",
          option_b: "Sin aceite, grasa, grietas ni desgaste peligroso",
          option_c: "Revisados solamente después de conducir",
          option_d: "Lo bastante sueltos para moverlos con la mano",
          correct_answer: "B",
          explanation:
            "Los componentes deben estar seguros y sin contaminación, grietas, daños ni desgaste excesivo que reduzca el frenado.",
        },
      ],
    },
  },
];

// Passenger and school-bus courses are intentionally separate because they
// target different endorsements and search intent.

export const COURSE_SLUGS = courses.map((course) => course.slug);

export function getCourse(slug, lang = "en") {
  const course = courses.find((item) => item.slug === slug);
  if (!course || !["en", "es"].includes(lang)) return null;
  return {
    slug: course.slug,
    lang,
    ...shared[lang],
    ...course[lang],
  };
}

export function getAllCourses(lang = "en") {
  return courses.map((course) => getCourse(course.slug, lang));
}

export function getCourseUrl(slug, lang = "en") {
  return lang === "es"
    ? `${SITE_URL}/es/cursos/${slug}`
    : `${SITE_URL}/courses/${slug}`;
}

export function getCatalogUrl(lang = "en") {
  return lang === "es" ? `${SITE_URL}/es/cursos` : `${SITE_URL}/courses`;
}
