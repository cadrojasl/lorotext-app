-- ============================================================
-- SEED: Categorías y productos Lorotext SYM
-- Ejecutar en: Supabase SQL Editor
-- Las imágenes se agregan después desde el panel admin.
-- ============================================================

-- 1. CATEGORÍAS
INSERT INTO categories (name, slug, sort_order, visible) VALUES
  ('Sábanas',                  'sabanas',              1,  true),
  ('Toallas',                  'toallas',              2,  true),
  ('Colcha Española',          'colcha-espanola',      3,  true),
  ('Tapetes',                  'tapetes',              4,  true),
  ('Edredones',                'edredones',            5,  true),
  ('Plumones',                 'plumones',             6,  true),
  ('Acolchados',               'acolchados',           7,  true),
  ('Cobijas',                  'cobijas',              8,  true),
  ('Cobijas Ovejeras',         'cobijas-ovejeras',     9,  true),
  ('Cobijas Térmicas',         'cobijas-termicas',     10, true),
  ('Cortinas',                 'cortinas',             11, true),
  ('Salida de baño',           'salida-de-bano',       12, true),
  ('Almohadas',                'almohadas',            13, true),
  ('Cojines',                  'cojines',              14, true),
  ('Cuelleros',                'cuelleros',            15, true),
  ('Protectores de colchón',   'protectores-colchon',  16, true),
  ('Velos',                    'velos',                17, true),
  ('Cobijas para bebé',        'cobijas-bebe',         18, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. PRODUCTOS (sin imagen, sin precio — se completan desde el admin)
-- Usamos un bloque para leer los IDs de categoría dinámicamente.

DO $$
DECLARE
  cat_id uuid;
BEGIN

  -- SÁBANAS
  SELECT id INTO cat_id FROM categories WHERE slug = 'sabanas';
  INSERT INTO products (name, slug, description_short, price, active, category_id) VALUES
    ('Sábana Casa Luna 180 hilos', 'sabana-casa-luna-180-hilos',
     'Sábana 100% poliéster de 180 hilos. Suave al tacto, fácil lavado.',
     0, true, cat_id),
    ('Sábana Lorotext 600 hilos', 'sabana-lorotext-600-hilos',
     'Sábana en algodón de 600 hilos. Acabado premium con excelente durabilidad.',
     0, true, cat_id),
    ('Sábana Armonía 800 hilos', 'sabana-armonia-800-hilos',
     'Sábana 800 hilos en algodón con embone. Frescura y suavidad incomparables.',
     0, true, cat_id),
    ('Sábana Sabrina 1200 hilos', 'sabana-sabrina-1200-hilos',
     'Sábana en algodón egipcio de 1200 hilos. La más lujosa de nuestra colección.',
     0, true, cat_id),
    ('Sábana Edredona 240 hilos', 'sabana-edredona-240-hilos',
     'Sábana en algodón género de 240 hilos. Ideal para clima cálido.',
     0, true, cat_id),
    ('Sábana Venecia Premium 420 hilos', 'sabana-venecia-premium-420-hilos',
     'Sábana en algodón texturizado de 420 hilos reales. Acabado exclusivo.',
     0, true, cat_id)
  ON CONFLICT (slug) DO NOTHING;

  -- TOALLAS
  SELECT id INTO cat_id FROM categories WHERE slug = 'toallas';
  INSERT INTO products (name, slug, description_short, price, active, category_id) VALUES
    ('Toalla tapete económica', 'toalla-tapete-economica',
     'Toalla tapete de uso diario. Absorbente y resistente.',
     0, true, cat_id),
    ('Toalla baño Ideas 100% algodón', 'toalla-bano-ideas-algodon',
     'Toalla de baño 100% algodón. Suave y de alta absorción.',
     0, true, cat_id),
    ('Toalla Aroma bordada 100% algodón', 'toalla-aroma-bordada',
     'Toalla 100% algodón con bordado decorativo. Ideal para regalo.',
     0, true, cat_id),
    ('Toalla en microfibra', 'toalla-microfibra',
     'Toalla de microfibra. Secado ultrarrápido y compacta para viaje.',
     0, true, cat_id),
    ('Toalla Venecia 100% algodón 620 g', 'toalla-venecia-620g',
     'Toalla premium 620 gramos, 100% algodón. Máxima suavidad y absorción.',
     0, true, cat_id),
    ('Set de Toallas x3 bordadas', 'set-toallas-x3-bordadas',
     'Set de 3 toallas 100% algodón bordadas. Surtido baño, manos y cara.',
     0, true, cat_id)
  ON CONFLICT (slug) DO NOTHING;

  -- COLCHA ESPAÑOLA
  SELECT id INTO cat_id FROM categories WHERE slug = 'colcha-espanola';
  INSERT INTO products (name, slug, description_short, price, active, category_id) VALUES
    ('Colcha Galleta', 'colcha-galleta',
     'Colcha española estilo galleta. Textura distintiva y muy abrigadora.',
     0, true, cat_id),
    ('Colcha económica en poliéster', 'colcha-economica-poliester',
     'Colcha española en poliéster. Excelente relación calidad-precio.',
     0, true, cat_id),
    ('Colcha en algodón', 'colcha-algodon',
     'Colcha española en algodón. Transpirable y cómoda.',
     0, true, cat_id),
    ('Colcha en algodón infantil', 'colcha-algodon-infantil',
     'Colcha española en algodón con diseños infantiles. Ideal para niños.',
     0, true, cat_id),
    ('Colcha Bordada algodón estampada', 'colcha-bordada-algodon-estampada',
     'Colcha bordada en algodón con hermosos estampados florales.',
     0, true, cat_id),
    ('Colcha Bordada algodón unicolor', 'colcha-bordada-algodon-unicolor',
     'Colcha bordada en algodón unicolor. Elegante y clásica.',
     0, true, cat_id),
    ('Colcha Sensation Nube', 'colcha-sensation-nube',
     'Colcha Sensation Nube. Suavidad extrema, perfecta para noches frías.',
     0, true, cat_id),
    ('Colcha en gamuza', 'colcha-gamuza',
     'Colcha española en gamuza. Tacto aterciopelado y muy abrigadora.',
     0, true, cat_id)
  ON CONFLICT (slug) DO NOTHING;

  -- TAPETES
  SELECT id INTO cat_id FROM categories WHERE slug = 'tapetes';
  INSERT INTO products (name, slug, description_short, price, active, category_id) VALUES
    ('Tapete para baño', 'tapete-bano',
     'Tapete antideslizante para baño. Absorbe humedad y evita resbalones.',
     0, true, cat_id),
    ('Tapete dentro de ducha', 'tapete-dentro-ducha',
     'Tapete especial para el interior de la ducha. Seguro y duradero.',
     0, true, cat_id),
    ('Juego de Baño', 'juego-de-bano',
     'Juego completo de tapetes para baño. Incluye tapete grande y pequeño.',
     0, true, cat_id),
    ('Pie de cama', 'pie-de-cama',
     'Tapete pie de cama. Suave bajo los pies al levantarse.',
     0, true, cat_id),
    ('Tapete Camino', 'tapete-camino',
     'Tapete de pasillo largo. Ideal para corredores y entradas.',
     0, true, cat_id),
    ('Alfombra', 'alfombra',
     'Alfombra decorativa para sala o habitación. Varios tamaños disponibles.',
     0, true, cat_id),
    ('Tapete para entradas', 'tapete-entradas',
     'Tapete robusto para zonas de alta circulación en entradas.',
     0, true, cat_id)
  ON CONFLICT (slug) DO NOTHING;

  -- EDREDONES
  SELECT id INTO cat_id FROM categories WHERE slug = 'edredones';
  INSERT INTO products (name, slug, description_short, price, active, category_id) VALUES
    ('Edredón Ovejero', 'edredon-ovejero',
     'Edredón estilo ovejero. Cálido y de tacto muy suave.',
     0, true, cat_id),
    ('Edredón Piel de durazno marmolizado', 'edredon-piel-durazno-marmolizado',
     'Edredón piel de durazno con acabado marmolizado. Diseño moderno y elegante.',
     0, true, cat_id),
    ('Edredón Piel de conejo', 'edredon-piel-conejo',
     'Edredón con tacto piel de conejo. Ultra suave y abrigador.',
     0, true, cat_id),
    ('Edredón térmico piel de durazno', 'edredon-termico-piel-durazno',
     'Edredón térmico en piel de durazno. Máximo abrigo para noches frías.',
     0, true, cat_id),
    ('Edredón doble faz peluche', 'edredon-doble-faz-peluche',
     'Edredón reversible con cara en peluche. Doble uso y máxima comodidad.',
     0, true, cat_id),
    ('Edredón fibra de oca', 'edredon-fibra-oca',
     'Edredón con fibra de oca. Ligero, cálido e hipoalergénico.',
     0, true, cat_id),
    ('Edredón acanalado', 'edredon-acanalado',
     'Edredón con textura acanalada. Diseño contemporáneo muy solicitado.',
     0, true, cat_id),
    ('Edredón Remolino', 'edredon-remolino',
     'Edredón con diseño remolino en relieve. Estético y muy abrigador.',
     0, true, cat_id),
    ('Edredón Smoofy', 'edredon-smoofy',
     'Edredón Smoofy. Textura única, suavidad excepcional.',
     0, true, cat_id)
  ON CONFLICT (slug) DO NOTHING;

  -- PLUMONES
  SELECT id INTO cat_id FROM categories WHERE slug = 'plumones';
  INSERT INTO products (name, slug, description_short, price, active, category_id) VALUES
    ('Plumón Tiara', 'plumon-tiara',
     'Plumón Tiara. Liviano, suave y de excelente capacidad de abrigo.',
     0, true, cat_id)
  ON CONFLICT (slug) DO NOTHING;

  -- ACOLCHADOS
  SELECT id INTO cat_id FROM categories WHERE slug = 'acolchados';
  INSERT INTO products (name, slug, description_short, price, active, category_id) VALUES
    ('Acolchado Estampado', 'acolchado-estampado',
     'Acolchado con diseños estampados. Combina estilo y calidez.',
     0, true, cat_id),
    ('Acolchado Unicolor', 'acolchado-unicolor',
     'Acolchado en color sólido. Clásico y versátil para cualquier decoración.',
     0, true, cat_id),
    ('Acolchado de equipos', 'acolchado-equipos',
     'Acolchado con estampado de equipos de fútbol. Perfecto para aficionados.',
     0, true, cat_id),
    ('Acolchado digitalizado infantil', 'acolchado-digitalizado-infantil',
     'Acolchado con impresión digital infantil. Colores vibrantes, personajes divertidos.',
     0, true, cat_id)
  ON CONFLICT (slug) DO NOTHING;

  -- COBIJAS
  SELECT id INTO cat_id FROM categories WHERE slug = 'cobijas';
  INSERT INTO products (name, slug, description_short, price, active, category_id) VALUES
    ('Cobija Viajera', 'cobija-viajera',
     'Cobija compacta ideal para viajes. Liviana y fácil de transportar.',
     0, true, cat_id),
    ('Cobija Piel de durazno', 'cobija-piel-durazno',
     'Cobija en piel de durazno. Tacto sedoso y muy abrigadora.',
     0, true, cat_id),
    ('Cobija Flanel', 'cobija-flanel',
     'Cobija de franela. Calientita y de rápido secado.',
     0, true, cat_id),
    ('Cobija de equipos', 'cobija-equipos',
     'Cobija con diseño de equipos de fútbol. Gran regalo para hinchas.',
     0, true, cat_id),
    ('Cobija Unicolor Grabada', 'cobija-unicolor-grabada',
     'Cobija unicolor con grabado en relieve. Elegante y acogedora.',
     0, true, cat_id),
    ('Cobija Bombón', 'cobija-bombon',
     'Cobija Bombón. Suave, esponjosa y muy reconfortante.',
     0, true, cat_id),
    ('Cobija Burbuja', 'cobija-burbuja',
     'Cobija con diseño de burbujas en relieve. Textura divertida y cálida.',
     0, true, cat_id),
    ('Cobija Ultimate 700 g', 'cobija-ultimate-700g',
     'Cobija Ultimate de 700 gramos. Máximo abrigo para climas fríos.',
     0, true, cat_id)
  ON CONFLICT (slug) DO NOTHING;

  -- COBIJAS OVEJERAS
  SELECT id INTO cat_id FROM categories WHERE slug = 'cobijas-ovejeras';
  INSERT INTO products (name, slug, description_short, price, active, category_id) VALUES
    ('Cobija Ovejera Listón', 'cobija-ovejera-liston',
     'Cobija ovejera con diseño de listones. Clásica y muy abrigadora.',
     0, true, cat_id),
    ('Cobija Ovejera Grabada', 'cobija-ovejera-grabada',
     'Cobija ovejera con grabado en relieve. Elegante y cálida.',
     0, true, cat_id),
    ('Cobija Ovejera Unicolor', 'cobija-ovejera-unicolor',
     'Cobija ovejera en color sólido. Suave al tacto y duradera.',
     0, true, cat_id),
    ('Cobija Ovejera Acanalada', 'cobija-ovejera-acanalada',
     'Cobija ovejera con textura acanalada. Diseño moderno y abrigador.',
     0, true, cat_id),
    ('Cobija Ovejera 3D', 'cobija-ovejera-3d',
     'Cobija ovejera con efecto 3D. Diseño de vanguardia.',
     0, true, cat_id),
    ('Cobija Ovejera Piel de conejo', 'cobija-ovejera-piel-conejo',
     'Cobija ovejera con cara en piel de conejo. Ultra suave y abrigadora.',
     0, true, cat_id)
  ON CONFLICT (slug) DO NOTHING;

  -- COBIJAS TÉRMICAS
  SELECT id INTO cat_id FROM categories WHERE slug = 'cobijas-termicas';
  INSERT INTO products (name, slug, description_short, price, active, category_id) VALUES
    ('Cobija Térmica Mallorca', 'cobija-termica-mallorca',
     'Cobija térmica Mallorca. Diseño español con excelente abrigo.',
     0, true, cat_id),
    ('Cobija Térmica tipo española Colortex', 'cobija-termica-espanola-colortex',
     'Cobija térmica estilo española de la línea Colortex. Colorida y cálida.',
     0, true, cat_id),
    ('Cobija Térmica Salomón', 'cobija-termica-salomon',
     'Cobija térmica Salomón. Pesada y de excelente poder calorífico.',
     0, true, cat_id),
    ('Cobija Térmica española Vikasa', 'cobija-termica-espanola-vikasa',
     'Cobija térmica española Vikasa. Alta calidad y durabilidad comprobada.',
     0, true, cat_id)
  ON CONFLICT (slug) DO NOTHING;

  -- CORTINAS
  SELECT id INTO cat_id FROM categories WHERE slug = 'cortinas';
  INSERT INTO products (name, slug, description_short, price, active, category_id) VALUES
    ('Cortina de baño', 'cortina-bano',
     'Cortina para ducha resistente al agua. Varios diseños disponibles.',
     0, true, cat_id),
    ('Cortina De botón', 'cortina-boton',
     'Cortina con acabado de botones decorativos. Elegante para cualquier habitación.',
     0, true, cat_id),
    ('Cortina Blackout', 'cortina-blackout',
     'Cortina blackout que bloquea completamente la luz. Ideal para dormitorios.',
     0, true, cat_id),
    ('Cortina con velo', 'cortina-con-velo',
     'Cortina con velo semitransparente. Luz suave y ambiente íntimo.',
     0, true, cat_id)
  ON CONFLICT (slug) DO NOTHING;

  -- SALIDA DE BAÑO
  SELECT id INTO cat_id FROM categories WHERE slug = 'salida-de-bano';
  INSERT INTO products (name, slug, description_short, price, active, category_id) VALUES
    ('Salida de baño Económica 400 g', 'salida-bano-economica-400g',
     'Salida de baño en toalla de 400 gramos. Cómoda y absorbente.',
     0, true, cat_id),
    ('Salida de baño Fina 1200 g', 'salida-bano-fina-1200g',
     'Salida de baño premium 1200 gramos. El máximo en lujo y comodidad.',
     0, true, cat_id)
  ON CONFLICT (slug) DO NOTHING;

  -- ALMOHADAS
  SELECT id INTO cat_id FROM categories WHERE slug = 'almohadas';
  INSERT INTO products (name, slug, description_short, price, active, category_id) VALUES
    ('Dúo de almohada', 'duo-almohada',
     'Par de almohadas estándar. Suave relleno y funda incluida.',
     0, true, cat_id),
    ('Dúo de almohada termosellado', 'duo-almohada-termosellado',
     'Par de almohadas con sellado térmico. Mayor durabilidad y firmeza.',
     0, true, cat_id),
    ('Almohada de puntos semi ortopédica', 'almohada-puntos-semi-ortopedica',
     'Almohada semi ortopédica con puntos de soporte. Ideal para el descanso cervical.',
     0, true, cat_id),
    ('Almohada viscoelástica curva pequeña', 'almohada-viscoelastica-curva-pequena',
     'Almohada viscoelástica con curva ergonómica, talla pequeña.',
     0, true, cat_id),
    ('Almohada Viscoelástica curva grande', 'almohada-viscoelastica-curva-grande',
     'Almohada viscoelástica con curva ergonómica, talla grande.',
     0, true, cat_id),
    ('Almohada ortopédica abrazadera', 'almohada-ortopedica-abrazadera',
     'Almohada ortopédica con soporte para cuerpo completo. Ideal para embarazadas.',
     0, true, cat_id),
    ('Almohada viscoelástica con curva gel', 'almohada-viscoelastica-curva-gel',
     'Almohada viscoelástica con gel de enfriamiento. Fresca toda la noche.',
     0, true, cat_id),
    ('Almohada viscoelástica plana gel', 'almohada-viscoelastica-plana-gel',
     'Almohada viscoelástica plana con gel. Bajo perfil y soporte cervical.',
     0, true, cat_id)
  ON CONFLICT (slug) DO NOTHING;

  -- COJINES (sin productos específicos mencionados)
  SELECT id INTO cat_id FROM categories WHERE slug = 'cojines';

  -- CUELLEROS (sin productos específicos mencionados)
  SELECT id INTO cat_id FROM categories WHERE slug = 'cuelleros';

  -- PROTECTORES DE COLCHÓN
  SELECT id INTO cat_id FROM categories WHERE slug = 'protectores-colchon';
  INSERT INTO products (name, slug, description_short, price, active, category_id) VALUES
    ('Protector plástico', 'protector-plastico',
     'Funda protectora plástica para colchón. Impermeable y de fácil limpieza.',
     0, true, cat_id),
    ('Protector de colchón sin antifluido', 'protector-colchon-sin-antifluido',
     'Protector de colchón suave. Prolonga la vida útil de tu colchón.',
     0, true, cat_id),
    ('Protector de colchón con antifluido', 'protector-colchon-con-antifluido',
     'Protector de colchón con barrera antifluido. Ideal para niños o mascotas.',
     0, true, cat_id)
  ON CONFLICT (slug) DO NOTHING;

  -- VELOS (sin productos específicos mencionados)
  SELECT id INTO cat_id FROM categories WHERE slug = 'velos';

  -- COBIJAS PARA BEBÉ
  SELECT id INTO cat_id FROM categories WHERE slug = 'cobijas-bebe';
  INSERT INTO products (name, slug, description_short, price, active, category_id) VALUES
    ('Cobija para bebé Vikasa', 'cobija-bebe-vikasa',
     'Cobija suave para bebé, línea Vikasa. Hipoalergénica y de fácil lavado.',
     0, true, cat_id),
    ('Cobija para bebé Mora', 'cobija-bebe-mora',
     'Cobija para bebé Mora. Calientita y de tacto muy suave para los más pequeños.',
     0, true, cat_id)
  ON CONFLICT (slug) DO NOTHING;

END $$;

-- Verificar resultado:
SELECT c.name AS categoria, COUNT(p.id) AS productos
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.id, c.name
ORDER BY c.sort_order;
