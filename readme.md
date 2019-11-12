# Fablab Access App
Android App zur Zugriffskontrolle von Geräten im Fabalb. Diese App wurde mit React-Native erstellt und verwendet die aus
React bekannten Konzepte von Komponenten. Für die Komponentenübegreifende Verwaltung von State wirde Redux verwendet.

Weiter verwendet:
* [redux-persist](https://github.com/rt2zz/redux-persist) Zur Persistierung bestimmter Daten
* [redux-thunk](https://github.com/reduxjs/redux-thunk) Zur Orchestrierung komplexerer Actions (Redux)
* [react-native-navigation](https://github.com/wix/react-native-navigation) Zur Erzeugung nativer Navigation in der App

## Usage

### node.js installieren
* Installer (Windows, macOS) / Manuell (Linux)
https://nodejs.org/en/download/current/

* Node Version Manager (nvm)
https://nodejs.org/en/

Node Version >= 11.1.0

### React Native installieren

Folgende Seite aufrufen: https://facebook.github.io/react-native/docs/getting-started.html
* Den Tab `React Native CLI Quickstart` auswählen
* Bei "Development OS" Windows/Linux/MacOS auswählen, Bei "Target Os" Android auswählen
  * Nur Abschnitt Installing dependencies ausführen 
  
### Abhängigkeiten Installieren

```bash
$ npm install
```

## App im Debug Modus starten
Zum einen kann die App über den Android Emulator oder über echte Hardware (Tablet/Smartphone) mit aktiviertem USB 
Debugging ausgeführt werden.

### Endgerät vorbereiten
* Entwickleroptionen im Gerät aktivieren
* USB Debugging im Gerät aktivieren

### App auf Endgerät ausführen
```bash
$ react-native run-android
```

Detailierte Anleitung hier: https://facebook.github.io/react-native/docs/running-on-device

#### URL für den debugger anpassen
Beim Ausführen von `$ react-native run-android` sollte sich neben der App auf dem Endgerät/Emulator auch ein Browser auf 
dem ausführenden Rechner öffnen. In der JavaScript Console dieses Fensters/Tabs werden die Logs der App durchgeschliffen. 
**Die aufgerufene IP ist falsch (bekannter Bug) und muss angepasst werden. Die App läuft nicht, wenn der Debugger nicht
erreichbar ist**. 
Die [hier](https://github.com/facebook/react-native/issues/17910#issuecomment-418096271) beschriebenen Schritte befolgen.
Handelt es sich um echte Hardware, erreicht man das Menü durch schütteln des Geräts.

#### App Konfigurieren
In der App sind unter dem Zahnrad in der linken oberen Ecke noch die IP und Port des API-Gateways sowie der API-Key und
Identifier (AccessDevice-Entität im API-Gateway) des Device einzutragen. Zum dem lässt sich hier auch der "Debug Mode"
aktivieren. Ist dieser aktiviert, so lässt sich die Benutzerauthentifizierung auch ohne Vorhandensein von NFC und/oder
RFID Karte auslösen.

Sind alle Daten richtig eingeben und gespeichert, lässt sich im Developer Menü (Strg-M oder Schütteln), die App neu laden.
Die App sollte nun die für ihren `Place` konfigurierten Geräte anzeigen.

#### Gerät Buchen
* NFC Karte an das Gerät halten / Mit aktiviertem Debug-Mode den Butten `Simulate NFC Tag`
  * UUID der Karte oder im Textfeld müssen einem User in Odoo zugeordnet sein
  * Wird der Benutzer gefunden und ist er berechtigt, kann er in einem Zeitraum von 20 Sekunden ein Gerät durch drücken 
    buchen. Nach ablauf der 20 Skeunden muss er sich erneut authentifizieren
  * Das API-Gateway schaltet mit Initierung der Buchung das Verknüpfte Gerät ein
* Über den gleichen Weg wird die Buchung dann auch wieder beendet
  * Ein Benutzer kann nur Buchungen beenden, die er auch initiert hat
  * Das API-Gateway erzeugt für eine Rechnung auf den Namen des Nutzers und schaltet das verknüpfte Gerät ab

## TODO
- [ ] NFC Komponente streamlinen (nicht benötigte komponenten raus. Logik auslagern)
- [ ] DeviceControl Komponente "dumme" Kompoenten Anteile auslagern
- [ ] authActions in DeviceCotrol Komponente überführen (globale Verfügbarkeit nicht notwendig)
- [ ] Visualisierung für einzelne Geräte implementieren
- [ ] Visualisierung für "Boden" Geräte implementieren
- [ ] Einstellungen durch Admin-Authentifizierung absichern
- [ ] Bestätigung von Nutzungsbedingungen bei Buchung implementieren
- [ ] Sicherheitsabfrage (PIN) bei markierten (gefährlichen) Geräten implementieren
- [ ] Abfrage von Geräte Icons von der API
- [ ] `npm audit` für vulnerable Pakete durchführen
- [ ] JS Timer gegn ReactNative Timer austauschen
- [ ] Alex Requests auf axios umstellen
- [ ] Tests
- [ ] Echtzeitkommunikation:  Websockets/Polling für Aktualisierung implementieren
- to be continued

## LICENSE
License Pending
