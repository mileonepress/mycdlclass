-- ============================================================================
-- FULL COURSE CONTENT SEED: General Knowledge
-- Bilingual (EN/ES) study lessons + 20 practice questions with explanations.
-- Idempotent: clears this course's lessons/questions, then reinserts.
-- Safe to re-run. Targets the SAME lessons/questions tables the UI already reads.
-- ============================================================================

do $$
declare
  v_course_id uuid;
begin
  select id into v_course_id from public.courses where slug = 'general-knowledge';
  if v_course_id is null then
    raise notice 'Course general-knowledge not found, skipping.';
    return;
  end if;

  -- Clean refresh for this course only
  delete from public.questions where course_id = v_course_id;
  delete from public.lessons where course_id = v_course_id;

  -- ---------------------------------------------------------------- LESSONS
  insert into public.lessons (course_id, slug, title, spanish_title, content, spanish_content, sort_order, is_published) values
  (v_course_id, 'introduction', 'Introduction to CDL',
   'Introducción al CDL',
   'Welcome to the CDL General Knowledge course. Every driver who operates a commercial motor vehicle (CMV) must pass the General Knowledge test. This section covers the core rules of the road, vehicle control, and safe operating practices that apply to all commercial drivers.

A CMV is generally any vehicle with a gross combination weight rating of 26,001 pounds or more, any vehicle designed to carry 16 or more passengers, or any vehicle hauling hazardous materials requiring placards. Holding a CDL is a responsibility: commercial drivers are held to a higher standard than regular drivers, both on and off the job.

In this course you will learn about pre-trip inspections, basic vehicle control, shifting, seeing hazards, communicating with other road users, controlling speed and space, and what to do in emergencies. Take your time, read each lesson, then test yourself with the practice questions.',
   'Bienvenido al curso de Conocimientos Generales del CDL. Todo conductor que opera un vehículo motorizado comercial (CMV) debe aprobar el examen de Conocimientos Generales. Esta sección cubre las reglas básicas del camino, el control del vehículo y las prácticas de operación segura que aplican a todos los conductores comerciales.

Un CMV es generalmente cualquier vehículo con un peso bruto combinado de 26,001 libras o más, cualquier vehículo diseñado para transportar 16 o más pasajeros, o cualquier vehículo que transporte materiales peligrosos que requieran carteles. Tener un CDL es una responsabilidad: los conductores comerciales se mantienen a un estándar más alto que los conductores regulares, dentro y fuera del trabajo.

En este curso aprenderá sobre inspecciones previas al viaje, control básico del vehículo, cambios de marcha, ver peligros, comunicarse con otros usuarios del camino, controlar la velocidad y el espacio, y qué hacer en emergencias. Tómese su tiempo, lea cada lección y luego evalúese con las preguntas de práctica.',
   1, true),

  (v_course_id, 'controlling-your-vehicle', 'Controlling Your Vehicle',
   'Controlando Su Vehículo',
   'Smooth, safe vehicle control starts with the basics: accelerating, steering, stopping, and backing.

ACCELERATING: Speed up smoothly and gradually so the vehicle does not jerk. Rough acceleration can damage the drivetrain and, with a trailer, cause a jackknife on slippery surfaces. When pulling a heavy load, you may need to use a lower gear to avoid lugging the engine.

STEERING: Hold the wheel firmly with both hands, placed on opposite sides. If you hit a curb or pothole, a loose grip can rip the wheel from your hands.

STOPPING: Push the brake pedal down steadily. Brake so your vehicle stops smoothly. With a manual transmission, do not push the clutch in until the engine rpm is down to idle.

BACKING SAFELY: Backing is always dangerous because you cannot see everything behind you. Whenever possible, avoid backing. When you must back, use a helper, back slowly, back toward the driver''s side, and use your mirrors on both sides.',
   'El control seguro y suave del vehículo comienza con lo básico: acelerar, dirigir, frenar y retroceder.

ACELERAR: Acelere de manera suave y gradual para que el vehículo no dé tirones. La aceleración brusca puede dañar la transmisión y, con un remolque, causar un acordeón en superficies resbaladizas. Al transportar una carga pesada, puede necesitar una marcha más baja para evitar forzar el motor.

DIRIGIR: Sujete el volante firmemente con ambas manos, en lados opuestos. Si golpea un bordillo o bache, un agarre flojo puede arrancar el volante de sus manos.

FRENAR: Presione el pedal del freno de manera constante. Frene para que su vehículo se detenga suavemente. Con transmisión manual, no presione el embrague hasta que las rpm del motor bajen a ralentí.

RETROCEDER CON SEGURIDAD: Retroceder siempre es peligroso porque no puede ver todo detrás de usted. Siempre que sea posible, evite retroceder. Cuando deba hacerlo, use un ayudante, retroceda lentamente, hacia el lado del conductor, y use sus espejos en ambos lados.',
   2, true),

  (v_course_id, 'seeing-and-communicating', 'Seeing Hazards and Communicating',
   'Ver Peligros y Comunicarse',
   'SEEING AHEAD: Good drivers look 12 to 15 seconds ahead. At lower speeds that is about one block; at highway speeds it is about a quarter mile. Looking far ahead lets you see hazards early and respond smoothly instead of reacting at the last moment.

USING MIRRORS: Check your mirrors regularly to know where other vehicles are. Large vehicles have big blind spots, so check mirrors before changing lanes, turning, or merging. Remember that convex (curved) mirrors make objects look smaller and farther away than they are.

COMMUNICATING: Let others know you are there and what you intend to do. Signal early before turning or changing lanes. Tap the brakes lightly to warn drivers behind you. Use your horn only when needed to avoid a crash. At night or in bad weather, turn on your headlights so others can see you.

A hazard is any road condition or road user that is a possible danger. Learning to spot hazards early — and to make yourself visible and predictable — is one of the most important defensive driving skills.',
   'VER ADELANTE: Los buenos conductores miran de 12 a 15 segundos adelante. A baja velocidad eso es aproximadamente una cuadra; a velocidad de autopista es aproximadamente un cuarto de milla. Mirar lejos le permite ver peligros temprano y responder suavemente en lugar de reaccionar a último momento.

USAR ESPEJOS: Revise sus espejos regularmente para saber dónde están otros vehículos. Los vehículos grandes tienen grandes puntos ciegos, así que revise los espejos antes de cambiar de carril, girar o incorporarse. Recuerde que los espejos convexos (curvos) hacen que los objetos se vean más pequeños y lejanos de lo que son.

COMUNICARSE: Haga saber a los demás que está ahí y qué piensa hacer. Señale temprano antes de girar o cambiar de carril. Toque los frenos ligeramente para advertir a los conductores detrás de usted. Use la bocina solo cuando sea necesario para evitar un choque. De noche o con mal tiempo, encienda los faros para que otros lo vean.

Un peligro es cualquier condición del camino o usuario que sea un posible riesgo. Aprender a detectar peligros temprano — y a hacerse visible y predecible — es una de las habilidades de manejo defensivo más importantes.',
   3, true),

  (v_course_id, 'speed-space-emergencies', 'Speed, Space and Emergencies',
   'Velocidad, Espacio y Emergencias',
   'CONTROLLING SPEED: Driving too fast is a major cause of fatal crashes. You must adjust speed for the road, weather, visibility, traffic, and the weight of your load. A loaded vehicle needs more distance to stop. Total stopping distance = perception distance + reaction distance + braking distance. At 55 mph on dry pavement, a heavy vehicle may need about 6 seconds and roughly the length of a football field to stop.

MANAGING SPACE: You need space all around your vehicle. Keep a following distance of at least one second for every 10 feet of vehicle length under 40 mph, and add one second above 40 mph. A 60-foot vehicle therefore needs about 7 seconds of following distance at highway speed.

EMERGENCIES: If a tire blows out, hold the steering wheel firmly, stay off the brake, and let the vehicle slow before pulling off the road. If your brakes fail, downshift, pump the brakes, use the parking brake gradually, and look for an escape ramp. In an emergency it is often safer to steer around an obstacle than to brake hard, because you can change direction faster than you can stop.',
   'CONTROLAR LA VELOCIDAD: Conducir demasiado rápido es una causa principal de choques fatales. Debe ajustar la velocidad según el camino, el clima, la visibilidad, el tráfico y el peso de su carga. Un vehículo cargado necesita más distancia para detenerse. La distancia total de frenado = distancia de percepción + distancia de reacción + distancia de frenado. A 55 mph en pavimento seco, un vehículo pesado puede necesitar unos 6 segundos y aproximadamente el largo de un campo de fútbol para detenerse.

MANEJAR EL ESPACIO: Necesita espacio alrededor de su vehículo. Mantenga una distancia de seguimiento de al menos un segundo por cada 10 pies de longitud del vehículo a menos de 40 mph, y agregue un segundo por encima de 40 mph. Un vehículo de 60 pies necesita entonces unos 7 segundos de distancia a velocidad de autopista.

EMERGENCIAS: Si una llanta revienta, sujete el volante firmemente, no frene y deje que el vehículo reduzca la velocidad antes de salir del camino. Si fallan los frenos, reduzca la marcha, bombee los frenos, use el freno de estacionamiento gradualmente y busque una rampa de escape. En una emergencia, a menudo es más seguro dirigir alrededor de un obstáculo que frenar fuerte, porque puede cambiar de dirección más rápido de lo que puede detenerse.',
   4, true);

  -- ---------------------------------------------------------------- QUESTIONS
  insert into public.questions
    (course_id, question_text, spanish_question_text, option_a, option_b, option_c, option_d,
     spanish_option_a, spanish_option_b, spanish_option_c, spanish_option_d,
     correct_answer, explanation, spanish_explanation, sort_order, is_published)
  values
  (v_course_id,
   'What is the maximum blood alcohol concentration (BAC) allowed for CDL drivers?',
   '¿Cuál es la concentración máxima de alcohol en sangre (BAC) permitida para conductores de CDL?',
   '0.02%', '0.04%', '0.08%', '0.10%', '0.02%', '0.04%', '0.08%', '0.10%',
   'B', 'The maximum BAC for CDL drivers is 0.04%, which is half the 0.08% limit for regular drivers.',
   'La BAC máxima para conductores de CDL es 0.04%, la mitad del límite de 0.08% para conductores regulares.', 1, true),

  (v_course_id,
   'How far ahead should you look while driving?',
   '¿Qué tan lejos debe mirar mientras conduce?',
   '5-8 seconds', '8-10 seconds', '12-15 seconds', '20-25 seconds',
   '5-8 segundos', '8-10 segundos', '12-15 segundos', '20-25 segundos',
   'C', 'Look 12-15 seconds ahead so you can spot hazards early and react smoothly.',
   'Mire de 12 a 15 segundos adelante para detectar peligros temprano y reaccionar suavemente.', 2, true),

  (v_course_id,
   'What is the most important reason for doing a pre-trip inspection?',
   '¿Cuál es la razón más importante para hacer una inspección previa al viaje?',
   'To satisfy your employer', 'Safety for yourself and other road users', 'To save fuel', 'It is optional',
   'Para satisfacer a su empleador', 'Seguridad para usted y otros usuarios del camino', 'Para ahorrar combustible', 'Es opcional',
   'B', 'Inspections find problems that could cause a crash or breakdown, protecting you and everyone on the road.',
   'Las inspecciones encuentran problemas que podrían causar un choque o avería, protegiéndolo a usted y a todos en el camino.', 3, true),

  (v_course_id,
   'When backing a vehicle, it is safest to back toward which side?',
   'Al retroceder un vehículo, ¿hacia qué lado es más seguro hacerlo?',
   'The right (blind) side', 'The driver''s (left) side', 'Either side', 'Straight only',
   'El lado derecho (ciego)', 'El lado del conductor (izquierdo)', 'Cualquier lado', 'Solo recto',
   'B', 'Back toward the driver''s side whenever possible so you can see better out the side window.',
   'Retroceda hacia el lado del conductor siempre que sea posible para ver mejor por la ventana lateral.', 4, true),

  (v_course_id,
   'What does total stopping distance consist of?',
   '¿De qué consiste la distancia total de frenado?',
   'Braking distance only', 'Perception + reaction + braking distance', 'Reaction distance only', 'Speed times weight',
   'Solo distancia de frenado', 'Percepción + reacción + distancia de frenado', 'Solo distancia de reacción', 'Velocidad por peso',
   'B', 'Total stopping distance is perception distance plus reaction distance plus braking distance.',
   'La distancia total de frenado es la distancia de percepción más la de reacción más la de frenado.', 5, true),

  (v_course_id,
   'How should you use mirrors on a commercial vehicle?',
   '¿Cómo debe usar los espejos en un vehículo comercial?',
   'Only when parking', 'Regularly, especially before lane changes', 'Never while moving', 'Only at night',
   'Solo al estacionar', 'Regularmente, especialmente antes de cambiar de carril', 'Nunca en movimiento', 'Solo de noche',
   'B', 'Check mirrors regularly and always before changing lanes, turning, or merging.',
   'Revise los espejos regularmente y siempre antes de cambiar de carril, girar o incorporarse.', 6, true),

  (v_course_id,
   'Empty trucks require what compared to loaded trucks when stopping?',
   'Los camiones vacíos requieren qué en comparación con los cargados al detenerse?',
   'Less stopping distance always', 'Often longer stopping distance due to less traction', 'No difference', 'They cannot stop',
   'Siempre menos distancia', 'A menudo más distancia por menos tracción', 'Sin diferencia', 'No pueden detenerse',
   'B', 'Empty trucks have less traction, so the brakes can lock up and stopping distance can actually be longer.',
   'Los camiones vacíos tienen menos tracción, por lo que los frenos pueden bloquearse y la distancia puede ser mayor.', 7, true),

  (v_course_id,
   'What is a good following distance rule under 40 mph?',
   '¿Cuál es una buena regla de distancia de seguimiento a menos de 40 mph?',
   'One second total', 'One second per 10 feet of vehicle length', 'Two car lengths', 'Five feet',
   'Un segundo total', 'Un segundo por cada 10 pies de longitud', 'Dos largos de auto', 'Cinco pies',
   'B', 'Allow one second for each 10 feet of vehicle length under 40 mph, adding one second above 40 mph.',
   'Permita un segundo por cada 10 pies de longitud a menos de 40 mph, agregando un segundo por encima de 40 mph.', 8, true),

  (v_course_id,
   'If your vehicle starts to hydroplane, you should:',
   'Si su vehículo comienza a hidroplanear, debe:',
   'Brake hard', 'Accelerate', 'Release the accelerator and keep the wheel straight', 'Turn sharply',
   'Frenar fuerte', 'Acelerar', 'Soltar el acelerador y mantener el volante recto', 'Girar bruscamente',
   'C', 'Release the accelerator, do not brake hard, and keep steering straight until the tires regain grip.',
   'Suelte el acelerador, no frene fuerte y mantenga el volante recto hasta que las llantas recuperen tracción.', 9, true),

  (v_course_id,
   'When may you use the horn?',
   '¿Cuándo puede usar la bocina?',
   'To greet friends', 'Only when needed to avoid a crash', 'Constantly in traffic', 'Never',
   'Para saludar amigos', 'Solo cuando sea necesario para evitar un choque', 'Constantemente en tráfico', 'Nunca',
   'B', 'Use the horn only when it can help avoid a collision; unnecessary use can startle other drivers.',
   'Use la bocina solo cuando ayude a evitar una colisión; el uso innecesario puede asustar a otros conductores.', 10, true),

  (v_course_id,
   'What should you do if your brakes fail going down a hill?',
   '¿Qué debe hacer si fallan los frenos bajando una colina?',
   'Jump out', 'Downshift, pump brakes, and look for an escape ramp', 'Speed up', 'Turn off the engine',
   'Saltar', 'Reducir marcha, bombear frenos y buscar rampa de escape', 'Acelerar', 'Apagar el motor',
   'B', 'Downshift, pump the brakes, use the parking brake gradually, and use a truck escape ramp if available.',
   'Reduzca la marcha, bombee los frenos, use el freno de estacionamiento gradualmente y use una rampa de escape si está disponible.', 11, true),

  (v_course_id,
   'Hydraulic brakes can fail because of:',
   'Los frenos hidráulicos pueden fallar debido a:',
   'Loss of hydraulic pressure', 'Too much air', 'Cold weather only', 'High gears',
   'Pérdida de presión hidráulica', 'Demasiado aire', 'Solo clima frío', 'Marchas altas',
   'A', 'Loss of hydraulic pressure, often from fluid leaks or overheating (brake fade), can cause brake failure.',
   'La pérdida de presión hidráulica, a menudo por fugas o sobrecalentamiento (desvanecimiento), puede causar fallo de frenos.', 12, true),

  (v_course_id,
   'What is the best way to handle a tire blowout?',
   '¿Cuál es la mejor manera de manejar el reventón de una llanta?',
   'Brake hard immediately', 'Hold the wheel firmly, stay off the brake, then slow down', 'Speed up', 'Steer sharply',
   'Frenar fuerte de inmediato', 'Sujetar el volante firme, no frenar, luego reducir', 'Acelerar', 'Girar bruscamente',
   'B', 'Hold the steering wheel firmly, stay off the brake, let the vehicle slow, then pull off safely.',
   'Sujete el volante firmemente, no frene, deje que el vehículo reduzca y luego salga del camino con seguridad.', 13, true),

  (v_course_id,
   'When should you downshift?',
   '¿Cuándo debe reducir la marcha?',
   'Before starting down a hill', 'After reaching the bottom', 'Never on hills', 'Only when parked',
   'Antes de comenzar a bajar una colina', 'Después de llegar al fondo', 'Nunca en colinas', 'Solo estacionado',
   'A', 'Select a low gear before starting down a grade so the engine helps control speed (engine braking).',
   'Seleccione una marcha baja antes de bajar una pendiente para que el motor ayude a controlar la velocidad (freno de motor).', 14, true),

  (v_course_id,
   'What does an aggressive driver pose?',
   '¿Qué representa un conductor agresivo?',
   'No danger', 'A serious hazard you should give space to', 'A racing partner', 'A reason to speed up',
   'Ningún peligro', 'Un peligro serio al que debe dar espacio', 'Un compañero de carreras', 'Una razón para acelerar',
   'B', 'Give aggressive or distracted drivers plenty of room and do not engage with them.',
   'Dé mucho espacio a los conductores agresivos o distraídos y no interactúe con ellos.', 15, true),

  (v_course_id,
   'At what point are highways most slippery?',
   '¿En qué momento las carreteras están más resbaladizas?',
   'After it has rained all day', 'Just as it begins to rain', 'In bright sun', 'When dry',
   'Después de llover todo el día', 'Justo cuando comienza a llover', 'Con sol brillante', 'Cuando está seco',
   'B', 'Roads are most slippery as rain begins, mixing with oil and dust before it washes away.',
   'Los caminos son más resbaladizos cuando empieza a llover, mezclándose con aceite y polvo antes de lavarse.', 16, true),

  (v_course_id,
   'Why should you signal early?',
   '¿Por qué debe señalar con anticipación?',
   'It is the law only', 'To give other drivers time to react', 'To save the bulb', 'No reason',
   'Es solo la ley', 'Para dar tiempo a otros conductores de reaccionar', 'Para ahorrar el foco', 'Sin razón',
   'B', 'Signaling early lets others know your intentions and gives them time to respond safely.',
   'Señalar temprano informa sus intenciones a otros y les da tiempo para responder con seguridad.', 17, true),

  (v_course_id,
   'What is "black ice"?',
   '¿Qué es el "hielo negro"?',
   'A thin clear layer of ice that looks like wet pavement', 'Painted road', 'Gravel', 'Oil spill',
   'Una capa delgada y transparente de hielo que parece pavimento mojado', 'Camino pintado', 'Grava', 'Derrame de aceite',
   'A', 'Black ice is a thin, clear coating that makes the road look merely wet; it is very dangerous.',
   'El hielo negro es una capa delgada y transparente que hace que el camino parezca solo mojado; es muy peligroso.', 18, true),

  (v_course_id,
   'If you must drive in fog, you should:',
   'Si debe conducir en niebla, debe:',
   'Use high beams', 'Slow down and use low beams', 'Speed up to get through', 'Turn off lights',
   'Usar luces altas', 'Reducir velocidad y usar luces bajas', 'Acelerar para salir rápido', 'Apagar las luces',
   'B', 'Slow down and use low beams; high beams reflect off fog and reduce visibility.',
   'Reduzca la velocidad y use luces bajas; las luces altas se reflejan en la niebla y reducen la visibilidad.', 19, true),

  (v_course_id,
   'Stopping distance increases with:',
   'La distancia de frenado aumenta con:',
   'Lower speed', 'Greater speed and heavier load', 'New tires', 'Daylight',
   'Menor velocidad', 'Mayor velocidad y carga más pesada', 'Llantas nuevas', 'Luz del día',
   'B', 'The faster you go and the heavier the load, the longer it takes to stop.',
   'Cuanto más rápido va y más pesada es la carga, más tiempo toma detenerse.', 20, true);

  raise notice 'Seeded General Knowledge: % lessons, % questions',
    (select count(*) from public.lessons where course_id = v_course_id),
    (select count(*) from public.questions where course_id = v_course_id);
end $$;
