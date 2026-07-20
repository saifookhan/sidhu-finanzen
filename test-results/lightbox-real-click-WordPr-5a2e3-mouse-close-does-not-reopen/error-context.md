# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lightbox-real-click.spec.ts >> WordPress iframe lightbox – real clicks >> masonry image: real mouse close does not reopen
- Location: tests/lightbox-real-click.spec.ts:4:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#sidhu-parent-lightbox-host')
Expected: 0
Received: 1
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('#sidhu-parent-lightbox-host')
    14 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - region "Diese Webseite verwendet Cookies" [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e5]:
        - heading "Diese Webseite verwendet Cookies" [level=2] [ref=e6]
        - generic [ref=e7]:
          - generic [ref=e8]:
            - paragraph [ref=e9]: Um Ihnen ein optimales Nutzererlebnis zu bieten und den Betrieb unserer Webseite sicherzustellen, werden Cookies zu Funktions- und Marketingzwecken verwendet. Dies beinhaltet auch die Erhebung, Weitergabe und Nutzung von personenbezogenen Daten zur Personalisierung von Werbeanzeigen. Ihre Zustimmung schließt außerdem den Einsatz von Drittanbietern oder externen Unternehmen ein, die ihren Sitz in einem Land haben, das kein der EU/EWR vergleichbares Datenschutzniveau gewährleistet.
            - paragraph [ref=e10]:
              - text: Mit Klick auf "Alle akzeptieren" erklären Sie sich damit einverstanden, dass wir solche Technologien verwenden dürfen. Unter "Einstellungen" können Sie selbst entscheiden, welche Cookies Sie zulassen. Sie können Ihre Einstellungen jederzeit ändern oder Ihre Zustimmung widerrufen. Unsere Datenschutzerklärung dazu finden Sie
              - link "hier" [ref=e11] [cursor=pointer]:
                - /url: https://sidhu-finanzen.de/datenschutzerklaerung/
              - text: .
          - generic [ref=e12]:
            - button "Einstellungen" [ref=e13] [cursor=pointer]
            - button "Ablehnen" [ref=e14] [cursor=pointer]
            - button "Alle akzeptieren" [ref=e15] [cursor=pointer]
      - generic [ref=e18]:
        - text: Powered by
        - link "Visit CookieYes website" [ref=e19] [cursor=pointer]:
          - /url: https://www.cookieyes.com/product/cookie-consent/?ref=cypbcyb&utm_source=cookie-banner&utm_medium=fl-branding
          - img [ref=e20]
  - generic [ref=e34]:
    - link "Skip to content" [ref=e35] [cursor=pointer]:
      - /url: "#content_skip_link_anchor"
    - link "Skip to footer" [ref=e36] [cursor=pointer]:
      - /url: "#footer_skip_link_anchor"
    - banner [ref=e37]:
      - generic [ref=e39]:
        - link "Sidhu-Finanzen" [ref=e43] [cursor=pointer]:
          - /url: https://sidhu-finanzen.de/
          - img "Sidhu-Finanzen" [ref=e44]
        - generic [ref=e49]:
          - list [ref=e51]:
            - listitem [ref=e52]:
              - link "Startseite" [ref=e53] [cursor=pointer]:
                - /url: https://sidhu-finanzen.de/
                - generic [ref=e54]: Startseite
            - listitem [ref=e55]:
              - link "Über Uns" [ref=e56] [cursor=pointer]:
                - /url: https://sidhu-finanzen.de/ueber-uns/
                - generic [ref=e57]: Über Uns
            - listitem [ref=e58]:
              - link "Immobilien" [ref=e59] [cursor=pointer]:
                - /url: "#"
                - generic [ref=e60]:
                  - text: Immobilien
                  - img [ref=e62]
            - listitem [ref=e64]:
              - link "Leistungen" [ref=e65] [cursor=pointer]:
                - /url: "#"
                - generic [ref=e66]:
                  - text: Leistungen
                  - img [ref=e68]
            - listitem [ref=e70]:
              - link "Kreditrechner" [ref=e71] [cursor=pointer]:
                - /url: https://sidhu-finanzen.de/rechner/
                - generic [ref=e72]: Kreditrechner
            - listitem [ref=e73]:
              - link "Dokumente" [ref=e74] [cursor=pointer]:
                - /url: https://sidhu-finanzen.de/dokumente/
                - generic [ref=e75]: Dokumente
            - listitem [ref=e76]:
              - link "Kontakt" [ref=e77] [cursor=pointer]:
                - /url: https://sidhu-finanzen.de/kontakt/
                - generic [ref=e78]: Kontakt
          - generic:
            - button "Close Menu":
              - img
              - generic: Close
            - generic:
              - list:
                - listitem:
                  - link "Startseite":
                    - /url: https://sidhu-finanzen.de/
                    - generic: Startseite
                - listitem:
                  - link "Über Uns":
                    - /url: https://sidhu-finanzen.de/ueber-uns/
                    - generic: Über Uns
                - listitem:
                  - link "Immobilien":
                    - /url: "#"
                    - generic:
                      - text: Immobilien
                      - generic:
                        - img
                - listitem:
                  - link "Leistungen":
                    - /url: "#"
                    - generic:
                      - text: Leistungen
                      - generic:
                        - img
                - listitem:
                  - link "Kreditrechner":
                    - /url: https://sidhu-finanzen.de/rechner/
                    - generic: Kreditrechner
                - listitem:
                  - link "Dokumente":
                    - /url: https://sidhu-finanzen.de/dokumente/
                    - generic: Dokumente
                - listitem:
                  - link "Kontakt":
                    - /url: https://sidhu-finanzen.de/kontakt/
                    - generic: Kontakt
        - generic [ref=e79]:
          - list [ref=e83]:
            - listitem [ref=e84]:
              - link "+49 40 32 899 063" [ref=e85] [cursor=pointer]:
                - /url: tel:+494032899063
                - img [ref=e88]
                - heading "+49 40 32 899 063" [level=6] [ref=e92]
          - link "Kontakt" [ref=e96] [cursor=pointer]:
            - /url: https://sidhu-finanzen.de/kontakt/
            - generic [ref=e98]: Kontakt
    - article [ref=e102]:
      - generic [ref=e104]:
        - generic [ref=e105]:
          - generic [ref=e106]:
            - heading "Jetzt einen Termin vereinbaren" [level=6] [ref=e109]:
              - link "Jetzt einen" [ref=e110] [cursor=pointer]:
                - /url: https://sidhu-finanzen.de/kontakt/
              - link "Termin vereinbaren" [ref=e111] [cursor=pointer]:
                - /url: https://sidhu-finanzen.de/kontakt/
            - link [ref=e115] [cursor=pointer]:
              - /url: https://sidhu-finanzen.de/kontakt/
              - img [ref=e116]
          - iframe [ref=e120]:
            - generic [active] [ref=f1e1]:
              - main [ref=f1e2]:
                - link "Alle anzeigen" [ref=f1e5] [cursor=pointer]:
                  - /url: /immobilien/kaufen
                - generic [ref=f1e7]:
                  - generic [ref=f1e9]:
                    - generic [ref=f1e11]:
                      - button "Bild in Vollbild öffnen" [ref=f1e12]:
                        - img "Treppenhaus" [ref=f1e13]
                      - paragraph: Treppenhaus
                    - generic [ref=f1e15]:
                      - button "Bild in Vollbild öffnen" [ref=f1e16]:
                        - img "Büro 1" [ref=f1e17]
                      - paragraph: Büro 1
                    - generic [ref=f1e19]:
                      - button "Bild in Vollbild öffnen" [ref=f1e20]:
                        - img "Büro 2" [ref=f1e21]
                      - paragraph: Büro 2
                    - generic [ref=f1e23]:
                      - button "Bild in Vollbild öffnen" [ref=f1e24]:
                        - img "Büro 3" [ref=f1e25]
                      - paragraph: Büro 3
                    - generic [ref=f1e27]:
                      - button "Bild in Vollbild öffnen" [ref=f1e28]:
                        - img "Büro 4" [ref=f1e29]
                      - paragraph: Büro 4
                    - generic [ref=f1e31]:
                      - button "Bild in Vollbild öffnen" [ref=f1e32]:
                        - img "Abstellraum" [ref=f1e33]
                      - paragraph: Abstellraum
                    - generic [ref=f1e35]:
                      - button "Bild in Vollbild öffnen" [ref=f1e36]:
                        - img "WhatsApp Image 2026-04-17 at 21.11.20(2)" [ref=f1e37]
                      - paragraph: WhatsApp Image 2026-04-17 at 21.11.20(2)
                    - generic [ref=f1e39]:
                      - button "Bild in Vollbild öffnen" [ref=f1e40]:
                        - img "Pentyküche" [ref=f1e41]
                      - paragraph: Pentyküche
                    - generic [ref=f1e43]:
                      - button "Bild in Vollbild öffnen" [ref=f1e44]:
                        - img "WhatsApp Image 2026-04-17 at 21.11.20" [ref=f1e45]
                      - paragraph: WhatsApp Image 2026-04-17 at 21.11.20
                  - button "Vorheriges Bild" [ref=f1e46]:
                    - img [ref=f1e47]
                  - button "Nächstes Bild" [ref=f1e49]:
                    - img [ref=f1e50]
                  - generic [ref=f1e52]: 1 / 9
                - generic [ref=f1e54]:
                  - article [ref=f1e56]:
                    - generic [ref=f1e57]:
                      - generic [ref=f1e58]:
                        - generic [ref=f1e59]:
                          - heading "Attraktive Bürofläche zu vermieten – nahe A7 und Flughafen" [level=1] [ref=f1e60]
                          - paragraph [ref=f1e61]:
                            - text: Standort
                            - text: 22850 / Norderstedt / Garstedt / Stettiner Str
                        - generic [ref=f1e62]:
                          - generic [ref=f1e63]:
                            - paragraph [ref=f1e64]: Kaufpreis
                            - paragraph [ref=f1e65]: 0 EUR
                          - generic [ref=f1e66]:
                            - paragraph [ref=f1e67]: Zimmer
                            - paragraph [ref=f1e68]: "4"
                          - generic [ref=f1e69]:
                            - paragraph [ref=f1e70]: Wohnfläche
                            - paragraph [ref=f1e71]: ca. 0 m²
                      - generic [ref=f1e72]:
                        - heading "Objektbeschreibung" [level=2] [ref=f1e73]
                        - paragraph [ref=f1e74]: In zentraler Lage von Norderstedt / Garstedt präsentiert sich dieses Bürohaus zur Miete als attraktive Gewerbeeinheit für Unternehmen, die auf eine gut erreichbare und funktionale Arbeitsumgebung Wert legen. Die Immobilie umfasst insgesamt vier Zimmer und bietet damit eine flexible Raumaufteilung, die sich ideal für klassische Büronutzungen, Praxisräume oder andere gewerbliche Konzepte eignet. Die Ausstattung ist einfach gehalten und überzeugt vor allem durch ihre zweckmäßige Gestaltung. Dadurch eignet sich die Fläche insbesondere für Mieter, die eine solide und wirtschaftliche Lösung in gefragter Lage suchen. Dank der guten Erreichbarkeit innerhalb von Garstedt bietet der Standort optimale Voraussetzungen für Mitarbeiter, Kunden und Geschäftspartner. Dieses Bürohaus in Norderstedt / Garstedt stellt eine interessante Mietoption für Unternehmen dar, die eine praktische Gewerbeimmobilie mit vielseitigen Nutzungsmöglichkeiten suchen.
                      - generic [ref=f1e76]:
                        - button "Treppenhaus" [ref=f1e77]:
                          - img "Treppenhaus" [ref=f1e78]
                          - generic [ref=f1e79]: Treppenhaus
                        - button "Büro 1" [ref=f1e80]:
                          - img "Büro 1" [ref=f1e81]
                          - generic [ref=f1e82]: Büro 1
                        - button "Büro 2" [ref=f1e83]:
                          - img "Büro 2" [ref=f1e84]
                          - generic [ref=f1e85]: Büro 2
                        - button "Büro 3" [ref=f1e86]:
                          - img "Büro 3" [ref=f1e87]
                          - generic [ref=f1e88]: Büro 3
                        - button "Büro 4" [ref=f1e89]:
                          - img "Büro 4" [ref=f1e90]
                          - generic [ref=f1e91]: Büro 4
                        - button "Abstellraum" [ref=f1e92]:
                          - img "Abstellraum" [ref=f1e93]
                          - generic [ref=f1e94]: Abstellraum
                        - button "WhatsApp Image 2026-04-17 at 21.11.20(2)" [ref=f1e95]:
                          - img "WhatsApp Image 2026-04-17 at 21.11.20(2)" [ref=f1e96]
                          - generic [ref=f1e97]: WhatsApp Image 2026-04-17 at 21.11.20(2)
                        - button "Pentyküche" [ref=f1e98]:
                          - img "Pentyküche" [ref=f1e99]
                          - generic [ref=f1e100]: Pentyküche
                        - button "WhatsApp Image 2026-04-17 at 21.11.20" [ref=f1e101]:
                          - img "WhatsApp Image 2026-04-17 at 21.11.20" [ref=f1e102]
                          - generic [ref=f1e103]: WhatsApp Image 2026-04-17 at 21.11.20
                      - generic [ref=f1e104]:
                        - heading "Lage" [level=2] [ref=f1e105]
                        - paragraph [ref=f1e106]: "Das Bürohaus befindet sich in zentraler und gut erreichbarer Lage im beliebten Stadtteil Garstedt in Norderstedt. Die Umgebung ist geprägt von einer gewachsenen, urbanen Infrastruktur mit kurzen Wegen zu Einrichtungen des täglichen Bedarfs sowie vielfältigen Angeboten für Dienstleister, Praxen und Unternehmen. Das Stadtzentrum ist in nur wenigen Minuten erreichbar, wodurch sowohl Kunden als auch Mitarbeiter von einer ausgezeichneten Anbindung profitieren. Auch die Verkehrsanbindung ist komfortabel: Die nächstgelegene Autobahn ist gut erreichbar und ermöglicht eine schnelle Verbindung in die umliegenden Städte und die Metropolregion Hamburg. Für den täglichen Bedarf befinden sich Kindergärten, Grundschulen und weiterführende Schulen in der näheren Umgebung. Insgesamt bietet der Standort ein attraktives, professionelles Umfeld mit hoher Sichtbarkeit und guten Rahmenbedingungen für Büro- und Praxisnutzungen."
                      - generic [ref=f1e108]:
                        - heading "Karte" [level=2] [ref=f1e109]
                        - iframe [ref=f1e111]:
                          - generic [ref=f2e2]:
                            - img
                            - generic:
                              - region "Map" [ref=f2e3]
                              - button "[missing \"en-US.javascripts.map.marker.title\" translation]" [ref=f2e4]:
                                - img [ref=f2e5]
                            - generic:
                              - generic [ref=f2e8]:
                                - button "Zoom In" [ref=f2e9] [cursor=pointer]
                                - button "Zoom Out" [ref=f2e11] [cursor=pointer]
                              - group [ref=f2e13]:
                                - generic [ref=f2e14]:
                                  - text: ©
                                  - link "OpenStreetMap contributors" [ref=f2e15] [cursor=pointer]:
                                    - /url: /copyright
                                  - text: ♥️
                                  - link "Make a Donation" [ref=f2e16] [cursor=pointer]:
                                    - /url: https://supporting.openstreetmap.org
                                  - text: .
                                  - link "Website and API terms" [ref=f2e17] [cursor=pointer]:
                                    - /url: https://wiki.osmfoundation.org/wiki/Terms_of_Use
                      - generic [ref=f1e112]:
                        - heading "Objektdaten" [level=2] [ref=f1e113]
                        - generic [ref=f1e114]:
                          - generic [ref=f1e115]:
                            - term [ref=f1e116]: Standort
                            - definition [ref=f1e117]: 22850 / Norderstedt / Garstedt / Stettiner Str
                          - generic [ref=f1e118]:
                            - term [ref=f1e119]: Anzahl Zimmer
                            - definition [ref=f1e120]: "4"
                          - generic [ref=f1e121]:
                            - term [ref=f1e122]: Verfügbarkeit
                            - definition [ref=f1e123]: Verfügbar
                          - generic [ref=f1e124]:
                            - term [ref=f1e125]: Vermarktungstyp
                            - definition [ref=f1e126]: Kaufen
                  - complementary [ref=f1e127]:
                    - generic [ref=f1e129]:
                      - heading "Ihr Ansprechpartner" [level=2] [ref=f1e130]
                      - img "Herr Sidhu - Finanzberatung" [ref=f1e132]
                      - heading "Herr Sidhu - Finanzberatung" [level=3] [ref=f1e133]
                      - generic [ref=f1e134]:
                        - generic [ref=f1e135]:
                          - paragraph [ref=f1e136]: E-Mail
                          - link "kontakt@sidhu-finanzen.de" [ref=f1e137] [cursor=pointer]:
                            - /url: mailto:kontakt@sidhu-finanzen.de
                        - generic [ref=f1e138]:
                          - paragraph [ref=f1e139]: Mobil
                          - link "+49 40 32 899 063" [ref=f1e140] [cursor=pointer]:
                            - /url: tel:+494032899063
                        - link "Exposé anfordern" [ref=f1e141] [cursor=pointer]:
                          - /url: mailto:kontakt@sidhu-finanzen.de?subject=Expos%C3%A9-Anfrage%3A%20Attraktive%20B%C3%BCrofl%C3%A4che%20zu%20vermieten%20%E2%80%93%20nahe%20A7%20und%20Flughafen
              - alert [ref=f1e142]
        - generic [ref=e122]:
          - heading "Mehr Überblick, weniger Unsicherheit durch verständliche Beratung." [level=1] [ref=e126]:
            - generic [ref=e127]:
              - generic [ref=e128]: Mehr
              - generic [ref=e129]: Überblick,
            - generic [ref=e130]:
              - generic [ref=e131]: weniger
              - generic [ref=e132]: Unsicherheit
            - generic [ref=e133]:
              - generic [ref=e134]: durch
              - generic [ref=e135]: verständliche
              - generic [ref=e136]: Beratung.
          - paragraph [ref=e140]: Sidhu-Finanzen in Norderstedt steht für langjährige Erfahrung und klare Beratung. Sie erhalten verständliche und maßgeschneiderte Optionen und einen Finanzierungsvorschlag, der zu Ihrem Vorhaben passt.
        - generic [ref=e143]:
          - generic [ref=e145]:
            - heading "Sidhu-Finanzen" [level=6] [ref=e148]
            - heading "Persönlich für Sie da" [level=1] [ref=e151]
            - heading "Mit langjähriger Erfahrung begleitet Herr Sidhu Sie bei Ihrer Bau- und Immobilienfinanzierung in Norderstedt und Hamburg – transparent, strukturiert und verständlich" [level=5] [ref=e154]
          - generic [ref=e159]:
            - link [ref=e161] [cursor=pointer]:
              - /url: https://sidhu-finanzen.de/kontakt/
            - generic [ref=e162]:
              - heading "Gagandeep Singh Sidhu" [level=6] [ref=e163]
              - paragraph [ref=e164]: Ihr Baufinanzierungsspezialist in Norderstedt
    - contentinfo [ref=e165]:
      - generic [ref=e168]:
        - generic [ref=e169]:
          - paragraph [ref=e173]
          - list [ref=e177]:
            - listitem [ref=e178]:
              - link "kontakt@sidhu-finanzen.de" [ref=e179] [cursor=pointer]:
                - /url: mailto:kontakt@sidhu-finanzen.de
                - generic [ref=e180]: kontakt@sidhu-finanzen.de
            - listitem [ref=e181]:
              - link "+49 40 32 899 063" [ref=e182] [cursor=pointer]:
                - /url: tel:+494032899063
                - generic [ref=e183]: +49 40 32 899 063
          - list [ref=e187]:
            - listitem [ref=e188]:
              - link "Startseite" [ref=e189] [cursor=pointer]:
                - /url: https://sidhu-finanzen.de
                - generic [ref=e190]: Startseite
            - listitem [ref=e191]:
              - link "Über Uns" [ref=e192] [cursor=pointer]:
                - /url: https://sidhu-finanzen.de/ueber-uns/
                - generic [ref=e193]: Über Uns
            - listitem [ref=e194]:
              - link "Kontakt" [ref=e195] [cursor=pointer]:
                - /url: https://sidhu-finanzen.de/kontakt/
                - generic [ref=e196]: Kontakt
        - list [ref=e200]:
          - listitem [ref=e201]:
            - link "Baufinanzierung" [ref=e202] [cursor=pointer]:
              - /url: https://sidhu-finanzen.de/baufinanzierung/
              - generic [ref=e203]: Baufinanzierung
          - listitem [ref=e204]:
            - link "Anschlussfinanzierung" [ref=e205] [cursor=pointer]:
              - /url: https://sidhu-finanzen.de/anschlussfinanzierung/
              - generic [ref=e206]: Anschlussfinanzierung
          - listitem [ref=e207]:
            - link "Eigenes Bauvorhaben" [ref=e208] [cursor=pointer]:
              - /url: https://sidhu-finanzen.de/neubau-finanzierung/
              - generic [ref=e209]: Eigenes Bauvorhaben
          - listitem [ref=e210]:
            - link "Ratenkredit/Privatkredit" [ref=e211] [cursor=pointer]:
              - /url: https://sidhu-finanzen.de/ratenkredit/
              - generic [ref=e212]: Ratenkredit/Privatkredit
        - generic [ref=e213]:
          - paragraph [ref=e216]:
            - link "Impressum" [ref=e217] [cursor=pointer]:
              - /url: https://sidhu-finanzen.de/impressum/
            - text: "|"
            - link "Datenschutzhinweis" [ref=e218] [cursor=pointer]:
              - /url: https://sidhu-finanzen.de/datenschutzerklaerung/
          - paragraph [ref=e221]:
            - text: ©
            - link "Sidhu-Finanzen" [ref=e222] [cursor=pointer]:
              - /url: https://sidhu-finanzen.de
            - text: 2026 Alle Rechte vorbehalten.
  - button "" [ref=e223] [cursor=pointer]
  - generic [ref=e224]: desktop
  - dialog "Bildergalerie Vollbild" [ref=e226]:
    - button "Galerie schließen" [ref=e227] [cursor=pointer]: ×
    - button "Vorheriges Bild" [ref=e228] [cursor=pointer]: ←
    - button "Nächstes Bild" [ref=e229] [cursor=pointer]: →
    - generic [ref=e230]:
      - img "Treppenhaus" [ref=e231]
      - paragraph [ref=e232]: Treppenhaus · 1 / 9
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test'
  2  | 
  3  | test.describe('WordPress iframe lightbox – real clicks', () => {
  4  |   test('masonry image: real mouse close does not reopen', async ({ page }) => {
  5  |     await page.goto('https://sidhu-finanzen.de/immobilien-kaufen/?immobilie=53', {
  6  |       waitUntil: 'networkidle',
  7  |       timeout: 120_000,
  8  |     })
  9  |     await page.waitForTimeout(12_000)
  10 |     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  11 |     await page.waitForTimeout(2_000)
  12 | 
  13 |     const iframe = page.frameLocator('#sidhu-properties-kaufen')
  14 |     const masonryButton = iframe.locator('button[aria-label^="Bild "]').last()
  15 |     await masonryButton.click({ timeout: 60_000, force: true })
  16 |     await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(1)
  17 | 
  18 |     const hostBox = await page.locator('#sidhu-parent-lightbox-host').boundingBox()
  19 |     expect(hostBox).toBeTruthy()
  20 | 
  21 |     // Real mouse click on backdrop area (not on image center)
  22 |     if (hostBox) {
  23 |       await page.mouse.click(hostBox.x + 20, hostBox.y + hostBox.height / 2)
  24 |     }
  25 | 
  26 |     await page.waitForTimeout(500)
> 27 |     await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(0)
     |                                                               ^ Error: expect(locator).toHaveCount(expected) failed
  28 | 
  29 |     await page.waitForTimeout(3_000)
  30 |     const hostCount = await page.locator('#sidhu-parent-lightbox-host').count()
  31 |     expect(hostCount).toBe(0)
  32 |   })
  33 | 
  34 |   test('slideshow: real mouse close via X button does not reopen', async ({ page }) => {
  35 |     await page.goto('https://sidhu-finanzen.de/immobilien-kaufen/?immobilie=53', {
  36 |       waitUntil: 'networkidle',
  37 |       timeout: 120_000,
  38 |     })
  39 |     await page.waitForTimeout(12_000)
  40 | 
  41 |     const iframe = page.frameLocator('#sidhu-properties-kaufen')
  42 |     await iframe.locator('button[aria-label="Bild in Vollbild öffnen"]').first().click({
  43 |       timeout: 60_000,
  44 |     })
  45 |     await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(1)
  46 | 
  47 |     const closeBox = await page.locator('#sidhu-parent-lightbox-host').first().evaluate((el) => {
  48 |       const btn = el.shadowRoot?.querySelector('.close')
  49 |       if (!(btn instanceof HTMLElement)) return null
  50 |       const rect = btn.getBoundingClientRect()
  51 |       return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
  52 |     })
  53 | 
  54 |     expect(closeBox).toBeTruthy()
  55 |     if (closeBox) {
  56 |       await page.mouse.click(closeBox.x, closeBox.y)
  57 |     }
  58 | 
  59 |     await page.waitForTimeout(500)
  60 |     await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(0)
  61 | 
  62 |     await page.waitForTimeout(3_000)
  63 |     await expect(page.locator('#sidhu-parent-lightbox-host')).toHaveCount(0)
  64 |   })
  65 | 
  66 |   test('only one lightbox script initializer is active', async ({ page }) => {
  67 |     await page.goto('https://sidhu-finanzen.de/immobilien-kaufen/?immobilie=53', {
  68 |       waitUntil: 'networkidle',
  69 |       timeout: 120_000,
  70 |     })
  71 |     await page.waitForTimeout(8_000)
  72 | 
  73 |     const initFlag = await page.evaluate(() => {
  74 |       return (window as Window & { __sidhuIframeLightboxInitialized?: boolean })
  75 |         .__sidhuIframeLightboxInitialized
  76 |     })
  77 |     expect(initFlag).toBe(true)
  78 | 
  79 |     const scriptCount = await page.evaluate(() => {
  80 |       return Array.from(document.querySelectorAll('script[src*="sidhu-iframe-lightbox"]')).length
  81 |     })
  82 |     expect(scriptCount).toBeGreaterThan(0)
  83 |   })
  84 | })
  85 | 
```