# M13 Mischerkreis - Notes

Chat used: https://claude.ai/chat/561b0010-76a2-41de-964e-06ff5eb78d76 ("M&B Modul 13", 6 turns, Assistant work in turns 3 and 5).

## Sources
- `M13_vo.json`: `Write` of /home/claude/M13/vo_script.json (turn 3), then a Bash python edit ("Tighten scripts") that replaced `de` and `sq` of s01, s11, s27, s28 and rewrote the file. The edited version is what went to TTS. 30 scenes (intro, s01-s28, outro).
- German spoken text: prompts of 5 `generate_audio_batch` calls (Teil 1-3 plus "Nachzügler" idx 3,6 and "Nachzügler 2" idx 22,24 = retries of rejected jobs, same strings). All 30 prompts equal the edited vo_script `de` (no `de_script` fields needed). Phonetic forms already in the prompts ("Es-Ha-Ka", "Ka-Vau-Es", numbers as words).
- Albanian spoken text: edge-tts sq-AL-IlirNeural +0%, from `sq.json` (sandbox_exec, turn 3); identical to the edited vo_script `sq` for all 30 scenes.
- `M13_screen.json`: `T` of the `Write` of /home/claude/M13/src/texts.js (turn 5), 146 entries, 83 with `termDe`; with the later edits below applied.

## Later changes applied to texts.js (after the Write)
1. sed on `c11`: `{de:'Soll ↔ Ist vergleichen', sq:'krahaso: e kërkuar ↔ reale', termDe:'Soll / Ist'}` became `{de:'Soll und Ist vergleichen', sq:'krahaso vlerën e kërkuar me atë reale', termDe:'Soll / Ist vergleichen'}`.
2. Python fix after the fact-check agent (run twice, idempotent): `ex_mix_b` from `'ESBE VRG131 + ARA661'` (de and sq) to `de:'ESBE VRG130-Serie + Stellmotor ARA600-Serie'`, `sq:'ESBE seria VRG130 + motor seria ARA600'`; `neutral` to `de:'neutrales Prinzip – keine Herstellermechanik, Anordnung nur beispielhaft'`, `sq:'parim neutral – jo mekanikë e prodhuesit, renditja vetëm shembull'`.
- Reconstructed by replaying those replacements on the Write content (all three matched). Video was re-rendered after the edits (build.sh de/sq after the last fix).

## Caveats / not found
- VO: no regenerated single clips after the "Nachzügler" retries; no VO edits after TTS.
- Hard-coded strings in scenesA/B.js (not in texts.js) are not included.
- Chat summary: review agent suggested alternative Albanian words for "producer", "controller", "actuator"; not applied (no re-recording). No later chat found that changed M13 texts.
- Final length 6:30.
