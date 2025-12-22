# Google Play TWA - Asset Links

## ✅ Configuration Complete

The `assetlinks.json` file has been configured with the PWA Builder signing certificate.

### Certificate Information

- **Package Name:** `com.biblechantee.twa`
- **SHA256 Fingerprint:** `7E:A5:E7:44:55:4E:8D:D7:47:3E:42:FA:CD:FA:73:64:AF:F6:01:64:0E:E4:0F:45:DA:EC:51:47:3D:51:27:1B`
- **Keystore:** `signing.keystore` (from PWA Builder package)
- **Key Alias:** `my-key-alias`

### Verification

Once deployed, verify the Digital Asset Links at:
- **URL:** https://biblechantee.com/.well-known/assetlinks.json
- **Google Tool:** https://developers.google.com/digital-asset-links/tools/generator

### Important Security Notes

⚠️ **Keep these files SECURE and PRIVATE:**
- `signing.keystore` - Never commit to git or share publicly
- `signing-key-info.txt` - Contains passwords, store securely
- Keystore password: Required for future app updates

📍 **Location:**
```
C:\Users\Stéphane CASSANI\Desktop\LOGO Bible chantee\Bible Chantée - Google Play package\
```

### Files in PWA Builder Package

- `Bible Chantée.aab` - Android App Bundle for Play Store upload
- `Bible Chantée.apk` - APK for testing
- `signing.keystore` - Signing certificate (KEEP SECURE!)
- `signing-key-info.txt` - Key passwords (KEEP SECURE!)
- `assetlinks.json` - Digital Asset Links (deployed to website)
- `Readme.html` - PWA Builder instructions

### Next Steps for Google Play

1. ✅ Digital Asset Links configured
2. Upload `Bible Chantée.aab` to Google Play Console
3. Configure app details, screenshots, descriptions
4. Submit for review
5. Once approved, the TWA will link to biblechantee.com
