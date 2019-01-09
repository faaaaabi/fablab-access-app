# Fablab Access App
App zur Zugriffskontrolle von Geräten im Fabalb

## Usage

### node.js installieren
* Installer (Windows, macOS) / Manuell (Linux)
https://nodejs.org/en/download/current/

* Node Version Manager (nvm)
https://nodejs.org/en/

Node Version >= 11.1.0

### React Native installieren

#### Windows
Folgende Seite aufrufen: https://facebook.github.io/react-native/docs/getting-started.html
* Bei "Development OS" Windows auswählen, Bei "Target Os" Android auswählen
  * Nur Abschnitt Installing dependencies ausführen 


### Abhängigkeiten Installieren

```bash
$ npm install
```

### Konfiguration anpassen
* unter store/reducer.js IP/Hostname des API-Gateways anpassen*

\* nur notwendig, wenn die Interaktion mit dem API-Gateway stattfinden soll.

## App starten

### Endgerät vorbereiten
* Entwickleroptionen im Gerät aktivieren
* USB Debugging im Gerät aktivieren

### App auf Endgerät ausführen
```bash
$ react-native run-android
```

Detailierte Anleitung hier: https://facebook.github.io/react-native/docs/running-on-device
