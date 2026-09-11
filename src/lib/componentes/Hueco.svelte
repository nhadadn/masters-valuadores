<script lang="ts">
  /**
   * Contenido no aprobado. La etiqueta dice qué TRABAJO hace ese texto, no qué dice.
   *
   * Existe para que la ausencia de contenido sea visible en vez de disimulada.
   * Cuando llegue el copy, este componente desaparece de esa posición; mientras
   * tanto, cualquiera que abra la página ve exactamente qué falta.
   *
   * ── POR QUÉ EL HUECO SE VISTE DE MARCA ────────────────────────────────────
   *
   * Medido en la primera pantalla de la portada a 390 px: el andamio —huecos,
   * ranuras y marcas de por confirmar— ocupa el 48.1 % del área, y las seis piezas
   * del ADR-0007 ocupan el 0.12 %. Ninguna filigrana sobrevive a esa proporción, y
   * el sitio se leía como una maqueta de herramienta, no como Masters.
   *
   * La causa era que este componente mezclaba dos cosas y solo enseñaba una:
   *
   *   1 · que falta contenido        → se veía
   *   2 · qué PAPEL tipográfico va a tener ese contenido → se escondía
   *
   * Un titular pendiente se dibujaba como etiqueta gris de 13 px dentro de una caja
   * punteada. Ahora se dibuja en su papel real —caja alta, peso 900, dos tintas—
   * con EXACTAMENTE las mismas palabras. No se inventa nada y no se disimula nada:
   * el marcador «[PENDIENTE: contenido no aprobado]» sigue arriba y el borde
   * punteado sigue ahí. Lo único que cambia es que ahora se ve la voz.
   *
   * Efecto lateral buscado: cuando llegue el copy, ese bloque ya se ve así.
   *
   * ── DOS TINTAS SIN INVENTAR EL CORTE ──────────────────────────────────────
   *
   * Las etiquetas de rol ya vienen partidas por un guion largo —«TITULAR — QUÉ
   * HACEN Y DÓNDE»—: el papel a un lado, su descripción al otro. Ese corte, que ya
   * estaba escrito, es el que va a dos tintas. Las etiquetas sin guion van en una
   * sola tinta; no se les inventa una partición.
   *
   * ── CONTRASTE · POR QUÉ SOLO h1 Y h2 ──────────────────────────────────────
   *
   * El oro de texto sobre el crema del hueco da 4.05:1. El piso de WCAG baja a 3:1
   * para texto grande —24 px, o 18.66 px en negrita—, así que a escala de titular
   * (34 px) y de h2 (22 px) en peso 900 pasa con margen. A escala de h3 (18 px) NO
   * pasaría, así que h3 y p conservan el tratamiento de etiqueta de siempre.
   */
  interface Props {
    etiqueta: string;
    renglones?: number;
    sobreOscuro?: boolean;
    /**
     * Con qué elemento se rotula el hueco. Importa: una página sin h1 no tiene
     * encabezado, y que el titular esté pendiente no es excusa para que el elemento
     * no exista. Cuando llegue el copy, cambia el texto, no la estructura.
     */
    como?: 'p' | 'h1' | 'h2' | 'h3';
  }
  let { etiqueta, renglones = 2, sobreOscuro = false, como = 'p' }: Props = $props();

  const anchos = [100, 72, 88, 64];
  const grande = $derived(como === 'h1' || como === 'h2');
  const partes = $derived(etiqueta.split(' — '));
</script>

<div class="hueco" class:oscuro={sobreOscuro} class:grande data-pendiente="true">
  <p class="marca">[PENDIENTE: contenido no aprobado]</p>
  <svelte:element this={como} class="etiqueta {como}">
    {#if grande && partes.length > 1}
      <span class="linea">{partes[0]}</span><span class="linea oro">{partes.slice(1).join(' — ')}</span>
    {:else}
      {etiqueta}
    {/if}
  </svelte:element>
  {#each Array(renglones) as _, i}
    <span class="barra" style="width: {anchos[i % anchos.length]}%"></span>
  {/each}
</div>

<style>
  .hueco {
    border: 1px dashed var(--negro-400);
    background: var(--crema-050);
    padding: var(--e-3) var(--e-3);
  }
  /* El marcador se separa de la etiqueta para que el papel tipográfico pueda crecer
     sin arrastrarlo. Sigue siendo lo primero que se lee. */
  .marca {
    margin: 0 0 var(--e-2);
    font-size: var(--etiqueta-tam);
    line-height: var(--etiqueta-alto);
    font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking);
    color: var(--tinta-secundaria);
  }
  .etiqueta {
    margin: 0;
    font-size: var(--etiqueta-tam);
    line-height: var(--etiqueta-alto);
    font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking);
    color: var(--tinta-secundaria);
  }

  /* El papel de titular, dibujado como titular · ADR-0007 §4 */
  .grande .etiqueta {
    font-weight: var(--titular-peso);
    line-height: var(--titular-alto);
    letter-spacing: var(--titular-tracking);
    text-transform: uppercase;
    color: var(--tinta);
    overflow-wrap: break-word;
  }
  .grande .h1 { font-size: var(--display-tam); }
  .grande .h2 { font-size: var(--h2-tam); }
  .linea { display: block; }
  /* 4.05:1 sobre el crema del hueco · piso 3:1 por ser texto grande en peso 900 */
  .oro { color: var(--oro-800); }

  .barra {
    display: block;
    height: 14px;
    border-radius: 2px;
    background: var(--negro-200);
    margin-top: var(--e-2);
  }

  .oscuro { border-color: var(--negro-600); background: rgba(255, 255, 255, 0.04); }
  .oscuro .marca { color: var(--tinta-tenue-oscuro); }
  .oscuro .etiqueta { color: var(--tinta-tenue-oscuro); }
  .oscuro.grande .etiqueta { color: var(--tinta-sobre-oscuro); }
  .oscuro .oro { color: var(--oro-500); }   /* 11.12:1 sobre negro-950 */
  .oscuro .barra { background: var(--negro-500); }
</style>
