# M12 Hydraulischer Abgleich - Notes

Chat used: https://claude.ai/chat/9f40d5a1-bde8-42a6-aa85-1ff2846c3a2a ("M&B Modul 12", 6 turns, Assistant work in turns 3 and 5).

## Sources
- `M12_vo.json`: `vo_script.json` from the Bash heredoc `cat > vo_script.json` (turn 3, /home/claude/M12/vo_script.json), 30 scenes (intro, s01-s28, outro). Never edited afterwards (no later Edit/sed/python on it).
- German spoken text: the prompts of the 5 `mcp__Higgsfield__generate_audio_batch` calls (Teil 1-3 plus two "Nachholung" retries for rejected jobs: idx 2,4 and 14,15; same prompt strings, voice_id 549ff70a... = Bram, text2speech_v2/elevenlabs). All 30 TTS prompts are identical to the vo_script `de` strings (so no `de_script` fields needed). The prompts are already the phonetic forms ("Es-Ha-Ka", numbers as words).
- Albanian spoken text: edge-tts sq-AL-IlirNeural, rate +0%, from `sq.json` heredoc in `sandbox_exec` (turn 3); verified identical to vo_script `sq` for all 30 scenes.
- `M12_screen.json`: `T` object of the `Write` of /home/claude/M12/src/texts.js (turn 5), 186 entries, 101 with `termDe`. Fields kept verbatim, including `term: true/false` flags. No later edit to texts.js found (grep for "texts" in turn 5: only the Write plus README mentions).

## Later changes applied
- None found for VO or texts.js. After the Write of texts.js, only scene/part code was patched (sed/python on scenesA/B, parts12, system12, audio.py), not the texts.
- Timing "tail" values and chip positions were changed in scene code; irrelevant to wording.

## Caveats / not found
- Screen text that is hard-coded in scenesA.js/scenesB.js rather than in texts.js (if any) is not included.
- The L() helper: Albanian shows `e.sq` main and `e.de` (if `term: true`) or `termDe` small underneath; German shows only `e.de`. That is how `term`/`termDe` are used in the render.
- Chat mentions the Albanian term "Sollvolumenstrom" = "prurja e synuar" as needing review by the Albanian reviewer; no correction was applied in this chat.
- Final video length 6:55 (DE+SQ). No later chat found that changed M12 texts (searched for Albanian corrections / re-renders).
