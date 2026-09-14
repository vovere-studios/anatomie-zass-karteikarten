// Same 37 cards and IDs; only the optional learning text changes.
const nerveCirculationShortAnswers = [
  ["Vom Hinterhauptloch bis etwa zum 1.–2. Lendenwirbel.", "Oben mit dem verlängerten Mark verbunden.", "Im Wirbelkanal, etwa 1 cm dick."],
  ["Hals-, Brust-, Lenden-, Kreuzbein- und Steißbeinabschnitte."],
  ["Innen graue Substanz mit Nervenzellkörpern.", "Außen weiße Substanz mit Nervenfasern für Signale nach oben und unten."],
  ["Nervenzellen im Vorderhorn steuern Muskeln (motorisch).", "Das Hinterhorn empfängt z. B. Berührung und Schmerz (sensibel)."],
  ["31 Paare Spinalnerven", "12 Paare Hirnnerven"],
  ["Versorgen Kopf, Hals und viele innere Organe.", "Verbinden die Sinnesorgane mit dem Gehirn."],
  ["V (5.) N. trigeminus, der Drillingsnerv, für Gefühl im Gesicht und Kaumuskeln.", "VII (7.) N. facialis, der Gesichtsnerv, für die Mimik."],
  ["V (5.) N. trigeminus, der Drillingsnerv.", "VII (7.) N. facialis, der Gesichtsnerv."],
  ["Augenhöhlennerv (N. ophthalmicus)", "Oberkiefernerv (N. maxillaris)", "Unterkiefernerv (N. mandibularis)"],
  ["Oberkiefernerv (N. maxillaris) für die Zähne oben.", "Unterkiefernerv (N. mandibularis) für Zähne und Zahnfleisch unten und die Unterlippe."],
  ["VII (7.) N. facialis, der Gesichtsnerv.", "Steuert die mimische Muskulatur für den Gesichtsausdruck."],
  ["Regelt Atmung, Kreislauf und Stoffwechsel meist automatisch."],
  ["Sympathikus und Parasympathikus."],
  ["Sympathikus bei körperlicher Arbeit und Stress.", "Parasympathikus bei Ruhe, Essen, Verdauung und Ausscheidung."],
  ["Sympathikus macht Pupillen und Bronchien weiter. Das Herz schlägt schneller, die Verdauung wird gebremst.", "Parasympathikus macht Pupillen und Bronchien enger. Das Herz schlägt langsamer, die Verdauung wird angeregt."],
  ["Beim Sympathikus füllen sich Gallenblase und Harnblase; sie leeren sich weniger.", "Der Parasympathikus hilft beiden beim Entleeren."],
  ["Sympathikus bei Stress und Anspannung.", "Parasympathikus bei Ruhe, Essen, Verdauung und Ausscheidung."],
  ["Braucht sehr viel Sauerstoff.", "Wenige Minuten ohne Sauerstoff können das Gehirn dauerhaft schädigen."],
  ["Über Arterien unten am Gehirn (Hirnbasis)."],
  ["Herz und Blutgefäße; auch kardiovaskuläres System genannt."],
  ["Den kleinen Lungenkreislauf und den großen Körperkreislauf."],
  ["Arterien, Venen und Kapillaren."],
  ["Arterien führen Blut vom Herzen weg.", "Von der linken Herzkammer über Aorta und Arterien zu den Arteriolen.", "Im Körper mit viel Sauerstoff."],
  ["Tunica interna innen, direkt am Blut.", "Tunica media in der Mitte, mit glatten Muskelzellen.", "Tunica externa außen, mit Bindegewebe und elastischen Fasern."],
  ["In den Kapillaren.", "Sauerstoff und Nährstoffe zu den Zellen, Abfallstoffe ins Blut."],
  ["Aorta, die Hauptschlagader und größte Arterie."],
  ["Aorta heißt Hauptschlagader.", "Aorta ascendens ist der Teil, der nach oben führt.", "Aortenklappe zwischen linker Herzkammer und Aorta."],
  ["Aus den Kapillaren über Venolen und Venen.", "Über obere und untere Hohlvene in den rechten Vorhof.", "Jetzt mit wenig Sauerstoff."],
  ["Die Zellen bekommen Sauerstoff und Nährstoffe.", "Kohlendioxid und andere Abfallstoffe gehen ins Blut."],
  ["Außen dicker, die Muskelschicht dünner als bei Arterien.", "Die innere Schicht bildet Taschenklappen in vielen kleinen und mittelgroßen Venen."],
  ["Angespannte Muskeln drücken auf Venen und schieben Blut zum Herzen.", "Die Klappen verhindern das Zurückfließen."],
  ["Gesunde Klappen schließen dicht. Kein Blut fließt zurück.", "Die kranken Klappen im Bild sind undicht. Blut fließt zurück."],
  ["Tiefe und oberflächliche Venen.", "Perforansvenen verbinden beide."],
  ["Winzige Blutgefäße, meist nur im Mikroskop sichtbar.", "Verbinden Arteriolen mit Venolen."],
  ["Viel Sauerstoff nötig, also ein dichtes Netz.", "Wenig Sauerstoff nötig, also größere Abstände."],
  ["Von der linken Herzkammer über Aorta und Arterien in die Körperkapillaren, mit viel Sauerstoff.", "Dort Sauerstoff und Nährstoffe abgeben, Kohlendioxid und Abfallstoffe aufnehmen.", "Über Venen und beide Hohlvenen in den rechten Vorhof, jetzt mit wenig Sauerstoff."],
  ["Von der rechten Herzkammer über die Lungenarterien zur Lunge, mit wenig Sauerstoff.", "Dort Kohlendioxid abgeben und Sauerstoff aufnehmen.", "Über die Lungenvenen in den linken Vorhof, jetzt mit viel Sauerstoff."]
];

if (nerveCirculationShortAnswers.length !== nerveCirculationCards.length) {
  throw new Error("Original und 2.0 müssen dieselben Karten enthalten.");
}
const nerveCirculationShort = Object.fromEntries(nerveCirculationCards.map((card, index) => [
  card.id, { answer: nerveCirculationShortAnswers[index] }
]));
