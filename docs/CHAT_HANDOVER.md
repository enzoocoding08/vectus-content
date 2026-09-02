# Vectus Lern — Chat-Übergabe

Stand: 25.08.2026, Europe/Vienna

Diese Datei bewahrt den handlungsrelevanten Kontext des bisherigen Chats. Vor der Content-Produktion vollständig lesen. Die ausführliche Video- und Pipeline-Spezifikation steht in VIDEO_PIPELINE_CONTEXT.md.

## Verbindlicher Instagram-Standard

Vor jeder Planung, Erstellung, Bearbeitung, Freigabe oder Veröffentlichung eines Social-Media-Posts muss `instagram_growth_content_system.md` vollständig gelesen werden. Diese Datei ist der verbindliche Standard für Instagram-Strategie, Aufbau, Gestaltung, Captions, Qualitätskontrolle und Publishing. Das gilt ausdrücklich auch für jeden neuen Chat und jede automatisierte Post-Erstellung; nicht aus Erinnerung oder ausschließlich aus älteren Templates arbeiten.

## Ziel und Positionierung

Aufgebaut wird ein faceless Social-Media-Account für die Lern-App **Vectus Lern**, zuerst Instagram Reels, später TikTok und YouTube Shorts. Der Account soll gleichzeitig nützlichen Lerncontent und Produktwachstum liefern. Schüler und Studierende sind der Kern; Productivity-, Brain-Hacking- und Biohacking-Interessierte werden über Hooks und Kognitionswissenschaft mit angesprochen.

App und Account heißen **Vectus Lern**. Vectus ist die Wortmarke, Lern Claim/Sub-Tag. Der Ton kombiniert provokante Hooks mit echten Inhalten zu Active Recall, Spaced Repetition und Kognitionswissenschaft. Kein substanzloses Clickbait und kein generischer KI-Study-Content.

## Bestätigte Content-Säulen

1. Hook-/Faktenposts und Karussells über Lernen und Gehirn.
2. Feature-Posts, die konkret zeigen, was Vectus Lern macht.
3. Reichweiten-Reels aus passender B-Roll, Voiceover, Captions und echten App-Aufnahmen.

Die ausführlichen Themen, Templates, Schnittregeln und Architektur stehen in VIDEO_PIPELINE_CONTEXT.md.

## Beschriebene Brand-Richtung

- Tiefschwarzer Hintergrund mit gelben, grünen und pinken Akzenten.
- Modern, intelligent, provokant, glaubwürdig und bewusst gestaltet.
- Profilbild: Blitz-/Spark-Mark als Brain-/Aha-Assoziation, Gelb→Pink→Grün-Verlauf, Sicherheitsabstand für runden Instagram-Crop.
- Flaggschiff-Post: „Dein Gehirn ist nicht das Problem. Deine Lernmethode ist es.“
- Nur Schlüsselwörter gezielt einfärben.
- Credibility-Chips: Active Recall, Spaced Repetition, Kognitionswissenschaft.
- Wortmarke: VECTUS Lern.

Der Nutzer bewertete diese Richtung mit „perfekt“. Die tatsächlichen Referenzbilder sind im Repository noch **nicht bestätigt vorhanden**. Vor pixelgenauer Reproduktion assets/brand und Chat-Anhänge prüfen oder Profilbild, Flaggschiff-Post, Logo, Fonts und App-Screenshot anfordern. Danach exakte Hex-Farben, Typografie, Abstände, Chip-Geometrie, Gradients, Safe Zones und Reel-Cover dokumentieren.

## Erster Reel-Entwurf

Gewünscht war ein circa 60-sekündiges erstes Reel mit Pexels-Footage und ElevenLabs-Stimme.

Voiceover:

