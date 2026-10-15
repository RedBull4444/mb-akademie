# M04 Sicherheitsgruppe Heizung - Notes

Chat used: https://claude.ai/chat/d99ee695-c719-438b-b67c-45f5800594c5 ("M&B Modul 4 Final", 14 turns; all work is in assistant turn 3, later turns 4-13 are delivery/mixing only).

## Sources (all in turn 3)
- `Write` /home/claude/M04_Projekt/vo_script.json (23 scenes: intro, s01-s21, outro; incl. `sq`).
- `Bash` python heredoc (right after the Write, before any TTS): replaced `s18` in vo_script.json with a SHORTER version (de + sq). Applied. Original s18 (not spoken) began "Jetzt die typischen Fehler. Erstens: eine geschlossene Absperrung ..." and enumerated Erstens ... siebtens; the final/spoken version is the shorter one without ordinals.
- `mcp__Higgsfield__generate_audio_batch` x4 (batch 1 indices 0-11, batch 2 indices 12-22, retry batch for rate-limited indices 2, 14, 17, 22 - identical prompts). Prompts map 1:1 to vo_script keys in order (index 0 = intro ... 22 = outro).
- `mcp__Higgsfield__sandbox_exec`: `sq.json` heredoc (two identical copies) + `gen.py` with edge_tts `sq-AL-IlirNeural`, rate -6% -> this is the spoken Albanian; identical to vo_script `sq`.
- `Write` /home/claude/M04_Projekt/src/texts.js -> 150 entries; no later edits to texts.js (no Edit tool calls; no Bash replacements on texts.js).

## Later changes checked
- Turns 4-13: user said length stays (not shortened); VO zip mixed; no text changes, no regenerated clips.
- Phonetic spellings in the spoken German: "Es-Ha-Ka", "Em-A-Ge" (and SQ "Es-Ha-Ka-së", "Em-A-Ge-ja") are already in vo_script itself.

## Gaps / unsure
- Nothing missing. Final rendered video is 5:49.

## Output files
- `M04_vo.json`: one entry per scene in scene order (`intro`, `s01`..., `outro`). `de` = exact prompt string sent to ElevenLabs "Bram" (Higgsfield `generate_audio_batch`, model `text2speech_v2`, variant `elevenlabs`, voice_id 549ff70a-3ee7-4f04-a4d9-89a24fab7709), `sq` = text sent to edge-tts `sq-AL-IlirNeural` (rate -6%).
- No `de_script` / `sq_script` fields were needed: for every scene the final TTS prompt is identical to the (final) `vo_script.json` text.
- `M04_screen.json`: all entries of the final `texts.js` object `T` (evaluated with node, key order preserved). Fields copied as in the source: `de`, `sq`, `termDe`, and `term: true` (an extra flag in the source: when `term` is true the German word `de` is shown small beneath the Albanian text in the SQ video; `termDe` gives the German term to show instead). Plain entries without these flags have no German sub-line.
- Text drawn by code in scene files (not in texts.js) was checked: only symbols/letters ('?', '≠'). No German/Albanian sentences are hard-coded in scenesA/scenesB.
