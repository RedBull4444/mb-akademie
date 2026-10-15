# M14 Heizungswasser: Magnetit und VDI 2035 - Notes

Chat used: https://claude.ai/chat/57541a81-655e-4979-89ba-14e9d99bcc86 ("M&B Modul 14", 12 turns; Assistant work in turns 3, 5, 9, 11). Found via conversation search.

## Sources
- `M14_vo.json`: vo_script.json was built in two Bash python steps (turn 3): first full script with helper `a(k,de,sq)` (34 scenes: intro, s01-s32, outro, ~739 DE words), then a second python step that rewrote/tightened many scenes (~627 DE words). The JSON was reconstructed by executing both scripts in order, then the third edit below.
- German spoken text: prompts of the `generate_audio_batch` calls (Teil 1-3, "Nachzügler" idx 8,9,10 and "Nachzügler 2" idx 19,21,23 = retries, same strings), plus "Aussprache-Korrektur VDI für Modul 14" (idx 100 = intro, idx 114 = s14).
- Albanian spoken text: edge-tts sq-AL-IlirNeural +0% from `sq.json` (sandbox_exec); identical to the final vo_script `sq` for all 34 scenes.
- `M14_screen.json`: `T` of the `Write` of /home/claude/M14/M14_Projekt_editierbar/src/texts.js (turn 5) with the later edits below; 195 entries, 104 with `termDe`.

## Later changes applied
VO:
- Pronunciation fix: "Vau-De-I" became "Fau-Deh-I" in intro and s14 (Bram slurred it to "Waudi"). The two clips were regenerated (jobs idx 100 and 114, whisper check), vo_script `de` updated, de_urls.txt pointed to the new takes. So `de` for intro and s14 in M14_vo.json is the CORRECTED version; the original first-batch prompts had "Vau-De-I" (no `de_script` entry because the final vo_script equals the final prompt). Test clip idx 200 ("Vau, De, I") was not used.
Screen texts (texts.js):
1. `pa`: `{de:'Problem', sq:'Problemi', termDe:'Problem'}` became `{de:'Merke dir', sq:'Mbaje mend', termDe:'Merke dir'}`.
2. `termDe:'Anforderungen vor dem Befüllen'` became `termDe:'Anforderungen'`.
3. `termDe:'Härte ↔ Leitfähigkeit'` became `termDe:'Härte / Leitfähigkeit verwechselt'`.
4. Unused keys removed after checking usage: `w_clear`, `c04m`, `c04s`, `eisen`, `vorher`, `nachher`, `log`, `prot` (so they are NOT in M14_screen.json).
- Final-pass fixes (turn 9) touched only scene code (scenes 8, 13, 23, 31 timing/photo crop), not texts; both languages were re-rendered. Final length 7:11.

## Open / unresolved items from the chat (not applied)
- Albanian s04: "të ashtuquajturin gëlqere" - the sub-agent reviewer said it should be "të ashtuquajturën" (gëlqere feminine). Left as is, flagged for the user's Albanian reviewer. Also queried: "pajisja e ngrohjes" for Wärmeerzeuger, "pe-ha" / "Ve-De-I" pronunciation in SQ text (SQ intro text says "Ve-De-I").
- The fact-check agent's German style suggestions were deliberately not applied (would need new VO).
- No later chat found that applied these Albanian corrections.

## Caveats
- Hard-coded strings in scenesA/B.js not included.