> Du liest deine Zusammenfassung. Denkst: passt schon. Und in der Prüfung? Nichts.
>
> Das Problem ist nicht dein Gehirn — es ist deine Lernmethode.
>
> Wiederlesen fühlt sich an wie Lernen. Ist es aber nicht.
>
> Was wirklich hilft: Active Recall. Wissen selbst aus dem Kopf holen, bevor du nachschaust.
>
> Und Spaced Repetition — ein Thema kommt genau dann wieder, wenn du kurz davor bist, es zu vergessen. Nicht früher, nicht später.
>
> Genau das macht Vectus Lern automatisch für dich. Material hochladen — die App weiß, was heute fällig ist.
>
> Folg uns für mehr echte Lernwissenschaft.

| Zeit | Stock-Suchintention | Caption |
|---|---|---|
| 0–5 s | student frustrated studying notes | „Du liest deine Notizen. Wieder.“ |
| 5–15 s | highlighting textbook close up | „Fühlt sich an wie Lernen.“ |
| 15–25 s | person closing eyes thinking recall | „Active Recall.“ in Gelb |
| 25–35 s | calendar planner desk | „Spaced Repetition.“ in Pink |
| 35–45 s | phone app typing hand | „Vectus Lern macht das automatisch.“ |
| 45–60 s | student smiling confident exam | „Folgen für mehr →“ plus Wortmarke |

Das ist ein **Entwurf**, keine endgültige Creative-Entscheidung. Sobald das Produkt relevant wird, echte Vectus-Aufnahmen verwenden. Insbesondere 35–45 s möglichst durch echtes App-Screenrecording ersetzen.

## Pexels- und ElevenLabs-Historie

In einer früheren Umgebung wurden Pexels durch eine Netzwerk-Policy und ElevenLabs durch eine getrennte Verbindung blockiert. Als Fallback wurden sechs manuell heruntergeladene vertikale MP4-Clips passend zum Shotplan vorgeschlagen, idealerweise 1080×1920, ausreichend lang und als clip1.mp4 bis clip6.mp4 benannt.

Diese Blocker waren **umgebungsspezifisch und dürfen nicht als aktuell angenommen werden**. Aktuelle Verbindung und Credentials zuerst testen. Keine Secrets ausgeben oder committen; .env.example darf nur leere Platzhalter enthalten. Für jedes Asset Herkunft und Lizenz über templates/asset.metadata.json speichern.

Für ElevenLabs sind noch keine Stimme, Voice-ID, Aussprachevorgaben oder erzeugte Audiodatei bestätigt. Vor Produktion Zugang, deutsche Sprechweise und Aussprache von „Vectus“ klären.

## Im Repository bereits erledigt

- Agent-Einstiege AGENTS.md und CLAUDE.md.
- Ausführlicher Pipeline-Kontext in docs/VIDEO_PIPELINE_CONTEXT.md.
- Geordnete wiederverwendbare Assets und posts/_template.
- Vorlagen für Asset-Provenienz und neutrale EDL.
- Diese Chat-Übergabe.

Die JSON-Vorlagen wurden bei Erstellung syntaktisch validiert.

## Noch nicht erledigt

- Kein fertiger Post oder Reel wurde hier gerendert.
- Keine Stock-Clips wurden hier gefetcht.
- Kein ElevenLabs-Voiceover wurde hier erzeugt.
- Kein exaktes Brand-Referenzbild ist hier bestätigt.
- Logo, Fonts, Hex-Farben und App-Footage sind nicht final bestätigt.
- Aus diesem Repository wurde nichts veröffentlicht.

Diese Punkte nie ohne Datei- oder External-State-Beleg als erledigt melden.

## Empfohlener nächster Schritt

Profilbild und Flaggschiff-Post finden oder anfordern und daraus zuerst das exakte Designsystem ableiten. Danach App-Screenrecording und ElevenLabs-Stimme klären, einen Post aus posts/_template anlegen, Script und EDL finalisieren, lizenzierte B-Roll besorgen und einen Review-Draft rendern.

Bei Bildern und Covers nach vorhandener Referenz exakt dasselbe Layout nutzen. Im Reel dieses System für Hook Cards, Captions, Aha Cards und End Card einsetzen, dazwischen Motion-Footage und echten App-Beweis zeigen; kein Slideshow-Reel aus generierten Standbildern.
