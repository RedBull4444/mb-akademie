# M15 Typische Montagefehler und Abschlusskontrolle - Notes

Chat used: https://claude.ai/chat/6da90a2f-d817-47e2-8537-9dceac2d6d84 ("M&B Modul 15", 8 turns; Assistant work in turns 3 and 5; turn 7 is only a QA summary).

## Sources
- `M15_vo.json`: vo_script.json built in three steps (all Bash in turn 3), replayed in order:
  1. heredoc `cat > vo_script.json` with the long 26-key script (intro, s01-s24, outro; ~572 DE words);
  2. python step with dict `U` replacing ~20 scenes by the condensed (~600 word) versions (the one that was voiced; first-draft s24 text "...gemeinsam funktionieren, ist aus ... auch eine funktionierende Anlage geworden" was replaced);
  3. python step: `s19.sq` "Dhe edhe kalimet" -> "Dhe gjithashtu kalimet"; `s14.sq` "Valvul bypass apo depozitë" -> "Bypass apo depozitë".
  26 scenes in the final file.
- German spoken text: prompts of 5 `generate_audio_batch` calls (idx 0-5, 6-11, 12-17, a retry batch 13,18,19,20, and 21-25) plus the single `generate_audio` for the outro. All equal the final vo_script `de` (no `de_script` entries). Phonetic forms already in the prompts ("Es-Ha-Ka", "Em-A-Ge", "Peh-Ha", numbers as words).
- Albanian spoken text: edge-tts sq-AL-IlirNeural +0% (go.py/sqrest.py) from `sq.json`, written after step 3; identical to the final vo_script `sq` for all 26 scenes.
- `M15_screen.json`: `T` of the `Write` of /home/claude/M15_Projekt_editierbar/src/texts.js (turn 5), 188 entries, 89 with `termDe`, with the later edits below applied.

## Later changes applied to texts.js
1. Python right after the Write: `t_hk1` sq 'QN 1' -> 'QARKU 1'; `t_hk2` sq 'QN 2' -> 'QARKU 2'; `t_fbh` sq 'NGD' -> 'DYSHEMEJA'.
2. After the 70-rule check by a separate reviewer agent (three Albanian grammar corrections + one content correction), run via fix1.py (the first attempt in the same command with `pkill` did not run, the second did):
   - `o1` sq 'tubat të montuar pastër' -> 'tubat e montuar pastër'
   - `closedv` sq 'Mbyllje e mbyllur' -> 'Valvula mbyllëse e mbyllur'
   - `rv` sq 'Valvula kundërkthimit' -> 'Valvula e kundërkthimit'
   - `magon`: de 'im Betrieb wirksam verbunden' -> 'im Betrieb offen + gegen Schließen gesichert'; sq 'i lidhur realisht gjatë punës' -> 'i hapur gjatë punës + i siguruar kundër mbylljes'; termDe 'im Betrieb wirksam' -> 'offen + gegen Schließen gesichert'.
- Scene code was also changed (green check timing in scene 14, MAG seal in scene 7, s24 layout/cues); no VO change. Video re-rendered; final 6:21 DE and SQ.

## Known mismatches left in the final video (stated by Claude in the chat)
- The SQ voiceover (s11) still says "valvulat kundërkthimit" (no "e"); only the screen text was corrected. Not re-voiced.
- DE voiceover s05 says "keine geschlossene Absperrung" while the on-screen text is stricter ("keine Absperrung dazwischen"); not re-recorded.
- The Albanian VO was shortened/re-phrased by Claude (not 1:1 the ChatGPT briefing text), flagged as needing the Albanian reviewer.

## Caveats
- Hard-coded strings in scenesA/B.js not included.
- No later chat found with further M15 corrections.
