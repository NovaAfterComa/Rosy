/* ============================================================
   CONFIGURAZIONE — modifica solo questo file per personalizzare.
   Lascia "" (vuoto) un campo per nasconderlo / disattivarlo.
   ============================================================ */
window.INVITO_CONFIG = {
  nome: "[NOME FESTEGGIATA]",
  eta: "",                         // es. "30": se vuoto, l'età non viene mostrata
  data: "[DATA DELLA FESTA]",
  orario: "[ORARIO]",
  locale: "[NOME DEL LOCALE]",
  indirizzo: "[INDIRIZZO COMPLETO]",

  // Link alla mappa (Google Maps, Apple Maps...). Vuoto = pulsante nascosto.
  mappa: "",
  // Numero WhatsApp con prefisso internazionale, senza + (es. "393331234567"). Vuoto = pulsante nascosto.
  whatsapp: "",
  // Segnaposti disponibili: {nome} {data} {orario} {locale}
  messaggioConferma: "Ciao! Confermo la mia presenza alla festa di {nome} il {data} alle {orario} ({locale}). A presto!",

  // Monogramma mostrato nella schermata iniziale ("" = nessuno)
  monogramma: "assets/monogramma.jpg",

  // Fotografie Polaroid (4). src vuoto o file mancante = segnaposto grafico.
  foto: [
    { src: "", etichetta: "Il mare",             didascalia: "Il mio posto del cuore." },
    { src: "", etichetta: "La migliore amica",   didascalia: "Complice di tutte le mie follie." },
    { src: "", etichetta: "La cagnolona",        didascalia: "L’ospite d’onore. Ovviamente." },
    { src: "", etichetta: "Una foto divertente", didascalia: "Crescere? Ci sto ancora pensando." }
  ],

  // Audio (opzionale). Vuoto = nessun audio. Parte solo dopo il tocco su "Apri il messaggio".
  musica: "",      // es. "assets/musica.mp3"
  onde: "",        // es. "assets/onde.mp3" (rumore delle onde, in loop)

  // Durate delle scene in secondi
  durate: { messaggio: 4.5, bottiglia: 8, foto: 7.5, luna: 7, finale: 6 },

  // Testi della storia
  testi: {
    scena1: "Ci sono storie che nascono dal mare…",
    scena2: "La protagonista di questa storia? Una certa ragazza che non ha nessuna intenzione di crescere davvero…",
    scena4: "Le cose belle non si contano negli anni, ma nei momenti che ci fanno brillare gli occhi.",
    finale: "La storia continua… e stavolta voglio viverla con voi!"
  }
};
