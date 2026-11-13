#!/usr/bin/env bash
# Turns the Apple Wallet signing material in .pass-certs/ into Worker secrets.
#
#   scripts/pass-secrets.sh            -> writes .dev.vars (for `wrangler dev`)
#   scripts/pass-secrets.sh --deploy   -> uploads them with `wrangler secret put`
#
# Expects in .pass-certs/:
#   pass.key   private key (generated alongside pass.csr)
#   pass.cer   certificate downloaded from developer.apple.com for the Pass Type ID
#   wwdr.pem   Apple WWDR G4 intermediate
#   config     two lines:  PASS_TYPE_ID=pass.xxx   APPLE_TEAM_ID=XXXXXXXXXX
set -euo pipefail
cd "$(dirname "$0")/../.pass-certs"

source ./config
: "${PASS_TYPE_ID:?set PASS_TYPE_ID in .pass-certs/config}"
: "${APPLE_TEAM_ID:?set APPLE_TEAM_ID in .pass-certs/config}"

# Apple hands out DER; convert once
[ -f pass.pem ] || openssl x509 -inform der -in pass.cer -out pass.pem

# sanity: certificate and key must belong together
[ "$(openssl x509 -in pass.pem -noout -pubkey)" = "$(openssl pkey -in pass.key -pubout)" ] \
  || { echo "pass.cer does not match pass.key" >&2; exit 1; }
echo "certificate: $(openssl x509 -in pass.pem -noout -subject)"

oneline() { awk 'BEGIN{ORS="\\n"} {print}' "$1"; }

if [ "${1:-}" = "--deploy" ]; then
  cd ..
  printf '%s' "$PASS_TYPE_ID"  | bunx wrangler secret put PASS_TYPE_ID
  printf '%s' "$APPLE_TEAM_ID" | bunx wrangler secret put APPLE_TEAM_ID
  oneline .pass-certs/pass.pem | bunx wrangler secret put PASS_CERT_PEM
  oneline .pass-certs/pass.key | bunx wrangler secret put PASS_KEY_PEM
  oneline .pass-certs/wwdr.pem | bunx wrangler secret put WWDR_CERT_PEM
else
  {
    echo "PASS_TYPE_ID=\"$PASS_TYPE_ID\""
    echo "APPLE_TEAM_ID=\"$APPLE_TEAM_ID\""
    echo "PASS_CERT_PEM=\"$(oneline pass.pem)\""
    echo "PASS_KEY_PEM=\"$(oneline pass.key)\""
    echo "WWDR_CERT_PEM=\"$(oneline wwdr.pem)\""
  } > ../.dev.vars
  echo "wrote .dev.vars"
fi
