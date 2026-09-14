// Same 37 cards and IDs; only the optional learning text changes.
const nerveCirculationShortAnswers = [
  ["Beginnt am Hinterhauptloch, als Fortsetzung des verlängerten Marks.", "Verläuft im Wirbelkanal bis etwa zum 1.–2. Lendenwirbel; etwa 1 cm dick."],
  ["Hals-, Brust-, Lenden-, Kreuzbein- und Steißbeinabschnitte."],
  ["Innen graue Substanz mit Nervenzellkörpern.", "Außen weiße Substanz mit Nervenfasern für Signale nach oben und unten."],
  ["Im Vorderhorn motorische Nervenzellen für Muskelbewegungen.", "Am Hinterhorn ankommende sensible Signale, etwa Berührung und Schmerz."],
  ["31 Paare Spinalnerven", "12 Paare Hirnnerven"],
  ["Versorgen Kopf, Hals und viele innere Organe.", "Verbinden die Sinnesorgane mit dem Gehirn."],
  ["V (5.) N. trigeminus, der Drillingsnerv, für Gefühl im Gesicht und Kaumuskeln.", "VII (7.) N. facialis, der Gesichtsnerv, für die Mimik."],
  ["V (5.) N. trigeminus, der Drillingsnerv.", "VII (7.) N. facialis, der Gesichtsnerv."],
  ["Augenhöhlennerv (N. ophthalmicus)", "Oberkiefernerv (N. maxillaris)", "Unterkiefernerv (N. mandibularis)"],
  ["Oberkiefernerv (N. maxillaris) für Oberkieferzähne.", "Unterkiefernerv (N. mandibularis) für Unterkieferzähne, dortiges Zahnfleisch und Unterlippe."],
  ["VII (7.) N. facialis, der Gesichtsnerv.", "Steuert die mimische Muskulatur für den Gesichtsausdruck."],
  ["Regelt Atmung, Kreislauf und Stoffwechsel weitgehend automatisch."],
  ["Sympathikus und Parasympathikus."],
  ["Sympathikus bei körperlicher Arbeit und Stress.", "Parasympathikus bei Ruhe, Essen, Verdauung und Ausscheidung."],
  ["Der Sympathikus erweitert Pupillen und Bronchien, beschleunigt das Herz und bremst die Verdauung.", "Der Parasympathikus verengt Pupillen und Bronchien, verlangsamt das Herz und fördert die Verdauung."],
  ["Der Sympathikus fördert die Füllung von Gallenblase und Harnblase und hemmt die Entleerung.", "Der Parasympathikus fördert ihre Entleerung."],
  ["Sympathikus bei Stress und Anspannung.", "Parasympathikus bei Ruhe, Essen, Verdauung und Ausscheidung."],
  ["Braucht sehr viel Sauerstoff.", "Schon wenige Minuten ohne Sauerstoff können bleibende Schäden verursachen."],
  ["Über Arterien an der Hirnbasis"],
  ["Herz und Blutgefäße zusammen; auch kardiovaskuläres System genannt."],
  ["Den kleinen Lungenkreislauf und den großen Körperkreislauf."],
  ["Arterien, Venen und Kapillaren."],
  ["Arterien führen Blut vom Herzen weg.", "Im Körper sauerstoffreich, von der linken Herzkammer über Aorta und Arterien zu den Arteriolen."],
  ["Tunica interna innen, direkt am Blut.", "Tunica media in der Mitte, mit glatten Muskelzellen.", "Tunica externa außen, mit Bindegewebe und elastischen Fasern."],
  ["In den Kapillaren.", "Sauerstoff und Nährstoffe zu den Zellen, Abfallstoffe ins Blut."],
  ["Aorta, die Hauptschlagader und größte Arterie."],
  ["Aorta, die Hauptschlagader, und Aorta ascendens, ihr aufsteigender Teil.", "Aortenklappe zwischen linker Herzkammer und Aorta."],
  ["Sauerstoffarm aus den Kapillaren über Venolen und Venen.", "Dann über obere und untere Hohlvene in den rechten Vorhof."],
  ["Die Zellen bekommen Sauerstoff und Nährstoffe.", "Kohlendioxid und andere Abfallstoffe gehen ins Blut."],
  ["Stärkere Außenschicht und schwächere Muskelschicht als bei Arterien.", "Die Innenschicht bildet Taschenklappen in vielen kleinen und mittelgroßen Venen."],
  ["Angespannte Muskeln drücken auf Venen und schieben Blut zum Herzen.", "Die Klappen verhindern das Zurückfließen."],
  ["Bei gesunden Venen schließen die Klappen dicht, ohne Rückfluss.", "Bei der kranken Vene im Bild schließen sie nicht richtig; Blut fließt zurück."],
  ["Tiefe und oberflächliche Venen.", "Perforansvenen verbinden beide."],
  ["Winzige Blutgefäße, meist nur im Mikroskop sichtbar.", "Verbinden Arteriolen mit Venolen."],
  ["Bei hohem Sauerstoffbedarf ein dichtes Netz.", "Bei geringem Bedarf mehr Abstand zwischen den Kapillaren."],
  ["Sauerstoffreich aus der linken Herzkammer über Aorta und Arterien in die Körperkapillaren.", "Dort Sauerstoff und Nährstoffe abgeben, Kohlendioxid und Abfallstoffe aufnehmen.", "Sauerstoffarm über Venen und beide Hohlvenen zurück in den rechten Vorhof."],
  ["Sauerstoffarm aus der rechten Herzkammer über die Lungenarterien zur Lunge.", "Dort Kohlendioxid abgeben und Sauerstoff aufnehmen.", "Sauerstoffreich über die Lungenvenen zurück in den linken Vorhof."]
];

if (nerveCirculationShortAnswers.length !== nerveCirculationCards.length) {
  throw new Error("Original und 2.0 müssen dieselben Karten enthalten.");
}
const nerveCirculationShort = Object.fromEntries(nerveCirculationCards.map((card, index) => [
  card.id, { answer: nerveCirculationShortAnswers[index] }
]));
