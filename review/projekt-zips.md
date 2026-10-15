# Finale editierbare Projekt-ZIPs M00-M15 (Suche in Claude-Chats, Stand 2026-10-15)

Ergebnis: Nur M01 und M02 haben eine abrufbare cloudfront-URL. M00 und M03-M15 wurden ausschliesslich per SendUserFile (Chat-Anhang) ausgeliefert, bei M10 zusaetzlich per device_commit_files nach C:\Users\User\Downloads\M10\. Dafuer gibt es keine URL. Die cloudfront-ZIPs, die in M04-M15 und M00 vorkommen, sind VO-/Foto-Pakete (Voiceover + Bilder), NICHT das Projekt.

| Modul | URL | Dateiname | Zeitpunkt/Hinweis |
|---|---|---|---|
| M00 | keine URL | M00_Einfuehrung_Projekt_editierbar.zip | Nur SendUserFile (finale Fassung DE+SQ, 12.10.2026, nach finalem Render und Mux). Chat 7343aff4. |
| M01 | https://d2ol7oe51mr4n9.cloudfront.net/user_36ntZRWa9ocirMjfn8Y3D3TgkXT/36c6eef6-2bb9-459a-ab42-c62bc6f132a5.zip | M01_MAG_Projekt_v2.zip | Finale Version. Im selben Render-Script erst NACH dem finalen Render+Mux gezippt und per media_upload/confirm hochgeladen (05.10.2026). Das Zip enthaelt src/*.js, assets, vo, timing.json, tl_full.json, jedoch keine Videos. Der User hat genau dieses Zip am Anfang des M02-Chats als Anhang hochgeladen (Dateiname enthaelt 36c6eef6). Aelter und NICHT final ist bbbbe7cf-c434-4c6e-a67f-de89ea51ec76.zip (V1-Projekt vom 01.10.). |
| M02 | https://d2ol7oe51mr4n9.cloudfront.net/user_36ntZRWa9ocirMjfn8Y3D3TgkXT/6fece786-9eb3-4d4b-b96c-cd2db3ec4e48.zip | M02_Projekt.zip | Finale Version (nicht "_editierbar" benannt). Im final.sh NACH finalem Render+Mux gezippt und hochgeladen (05.10.2026). Enthaelt src (ohne node_modules), assets, vo, timing.json. Danach gab es im Chat keine neue Version. |
| M03 | keine URL | M03_Projekt_editierbar.zip | Nur SendUserFile (nach finalem Render, 07.10.2026). Chat da1676a7. |
| M04 | keine URL | M04_Projekt_editierbar.zip | Nur SendUserFile (nach finalem Render+Mux, 07.10.2026). Chat d99ee695. |
| M05 | keine URL | M05_Projekt_editierbar.zip | Nur SendUserFile (nach finalem Render, 08.10.2026). Chat 6e86a2b2. |
| M06 | keine URL | M06_Projekt_editierbar.zip | Nur SendUserFile (08.10.2026). Spaetere Neu-Kodierung der Videos (H.264 Level 4.0) betrifft das Zip nicht. Chat 221868f2. |
| M07 | keine URL | M07_Projekt_editierbar.zip | Nur SendUserFile (nach finalem Render, 08.10.2026). Chat db7608f0. |
| M08 | keine URL | M08_Projekt_editierbar.zip | Nur SendUserFile (nach finalem Render, 09.10.2026). Chat 4eba9d13. |
| M09 | keine URL | M09_Projekt_editierbar.zip | Nur SendUserFile (mit dem SQ-Video, nach finalem Render, 09.10.2026). Das "v2"-Zip im Chat war das korrigierte VO-Paket, nicht das Projekt. Chat eb543a7b. |
| M10 | keine URL | M10_Projekt_editierbar.zip | SendUserFile plus device_commit_files nach C:\Users\User\Downloads\M10\M10_Projekt_editierbar.zip (11.10.2026, nach finalem Render; ohne Videos). Ausserdem wurde ein M10_komplett.zip (Projekt+VO+Videos) per SendUserFile geschickt. Chat 3a4b2765. |
| M11 | keine URL | M11_Projekt_editierbar.zip | Nur SendUserFile (11.10.2026, nach finalem Render). Der User hat es am Start des M12-Chats als Anhang hochgeladen (nicht downloadbar fuer uns). Chat 08d5f4b5. |
| M12 | keine URL | M12_Projekt_editierbar.zip | Nur SendUserFile (11.10.2026, nach finalem Render). Chat 9f40d5a1. |
| M13 | keine URL | M13_Projekt_editierbar.zip | Nur SendUserFile (11.10.2026, nach finalem Render). Chat 561b0010. |
| M14 | keine URL | M14_Projekt_editierbar.zip | Nur SendUserFile; es gab 2 Zips, final ist das "Modul 14 korrigiert"-Zip (12.10.2026, NACH dem zweiten/finalen Render, 4 Schoenheitsfehler korrigiert). Chat 57541a81. |
| M15 | keine URL | M15_Projekt_editierbar.zip | Nur SendUserFile (12.10.2026, nach finalem Render und Qualitaetspruefung). Chat 6da90a2f. |

## Nuetzliche Zusatzlinks (nicht das Projekt)
- M01 DE-Video: https://d2ol7oe51mr4n9.cloudfront.net/user_36ntZRWa9ocirMjfn8Y3D3TgkXT/7cc2090a-b936-4848-9d47-927260474114.mp4
- M01 SQ-Video: https://d2ol7oe51mr4n9.cloudfront.net/user_36ntZRWa9ocirMjfn8Y3D3TgkXT/bfea31b3-3bc3-43cb-a527-30bfe2822e6b.mp4
- M02 DE-Video: https://d2ol7oe51mr4n9.cloudfront.net/user_36ntZRWa9ocirMjfn8Y3D3TgkXT/2e31bc64-c6ab-4507-9c51-0f174a4a4dd2.mp4
- M02 SQ-Video: https://d2ol7oe51mr4n9.cloudfront.net/user_36ntZRWa9ocirMjfn8Y3D3TgkXT/3885371c-df79-44ec-b0da-4fe08ebbbd19.mp4

## Fuer M03-M15 und M00 ohne URL: moegliche Wege
- Der User hat die ZIPs als Chat-Anhaenge (SendUserFile) in seiner Claude-App bzw. M10 zusaetzlich unter C:\Users\User\Downloads\M10\ auf dem PC.
- Wenn eine URL gebraucht wird, muss das ZIP aus einer Umgebung hochgeladen werden, die die Datei hat (die Chat-Sandboxen sind weg, nur Higgsfield sandbox_exec kann media_upload per presigned PUT). Alternativ liegen die Dateien nur beim User.
