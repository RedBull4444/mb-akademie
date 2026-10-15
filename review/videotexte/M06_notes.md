# M06 Schlammabscheider - Notes

Chat used: https://claude.ai/chat/221868f2-e835-4bcb-8898-2aa021a72089 ("M&B Modul 6", 13 turns; build in turns 3 and 5 (read as two pages), turns 6-12 are about 'mehr Werbemittel' and re-encoding the MP4s because they would not open; no text changes).

## Sources
- `Write` /home/claude/M06_Projekt/vo_script.json (26 scenes: intro, s01-s24, outro).
- `mcp__Higgsfield__generate_audio_batch` x5 (waves of ~4-5 / 7 indices; index 6 submitted twice, identical prompt). Prompts built from vo_script `de` in key order -> identical to vo_script.
- `mcp__Higgsfield__sandbox_exec` (job-id list `urls.txt` + `sq.json` heredoc with delimiter SQ_END) -> edge-tts sq-AL-IlirNeural -6%; sq text identical to vo_script `sq`.
- `Write` /home/claude/M06_Projekt/src/texts.js (175 entries). No later edits to texts.js or vo_script.json in this chat (checked all Edit/Bash calls).

## Later changes checked
- Timing only: SQ s23 hand-corrected (5th sentence start 13.6 s) in timing.json; no text change.
- Scene code was edited several times (Bash python replaces in scenesA/scenesB/parts6) but none touched texts.js.

## Gaps / unsure
- Final video 7:26 (DE and SQ). Re-encode in turn 12 does not change content.
- Spoken DE says "Modul sechzehn" in s02 (reference to M16) - copied verbatim.

## Output files
- `M06_vo.json`: one entry per scene in scene order (`intro`, `s01`..., `outro`). `de` = exact prompt string sent to ElevenLabs "Bram" (Higgsfield `generate_audio_batch`, model `text2speech_v2`, variant `elevenlabs`, voice_id 549ff70a-3ee7-4f04-a4d9-89a24fab7709), `sq` = text sent to edge-tts `sq-AL-IlirNeural` (rate -6%).
- No `de_script` / `sq_script` fields were needed: for every scene the final TTS prompt is identical to the (final) `vo_script.json` text.
- `M06_screen.json`: all entries of the final `texts.js` object `T` (evaluated with node, key order preserved). Fields copied as in the source: `de`, `sq`, `termDe`, and `term: true` (an extra flag in the source: when `term` is true the German word `de` is shown small beneath the Albanian text in the SQ video; `termDe` gives the German term to show instead). Plain entries without these flags have no German sub-line.
- Text drawn by code in scene files (not in texts.js) was checked: only symbols/letters ('…'). No German/Albanian sentences are hard-coded in scenesA/scenesB.
