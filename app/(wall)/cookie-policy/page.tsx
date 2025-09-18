import { Routes } from "@/src/routes";
import clsx from "clsx";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: Routes.privacyPolicy.title,
};

export default function CookiePolicy() {
  return (
    <section className="py-4">
      <div
        className={clsx(
          "relative mx-auto max-w-screen-xl space-y-6 mb-8 px-4 sm:px-6 lg:px-8"
        )}
      >
        <h1 className="text-3xl text-primary-900">
          Cookie Policy
        </h1>
        <span className="absolute right-1 -top-4 sm:top-0 text-xs">
          Ultimo Aggiornamento: 01/05/2025
        </span>
        <p>
          Questo documento contiene informazioni in merito alle tecnologie che
          consentono a questa Applicazione di raggiungere gli scopi descritti di
          seguito. Tali tecnologie permettono al Titolare di raccogliere e
          salvare informazioni (per esempio tramite l&apos;utilizzo di Cookie) o
          di utilizzare risorse (per esempio eseguendo uno script) sul
          dispositivo dell&apos;Utente quando quest&apos;ultimo interagisce con
          questa Applicazione.
        </p>
        <p>
          Per semplicità, in questo documento tali tecnologie sono
          sinteticamente definite “Strumenti di Tracciamento”, salvo vi sia
          ragione di differenziare.
          <br />
          Per esempio, sebbene i Cookie possano essere usati in browser sia web
          sia mobili, sarebbe fuori luogo parlare di Cookie nel contesto di
          applicazioni per dispositivi mobili, dal momento che si tratta di
          Strumenti di Tracciamento che richiedono la presenza di un browser.
          Per questo motivo, all&apos;interno di questo documento il termine
          Cookie è utilizzato solo per indicare in modo specifico quel
          particolare tipo di Strumento di Tracciamento.
        </p>
        <p>
          Alcune delle finalità per le quali vengono impiegati Strumenti di
          Tracciamento potrebbero, inoltre richiedere il consenso
          dell&apos;Utente. Se viene prestato il consenso, esso può essere
          revocato liberamente in qualsiasi momento seguendo le istruzioni
          contenute in questo documento.
        </p>
        <p>
          Questa Applicazione utilizza Strumenti di Tracciamento gestiti
          direttamente dal Titolare (comunemente detti Strumenti di Tracciamento
          “di prima parte”) e Strumenti di Tracciamento che abilitano servizi
          forniti da terzi (comunemente detti Strumenti di Tracciamento “di
          terza parte”). Se non diversamente specificato all&apos;interno di
          questo documento, tali terzi hanno accesso ai rispettivi Strumenti di
          Tracciamento.
          <br />
          Durata e scadenza dei Cookie e degli altri Strumenti di Tracciamento
          simili possono variare a seconda di quanto impostato dal Titolare o da
          ciascun fornitore terzo. Alcuni di essi scadono al termine della
          sessione di navigazione dell&apos;Utente.
          <br />
          In aggiunta a quanto specificato nella descrizione di ciascuna delle
          categorie di seguito riportate, gli Utenti possono ottenere
          informazioni più dettagliate ed aggiornate sulla durata, così come
          qualsiasi altra informazione rilevante - quale la presenza di altri
          Strumenti di Tracciamento - nelle privacy policy dei rispettivi
          fornitori terzi (tramite i link messi a disposizione) o contattando il
          Titolare.
        </p>

        <h2 className="text-lg text-primary-900">
          Come questa Applicazione utilizza gli Strumenti di Tracciamento
        </h2>
        <p>
          <strong>Necessari</strong>
          <br />
          Questa Applicazione utilizza Cookie comunemente detti “tecnici” o
          altri Strumenti di Tracciamento analoghi per svolgere attività
          strettamente necessarie a garantire il funzionamento o la fornitura
          del Servizio.
        </p>
        <p>
          <strong>Misurazione</strong>
          <br />
          Questa Applicazione utilizza Strumenti di Tracciamento per misurare il
          traffico e analizzare il comportamento degli Utenti per migliorare il
          Servizio.
        </p>
        <b>Strumenti di Tracciamento gestiti da terze parti</b>
        <ul className="list-disc pl-4 space-y-2">
          <li>
            Google Analytics (Universal Analytics) (Google Ireland Limited) è un
            servizio di analisi web fornito da Google Ireland Limited
            (“Google”). Google utilizza i Dati Personali raccolti allo scopo di
            tracciare ed esaminare l&apos;utilizzo di questa Applicazione,
            compilare report e condividerli con gli altri servizi sviluppati da
            Google. Google potrebbe utilizzare i Dati Personali per
            contestualizzare e personalizzare gli annunci del proprio network
            pubblicitario.
            <br />
            Per una comprensione dell&apos;utilizzo dei dati da parte di Google,
            si prega di consultare le&nbsp;
            <a
              href="https://www.google.com/intl/it/policies/privacy/partners/"
              target="_blank"
              rel="noopener noreferrer"
            >
              norme per i partner di Google
            </a>
            .<br />
            Dati Personali trattati: Cookie e Dati di utilizzo.
            <br />
            Luogo del trattamento: Irlanda -&nbsp;
            <a
              href="https://business.safety.google/privacy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            &nbsp;-&nbsp;
            <a
              href="https://tools.google.com/dlpage/gaoptout?hl=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              Opt Out
            </a>
            .<br />
            Durata degli Strumenti di Tracciamento: AMP_TOKEN: 1 ora _ga: 2 anni
            _gac*: 3 mesi _gat: 1 minuto _gid: 1 giorno.
          </li>
        </ul>
        <h2 className="text-lg text-primary-900">
          Come gestire le preferenze e prestare o revocare il consenso su questa
          Applicazione
        </h2>
        <p>
          Qualora l&apos;utilizzo dei Tracker sia basato sul consenso,
          l&apos;Utente può fornire o revocare tale consenso impostando o
          aggiornando le proprie preferenze tramite il relativo pannello delle
          scelte in materia di privacy disponibile su questa Applicazione.
          <br />
          Per quanto riguarda Strumenti di Tracciamento di terza parte, gli
          Utenti possono gestire le proprie preferenze visitando il relativo
          link di opt out (qualora disponibile), utilizzando gli strumenti
          descritti nella privacy policy della terza parte o contattando
          quest&apos;ultima direttamente.
        </p>
        <strong>
          Come controllare o eliminare Cookie e tecnologie simili tramite le
          impostazioni del tuo dispositivo
        </strong>
        <div>
          Gli Utenti possono utilizzare le impostazioni del proprio browser per:
          <ul className="list-disc pl-4 space-y-2 my-4">
            <li>
              Vedere quali Cookie o altre tecnologie simili sono stati impostati
              sul dispositivo;
            </li>
            <li>Bloccare Cookie o tecnologie simili;</li>
            <li>Cancellare i Cookie o tecnologie simili dal browser.</li>
          </ul>
          Le impostazioni del browser, tuttavia, non consentono un controllo
          granulare del consenso per categoria.
          <br />
          Gli Utenti possono, per esempio, trovare informazioni su come gestire
          i Cookie in alcuni dei browser più diffusi ai seguenti indirizzi:
          <ul className="list-disc pl-4 space-y-2 my-4">
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647?hl=it&p=cpn_cookies"
                target="_blank"
                rel="noopener noreferrer"
              >
                <u>Google Chrome</u>
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie"
                target="_blank"
                rel="noopener noreferrer"
              >
                <u>Mozilla Firefox</u>
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/it-it/guide/safari/manage-cookies-and-website-data-sfri11471/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <u>Apple Safari</u>
              </a>
            </li>
            <li>
              <a
                href="http://windows.microsoft.com/it-it/windows-vista/block-or-allow-cookies"
                target="_blank"
                rel="noopener noreferrer"
              >
                <u>Microsoft Internet Explorer</u>
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/it-it/help/4027947"
                target="_blank"
                rel="noopener noreferrer"
              >
                <u>Microsoft Edge</u>
              </a>
            </li>
            <li>
              <a
                href="https://support.brave.com/hc/articles/360022806212-How-do-I-use-Shields-while-browsing"
                target="_blank"
                rel="noopener noreferrer"
              >
                <u>Brave</u>
              </a>
            </li>
            <li>
              <a
                href="https://help.opera.com/latest/web-preferences/#cookies"
                target="_blank"
                rel="noopener noreferrer"
              >
                <u>Opera</u>
              </a>
            </li>
          </ul>
          Gli Utenti possono inoltre gestire alcuni Strumenti di Tracciamento
          per applicazioni mobili disattivandoli tramite le apposite
          impostazioni del dispositivo, quali le impostazioni di pubblicità per
          dispositivi mobili o le impostazioni relative al tracciamento in
          generale (gli Utenti possono consultare le impostazioni del
          dispositivo per individuare quella pertinente).
          <br />
          <br />
          <b>
            Conseguenze legate al rifiuto dell&apos;utilizzo di Strumenti di
            Tracciamento
          </b>
          <br />
          Gli Utenti sono liberi di decidere se permettere o meno
          l&apos;utilizzo di Strumenti di Tracciamento. Tuttavia, si noti che
          gli Strumenti di Tracciamento consentono a questa Applicazione di
          fornire agli Utenti un&apos;esperienza migliore e funzionalità
          avanzate (in linea con le finalità delineate nel presente documento).
          Pertanto, qualora l&apos;Utente decida di bloccare l&apos;utilizzo di
          Strumenti di Tracciamento, il Titolare potrebbe non essere in grado di
          fornire le relative funzionalità.
        </div>
        <h2 className="text-lg text-primary-900">
          Come gestire le preferenze e prestare o revocare il consenso su questa
          Applicazione
        </h2>
        <p>
          Vittorio Luigi Di Fraia - Via Solfatara, 25, 80078 Pozzuoli (NA)
          <br />
          Indirizzo email del Titolare:&nbsp;
          <a href="mailto:vigila.direction@gmail.com">vigila.direction@gmail.com</a>
          <br />
          <br />
          Dal momento che l&apos;uso di Strumenti di Tracciamento di terza parte
          su questa Applicazione non può essere completamente controllato dal
          Titolare, ogni riferimento specifico a Strumenti di Tracciamento di
          terza parte è da considerarsi indicativo. Per ottenere informazioni
          complete, gli Utenti sono gentilmente invitati a consultare la privacy
          policy dei rispettivi servizi terzi elencati in questo documento.
          <br />
          <br />
          Data l&apos;oggettiva complessità di identificazione delle tecnologie
          di tracciamento, gli Utenti sono invitati a contattare il Titolare
          qualora volessero ricevere ulteriori informazioni in merito
          all&apos;utilizzo di tali tecnologie su questa Applicazione.
        </p>
      </div>
    </section>
  );
}
