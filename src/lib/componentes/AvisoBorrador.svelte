<script lang="ts">
  /**
   * Aviso de borrador · el tercer estado del contenido.
   *
   * El repo ya tenía dos: `Hueco` para lo que no existe y `PorConfirmar` para el dato
   * que falta. Este es el tercero: texto REDACTADO pero SIN APROBAR.
   *
   * El CLAUDE.md permite redactar —titulares, subtítulos, etiquetas— con una condición
   * que no se negocia: «marcado como propuesta para que el cliente corrija, nunca
   * publicado como hecho». Esto es esa marca.
   *
   * POR QUÉ UNA SOLA BANDA Y NO UNA ETIQUETA POR BLOQUE.
   * La marca por bloque habría sido más consistente con `Hueco` y `PorConfirmar`, y se
   * descartó a propósito: en la portada son doce bloques propuestos, y doce etiquetas
   * «PROPUESTA» reconstruyen exactamente el ruido de maqueta que acabamos de quitar.
   * A cambio, cada elemento propuesto lleva `data-propuesta="true"`, así que la marca
   * sigue siendo verificable con una consulta aunque no se repita en pantalla.
   *
   * El acento se usa como el ADR-0007 manda: relleno de oro con etiqueta oscura encima,
   * 11.12:1. Nunca oro suelto sobre claro.
   */
</script>

<aside class="aviso" data-propuesta="true">
  <p>
    <strong>BORRADOR</strong> · los textos de esta página son una propuesta sin aprobar.
    Corrige encima: tachar, cambiar una palabra o poner «así no» sirve igual.
  </p>
</aside>

<style>
  .aviso {
    background: var(--oro-500);
    color: var(--negro-950);          /* 11.12:1 sobre el oro */
    padding: var(--e-3) var(--margen-lateral);
  }
  .aviso p {
    max-width: var(--ancho-maximo);
    margin-inline: auto;
    font-size: var(--pie-tam);
    line-height: var(--pie-alto);
  }
  strong {
    font-weight: var(--titular-peso);
    letter-spacing: var(--etiqueta-tracking);
  }

  @media (min-width: 768px) {
    .aviso { padding-inline: var(--e-12); }
  }
</style>
