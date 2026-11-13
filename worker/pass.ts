// Builds a signed Apple Wallet pass (.pkpass) for the /aqilah invitation.
//
// A .pkpass is a zip of: pass.json + images + manifest.json (SHA-1 of every
// file) + signature (detached PKCS#7 of manifest.json, signed with the Pass
// Type ID certificate and chained to Apple's WWDR intermediate).

import forge from 'node-forge'
import { zipSync } from 'fflate'

import icon from './pass-assets/icon.png'
import icon2x from './pass-assets/icon@2x.png'
import icon3x from './pass-assets/icon@3x.png'
import logo from './pass-assets/logo.png'
import logo2x from './pass-assets/logo@2x.png'
import strip from './pass-assets/strip.png'
import strip2x from './pass-assets/strip@2x.png'

export interface PassEnv {
  PASS_TYPE_ID: string // e.g. pass.dev.irsyad.aqilah
  APPLE_TEAM_ID: string // 10-char team id
  PASS_CERT_PEM: string // Pass Type ID certificate
  PASS_KEY_PEM: string // its private key (unencrypted PEM)
  WWDR_CERT_PEM: string // Apple WWDR G4 intermediate
}

export type Guest = { id: string; name: string }

// wrangler's Data rule imports these as ArrayBuffers (Astro's *.png typing
// says ImageMetadata, which only applies to the site build)
const images = {
  'icon.png': icon,
  'icon@2x.png': icon2x,
  'icon@3x.png': icon3x,
  'logo.png': logo,
  'logo@2x.png': logo2x,
  'strip.png': strip,
  'strip@2x.png': strip2x,
} as unknown as Record<string, ArrayBuffer>

function passJson(env: PassEnv, guest: Guest) {
  return {
    formatVersion: 1,
    passTypeIdentifier: env.PASS_TYPE_ID,
    teamIdentifier: env.APPLE_TEAM_ID,
    serialNumber: guest.id,
    organizationName: "Irsyad & 'Aqilah",
    description: "Walimatul Urus · Irsyad & 'Aqilah",
    logoText: 'Walimatul Urus',
    foregroundColor: 'rgb(95, 107, 78)',
    labelColor: 'rgb(125, 135, 112)',
    backgroundColor: 'rgb(250, 246, 238)',
    // shows on the lock screen around the event, and near the venue
    relevantDate: '2027-05-30T11:00:00+08:00',
    expirationDate: '2027-05-31T00:00:00+08:00',
    locations: [
      { latitude: 1.31503, longitude: 103.89286, relevantText: "Irsyad & 'Aqilah's walimah is here 🌸" },
    ],
    barcodes: [
      { format: 'PKBarcodeFormatQR', message: guest.id, messageEncoding: 'iso-8859-1', altText: guest.id.slice(0, 8) },
    ],
    eventTicket: {
      primaryFields: [{ key: 'guest', label: 'GUEST', value: guest.name }],
      secondaryFields: [
        { key: 'date', label: 'DATE', value: 'Sun, 30 May 2027' },
        { key: 'time', label: 'TIME', value: '11.00AM – 4.00PM', textAlignment: 'PKTextAlignmentRight' },
      ],
      auxiliaryFields: [{ key: 'venue', label: 'VENUE', value: 'The Iris @ City Plaza' }],
      backFields: [
        { key: 'address', label: 'Address', value: '810 Geylang Rd, #04-28/37\nSingapore 409286' },
        { key: 'hijri', label: 'Hijri', value: '23 Zulhijjah 1448H' },
        { key: 'contact', label: 'Contact', value: 'Abd Wahab · 9658 3646\nAlfian · 9848 7330' },
        { key: 'invite', label: 'Invitation', value: 'https://irsyad.dev/aqilah' },
      ],
    },
  }
}

// forge works on "binary strings" (one char per byte)
const toBinary = (bytes: Uint8Array) => {
  let s = ''
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i])
  return s
}
const fromBinary = (s: string) => {
  const out = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i)
  return out
}

function sha1Hex(bytes: Uint8Array) {
  const md = forge.md.sha1.create()
  md.update(toBinary(bytes))
  return md.digest().toHex()
}

function sign(env: PassEnv, manifest: Uint8Array) {
  // secrets pasted via `wrangler secret put` may carry literal "\n"
  const pem = (s: string) => s.replace(/\\n/g, '\n')
  const cert = forge.pki.certificateFromPem(pem(env.PASS_CERT_PEM))
  const key = forge.pki.privateKeyFromPem(pem(env.PASS_KEY_PEM))
  const wwdr = forge.pki.certificateFromPem(pem(env.WWDR_CERT_PEM))

  const p7 = forge.pkcs7.createSignedData()
  p7.content = forge.util.createBuffer(toBinary(manifest))
  p7.addCertificate(cert)
  p7.addCertificate(wwdr)
  p7.addSigner({
    key,
    certificate: cert,
    digestAlgorithm: forge.pki.oids.sha256,
    authenticatedAttributes: [
      { type: forge.pki.oids.contentType, value: forge.pki.oids.data },
      { type: forge.pki.oids.messageDigest },
      // @ts-expect-error forge accepts a Date here
      { type: forge.pki.oids.signingTime, value: new Date() },
    ],
  })
  p7.sign({ detached: true })
  return fromBinary(forge.asn1.toDer(p7.toAsn1()).getBytes())
}

export function buildPass(env: PassEnv, guest: Guest): Uint8Array {
  const enc = new TextEncoder()
  const files: Record<string, Uint8Array> = {
    'pass.json': enc.encode(JSON.stringify(passJson(env, guest))),
  }
  for (const [name, buf] of Object.entries(images)) files[name] = new Uint8Array(buf)

  const manifest: Record<string, string> = {}
  for (const [name, bytes] of Object.entries(files)) manifest[name] = sha1Hex(bytes)
  const manifestBytes = enc.encode(JSON.stringify(manifest))

  files['manifest.json'] = manifestBytes
  files['signature'] = sign(env, manifestBytes)

  return zipSync(files, { level: 6 })
}
