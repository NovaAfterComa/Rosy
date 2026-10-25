# Una bottiglia, una storia, una festa

Invito di compleanno digitale animato. Solo HTML, CSS e JavaScript: nessun framework, nessuna compilazione, nessun servizio esterno.

```
invito-compleanno/
├── index.html
├── style.css
├── script.js
├── config.js        ← l'unico file da modificare
├── README.md
└── assets/
    └── monogramma.jpg   (opzionale)
```

## 1. Personalizzare

Apri `config.js` e sostituisci i segnaposto tra parentesi quadre:

- `nome`, `data`, `orario`, `locale`, `indirizzo`
- `eta`: se lasciata `""` non viene mostrata
- `mappa`: link Google Maps/Apple Maps. Vuoto = pulsante "Come arrivare" nascosto
- `whatsapp`: numero con prefisso, solo cifre (es. `393331234567`). Vuoto = pulsante "Conferma presenza" nascosto
- `messaggioConferma`: testo precompilato; puoi usare `{nome}`, `{data}`, `{orario}`, `{locale}`
- `testi`: le frasi della storia
- `durate`: secondi di ogni scena (messaggio, bottiglia, foto, luna, finale). Totale predefinito circa 31 secondi, per dare il tempo di leggere.

## 2. Fotografie

Copia 4 immagini in `assets/` (consigliato: quadrate, 800×800 px, JPG sotto 300 KB), per esempio `mare.jpg`, `amica.jpg`, `cagnolona.jpg`, `io.jpg`. Poi in `config.js`:

```js
foto: [
  { src: "assets/mare.jpg", etichetta: "Il mare", didascalia: "Il mio posto del cuore." },
  ...
]
```

Se `src` è vuoto o il file manca, compare un segnaposto grafico e la storia prosegue.

## 3. Musica e onde (opzionali)

Copia i file in `assets/` e indicali in `config.js`:

```js
musica: "assets/musica.mp3",
onde: "assets/onde.mp3",
```

L'audio parte solo dopo il tocco su "Apri il messaggio". Il pulsante con l'altoparlante in alto a destra lo disattiva. Usa solo brani di cui hai i diritti. La musica sale di volume alla rivelazione finale.

## 4. Monogramma

`assets/monogramma.jpg` compare nella schermata iniziale. Per toglierlo, imposta `monogramma: ""`.

## 5. Pubblicare con GitHub Pages

1. Crea una repository e carica **il contenuto** della cartella (`index.html` nella radice della repository).
2. Repository → **Settings → Pages**.
3. In "Build and deployment" scegli **Deploy from a branch**, branch `main`, cartella `/ (root)`, poi **Save**.
4. Dopo circa un minuto il sito è su `https://TUO-UTENTE.github.io/NOME-REPO/`.

Tutti i percorsi sono relativi, quindi funziona anche nella sottocartella di GitHub Pages.

## Accessibilità

- Con "riduci animazioni" attivo nel sistema, la storia diventa una sequenza di dissolvenze semplici, senza onde né movimenti.
- "Vai all'invito" è sempre disponibile durante la sequenza.
- Nessun lampeggiamento: il passaggio giorno/notte è una dissolvenza lenta.

## Cosa è stato verificato e cosa no

Verificato nell'ambiente di sviluppo: sintassi di `script.js` e `config.js`, presenza di tutti i file, percorsi relativi (nessun `/` iniziale né URL esterno), coerenza degli id tra HTML e JavaScript.

**Da provare nel browser** (non era possibile eseguirlo qui): resa su telefono verticale e su computer, avvio dell'audio su iOS/Android, tempi e fluidità delle animazioni, ordine visivo delle scene, funzionamento di "Riguarda la storia" e "Vai all'invito", apertura di WhatsApp e mappa. Prova anche con `prefers-reduced-motion` attivo.
