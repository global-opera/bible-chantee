# Google Play TWA - Asset Links

## Configuration Required

The `assetlinks.json` file needs to be updated with your actual SHA256 certificate fingerprint.

### How to get the SHA256 fingerprint:

#### Option 1: From PWA Builder Package
If you downloaded the Google Play package from PWA Builder:
1. Extract the ZIP file
2. The `assetlinks.json` should contain the correct SHA256 fingerprint
3. Copy it to replace `PLACEHOLDER_SHA256_FINGERPRINT_TO_UPDATE`

#### Option 2: From your signing certificate (keystore)
```bash
keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
```

Look for the `SHA256:` line and copy the fingerprint (remove colons).

#### Option 3: From Google Play Console
1. Go to Google Play Console
2. Select your app
3. Go to "Release" → "Setup" → "App Integrity"
4. Find the SHA-256 certificate fingerprint

### Update the file:
Replace `PLACEHOLDER_SHA256_FINGERPRINT_TO_UPDATE` in `assetlinks.json` with your actual fingerprint.

### Verify:
Once deployed, verify at:
https://biblechantee.com/.well-known/assetlinks.json
