#!/bin/bash
# Frischer lokaler Stand + Dev-Server auf :8791 (Persist-Verzeichnis im Scratchpad)
cd /home/claude/akademie
P=/tmp/claude-0/-home-claude/11c135d6-a206-58fa-85d9-899349f4e70c/scratchpad/d1state
pkill -f "wrangler pages dev public --port 8791" 2>/dev/null; sleep 1
rm -rf $P
npx wrangler d1 execute akademie-db --local --persist-to $P --file=schema.sql >/dev/null 2>&1
(nohup npx wrangler pages dev public --port 8791 --persist-to $P > $P.log 2>&1 &)
for i in $(seq 1 30); do curl -s localhost:8791/api/chef/status >/dev/null && break; sleep 1; done
curl -s localhost:8791/api/chef/status; echo
