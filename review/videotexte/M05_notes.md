# M05 Sicherheitsgruppe Warmwasserspeicher - Notes

Chat used: https://claude.ai/chat/6e86a2b2-d922-4e72-a24a-a3b9d0448f9b ("M&B Modul 5", 8 turns; build in assistant turn 3, final mixing in turn 7; turn 4 user: "passt kansnt fdertigstellen" = VO approved).

## Sources
- `Write` /home/claude/M05_Projekt/vo_script.json (24 scenes: intro, s01-s22, outro). Scene s19 (typische Fehler) was written by Claude (no VO in the brief).
- `mcp__Higgsfield__generate_audio_batch` x3 (indices 0-11, 12-23, retry of rate-limited 0, 11, 23 with identical prompts). Prompts were built from vo_script `de` in key order -> identical to vo_script.
- `mcp__Higgsfield__sandbox_exec` `sq.json` heredoc -> edge-tts sq-AL-IlirNeural -6%; identical to vo_script `sq`.
- `Write` /home/claude/M05_Projekt/src/texts.js, then LATER EDITS applied (two `Bash` python replace commands in turn 3, after first render):
  1. added new entry `HEAT: { de: 'AUFHEIZEN', sq: 'NGROHJA', termDe: 'Aufheizen' }` (used by scene 15 step card instead of 'SV').
  2. added new entry `if_prov: { de: 'falls vorgesehen', sq: 'nëse parashikohet' }` (chip for the optional pressure reducer).
  3. changed `c4` from `{ de: 'Sicherheitsweg Speicher → SV frei?', sq: 'Rruga depozitë → valvul e lirë?' }` to `{ de: 'Weg Speicher → Sicherheitsventil frei?', sq: 'Rruga depozitë → valvula e sigurisë e lirë?' }` (QA fix).
  The screen JSON contains these edits (165 entries).

## Later changes to audio
- None: no regenerated clips after approval; the VO zip (turn 5/7) was mixed as is (stray files vo/de/1.opus and 2.opus were deleted, they were not scene clips).

## Gaps / unsure
- The QA fixes also changed scene code (positions, optional pressure reducer), not spoken text. Final video 6:47.
- Hard-coded symbols in scenes: 'A', 'B', '?', '≠' (not language text).

## Output files
- `M05_vo.json`: one entry per scene in scene order (`intro`, `s01`..., `outro`). `de` = exact prompt string sent to ElevenLabs "Bram" (Higgsfield `generate_audio_batch`, model `text2speech_v2`, variant `elevenlabs`, voice_id 549ff70a-3ee7-4f04-a4d9-89a24fab7709), `sq` = text sent to edge-tts `sq-AL-IlirNeural` (rate -6%).
- No `de_script` / `sq_script` fields were needed: for every scene the final TTS prompt is identical to the (final) `vo_script.json` text.
- `M05_screen.json`: all entries of the final `texts.js` object `T` (evaluated with node, key order preserved). Fields copied as in the source: `de`, `sq`, `termDe`, and `term: true` (an extra flag in the source: when `term` is true the German word `de` is shown small beneath the Albanian text in the SQ video; `termDe` gives the German term to show instead). Plain entries without these flags have no German sub-line.
- Text drawn by code in scene files (not in texts.js) was checked: only symbols/letters ('A', 'B', '?', '≠'). No German/Albanian sentences are hard-coded in scenesA/scenesB.
