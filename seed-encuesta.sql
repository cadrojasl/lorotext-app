-- ============================================================
-- Tabla para respuestas de encuesta post-compra
-- Ejecutar en: Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS survey_responses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  rating      smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  name        text,
  comment     text,
  recommend   boolean,
  order_ref   text  -- referencia opcional que el admin puede incluir en el link
);

-- RLS: escritura pública (cualquiera con el link puede responder),
--      lectura solo para autenticados (admin).
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insertar respuesta pública"
  ON survey_responses FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "Leer respuestas solo admin"
  ON survey_responses FOR SELECT
  TO authenticated USING (true);
