# Kreislauf entdecken

Eigenständige Unterseite: `kreislauf.html`. Die Hauptnavigation verbindet sie mit `index.html`.

## Inhalt

- Zehn Stationen bilden einen geschlossenen Kreislauf: linke Kammer, Aorta/Körperarterien, Körperkapillaren, Venen/Hohlvenen, rechter Vorhof, rechte Kammer, Lungenarterien, Lungenkapillaren, Lungenvenen, linker Vorhof.
- Beide Lungen sind parallel angeschlossen. Die Körperkapillaren stehen schematisch für das Gewebe des Körpers. Die Geometrie ist eine didaktische Darstellung, kein maßstabgetreues anatomisches Organmodell.
- Rot/blau zeigt den Sauerstoffgehalt, nicht die Definition von Arterie/Vene. Der Farbwechsel liegt ausschließlich in den beiden Kapillarbetten.
- Vier Herzklappen lassen sich gesondert anzeigen und erklären.
- Zehn Zuordnungsfragen, zwei Reihenfolgeübungen und zwei mündliche Selbstkontrollen speichern ihren Fortschritt unter `anatomie-circulation-progress`.
- Bestehende Karten, Begriffserklärungen und Lernmarkierungen bleiben unverändert. Eine separate `sessionStorage`-Position stellt beim Rückweg Kategorie, Suchtext, Reihenfolge, Karte und Antwortseite wieder her.

Die mündlichen Antworten entsprechen den bestehenden Karten zu Skriptseite 206. Fachlicher Abgleich für Blutweg und Klappen: [IQWiG, Wie funktioniert das Herz?](https://www.gesundheitsinformation.de/wie-funktioniert-das-herz.html).

## Technik

Statische HTML/CSS/JavaScript-Unterseite. Three.js 0.180.0 und Lucide 0.468.0 liegen lokal in `vendor`, einschließlich Lizenzen. Keine externen Laufzeit-Downloads, Konten oder Serverdatenbank. Lokal über einen HTTP-Server öffnen, z. B. `python3 -m http.server 8886`.

`kreislauf-data.js`: Stationen, Erklärungen und Übungen.
`kreislauf-scene.js`: räumliches Schema, Gefäße, Flussanimation und Beschriftung.
`kreislauf.js`: Lernmodi, Übungen und Speicherung.

## Prüfung am 12.09.2026

- Browserprüfung in Chromium: 360, 440, 820, 1024 und 1440 Pixel Breite; Screenshots visuell geprüft, kein horizontaler Überlauf oder abgeschnittene Modellbeschriftungen.
- Canvas-Pixelprüfung: nicht leer; sichtbare Bewegung zwischen zwei Aufnahmen; vollständig unveränderte Pixel bei pausierter Animation.
- Alle zehn Führungsschritte, richtige/falsche Zuordnung, beide Blutwegfolgen und beide mündlichen Selbstkontrollen geprüft.
- Alle 14 Fortschrittsmarkierungen bleiben nach Neuladen erhalten.
- Rücknavigation erhält Kategorie, Suchtext, Kartennummer, Antwortseite und Lernmarkierung.
- Herzklappen bleiben nach Auswahl sichtbar, keine überlappenden Beschriftungen bei 360 Pixeln.
- Reduzierte Bewegung und erzwungener WebGL-Ausfall geprüft; Text und Übungen bleiben nutzbar.

Die Bildschirmgrößen wurden simuliert; dies ersetzt keinen Test auf jedem physischen Gerät.
