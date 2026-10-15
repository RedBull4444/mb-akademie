# M07 Luftabscheider und automatischer Entlüfter - Notes

Chat used: https://claude.ai/chat/db7608f0-dca1-44ea-a899-5b81a11afd0e ("M&B Modul 7", 6 turns; build in assistant turns 3 and 5 (read as two pages), turn 4 user re-upload only).

## Sources
- `Write` /home/claude/M07_Projekt/vo_script.json (23 scenes: intro, s01-s21, outro). Scene s19 (typische Fehler) written by Claude (no VO in the brief).
- LATER EDIT applied: `Edit` on vo_script.json (before any TTS): in s19 "Gelöstes Gas wird sich als sichtbare Blasen vorgestellt – dabei" -> "Man stellt sich gelöstes Gas als sichtbare Blasen vor – dabei". Only the German s19 was changed; the SQ s19 text was not touched by this Edit. The final TTS prompt for s19 contains the edited sentence.
- `mcp__Higgsfield__generate_audio_batch` x4 (indices 0-11, 12-22, retries for rate-limited 13, 17, 18, 19, 20, 21 with identical prompts). Prompts built from the edited vo_script `de` in key order -> identical to final vo_script.
- `mcp__Higgsfield__sandbox_exec` `sq.json` heredoc -> edge-tts sq-AL-IlirNeural -6%; identical to vo_script `sq`.
- `Write` /home/claude/M07_Projekt/src/texts.js (161 entries). No later edits to texts.js in this chat.

## Gaps / unsure
- Later parts7.js edits (Bash) concern drawing only. Final video 7:08 (DE and SQ).
- SQ s19 says "Gazi i tretur imagjinohet si flluska të dukshme" (passive) while the final DE is the active "Man stellt sich ..." - the Albanian was not adapted after the Edit; copied verbatim.

## Output files
- `M07_vo.json`: one entry per scene in scene order (`intro`, `s01`..., `outro`). `de` = exact prompt string sent to ElevenLabs "Bram" (Higgsfield `generate_audio_batch`, model `text2speech_v2`, variant `elevenlabs`, voice_id 549ff70a-3ee7-4f04-a4d9-89a24fab7709), `sq` = text sent to edge-tts `sq-AL-IlirNeural` (rate -6%).
- No `de_script` / `sq_script` fields were needed: for every scene the final TTS prompt is identical to the (final) `vo_script.json` text.
- `M07_screen.json`: all entries of the final `texts.js` object `T` (evaluated with node, key order preserved). Fields copied as in the source: `de`, `sq`, `termDe`, and `term: true` (an extra flag in the source: when `term` is true the German word `de` is shown small beneath the Albanian text in the SQ video; `termDe` gives the German term to show instead). Plain entries without these flags have no German sub-line.
- Text drawn by code in scene files (not in texts.js) was checked: only symbols/letters ('?', 'ABC'). No German/Albanian sentences are hard-coded in scenesA/scenesB.
