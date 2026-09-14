// Same 37 cards and IDs; only the optional learning text changes.
const nerveCirculationShortAnswers = [
  ["Beginn: Hinterhauptloch; Übergang vom verlängerten Mark", "Verlauf: im Wirbelkanal; etwa 1 cm dick", "Ende: etwa 1.–2. Lendenwirbel"],
  ["Hals · Brust · Lende · Kreuzbein · Steißbein"],
  ["Innen: grau → Nervenzellkörper", "Außen: weiß → Nervenfasern; Signale nach oben und unten"],
  ["Vorderhorn: motorisch → Muskelbewegung", "Hinterhorn: sensibel → ankommende Signale, z. B. Berührung und Schmerz"],
  ["31 Paare Spinalnerven", "12 Paare Hirnnerven"],
  ["Kopf, Hals und viele innere Organe", "Verbindung: Sinnesorgane ↔ Gehirn"],
  ["V: N. trigeminus (Drillingsnerv) → Gefühl im Gesicht + Kaumuskeln", "VII: N. facialis (Gesichtsnerv) → Mimik / Gesichtsausdruck"],
  ["V (5.): N. trigeminus → Drillingsnerv", "VII (7.): N. facialis → Gesichtsnerv"],
  ["Augenhöhlennerv → N. ophthalmicus", "Oberkiefernerv → N. maxillaris", "Unterkiefernerv → N. mandibularis"],
  ["N. maxillaris (Oberkiefernerv) → Oberkieferzähne", "N. mandibularis (Unterkiefernerv) → Unterkieferzähne, dortiges Zahnfleisch + Unterlippe"],
  ["N. facialis = Gesichtsnerv", "Mimische Muskulatur → Gesichtsausdruck"],
  ["Weitgehend automatische Steuerung: Atmung, Kreislauf, Stoffwechsel"],
  ["Sympathikus + Parasympathikus"],
  ["Sympathikus → körperliche Arbeit, Stress", "Parasympathikus → Ruhe, Essen, Verdauung, Ausscheidung"],
  ["Sympathikus: Pupillen/Bronchien weiter; Herz schneller; Verdauung gebremst", "Parasympathikus: Pupillen/Bronchien enger; Herz langsamer; Verdauung gefördert"],
  ["Gallenblase + Harnblase:", "Sympathikus → Füllung; Entleerung gehemmt", "Parasympathikus → Entleerung gefördert"],
  ["Stress, Anspannung → Sympathikus", "Entspannung, Essen, Verdauung, Ausscheidung → Parasympathikus"],
  ["Sehr hoher Sauerstoffbedarf", "Wenige Minuten ohne Sauerstoff → mögliche bleibende Schäden"],
  ["Über Arterien an der Hirnbasis"],
  ["Herz + Blutgefäße", "Anderer Name: kardiovaskuläres System"],
  ["Lungenkreislauf = kleiner Kreislauf", "Körperkreislauf = großer Kreislauf"],
  ["Arterien · Venen · Kapillaren"],
  ["Arterien → vom Herzen weg", "Körperkreislauf: linke Herzkammer → Aorta → Arterien → Arteriolen", "Dabei: sauerstoffreiches Blut"],
  ["Tunica interna: innen; direkt am Blut", "Tunica media: Mitte; glatte Muskelzellen", "Tunica externa: außen; Bindegewebe + elastische Fasern"],
  ["In den Kapillaren", "Sauerstoff + Nährstoffe → Zellen", "Abfallstoffe → Blut"],
  ["Aorta = Hauptschlagader; größte Arterie"],
  ["Aorta = Hauptschlagader", "Aorta ascendens = aufsteigender Teil", "Aortenklappe: zwischen linker Herzkammer und Aorta"],
  ["Kapillaren → Venolen → Venen", "→ obere/untere Hohlvene → rechter Vorhof", "Dabei: sauerstoffarmes Blut"],
  ["Blut → Zellen: Sauerstoff + Nährstoffe", "Zellen → Blut: Kohlendioxid + andere Abfallstoffe"],
  ["Gegenüber Arterien: stärkere Außenschicht; schwächere Muskelschicht", "Innenschicht: Taschenklappen in vielen kleinen/mittelgroßen Venen"],
  ["Muskelanspannung → Druck auf Venen → Blut zum Herzen", "Venenklappen → kein Zurückfließen"],
  ["Gesund: Klappen dicht → kein Rückfluss", "Krank im Bild: Klappen undicht → Blut zurück"],
  ["Tiefe Venen", "Oberflächliche Venen", "Perforansvenen → Verbindung zwischen beiden"],
  ["Winzige Blutgefäße; meist nur im Mikroskop sichtbar", "Verbindung: Arteriolen → Kapillaren → Venolen"],
  ["Viel Sauerstoff nötig → dichtes Netz", "Wenig Sauerstoff nötig → größere Abstände"],
  ["Sauerstoffreich: linke Herzkammer → Aorta → Arterien → Körperkapillaren", "Dort: Sauerstoff + Nährstoffe zu den Zellen; Kohlendioxid + Abfallstoffe ins Blut", "Sauerstoffarm: Venen → beide Hohlvenen → rechter Vorhof"],
  ["Sauerstoffarm: rechte Herzkammer → Lungenarterien → Lunge", "Dort: Kohlendioxid abgeben; Sauerstoff aufnehmen", "Sauerstoffreich: Lungenvenen → linker Vorhof"]
];

if (nerveCirculationShortAnswers.length !== nerveCirculationCards.length) {
  throw new Error("Original und 2.0 müssen dieselben Karten enthalten.");
}
const nerveCirculationShort = Object.fromEntries(nerveCirculationCards.map((card, index) => [
  card.id, { answer: nerveCirculationShortAnswers[index] }
]));
