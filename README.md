# kerngas

Produktionswebsite für kerngas in Wien & Umgebung mit React/Vite-Frontend und Express/Nodemailer-Kontaktbackend.

## Lokal und auf Render

1. Repository auf GitHub anlegen und den Projektinhalt hochladen.
2. Auf Render einen Web Service aus dem Repository erstellen. `render.yaml` enthält bereits Build-, Start- und Health-Check-Einstellungen.
3. Die SMTP-Umgebungsvariablen aus `.env.example` im Render-Dashboard als geheime Werte hinterlegen. Die Werte werden nicht im Quellcode gespeichert.
4. Vor der Veröffentlichung die markierten Betreiber-, Anschrifts- und Gewerbeangaben in Impressum und Datenschutz ergänzen und rechtlich prüfen.
5. Nach dem Deployment den Formularversand mit einer Testanfrage prüfen.

Build: `npm ci && npm run build`
Start: `npm start`
Health Check: `/health`

## Mailversand

Das Backend nimmt Anfragen inklusive Bildern bis 10 MB je Bild entgegen, prüft Dateityp und Anzahl serverseitig und verarbeitet Anhänge nur im Arbeitsspeicher. Es versendet die Anfrage an `CONTACT_EMAIL` sowie eine Eingangsbestätigung an die angegebene E-Mail-Adresse.

## Hinweis zu Marken und Bildrechten

Die Herstellerübersicht behauptet keine offiziellen Partnerschaften. Vor Veröffentlichung sollten nur freigegebene Markenlogos oder eigene, lizenzierte Gerätebilder ergänzt werden. Das aktuelle Projekt verwendet das bereitgestellte KERN-Logo als eigenes Bildmaterial.
