Set oWS = WScript.CreateObject("WScript.Shell")
sDesktop = oWS.SpecialFolders("Desktop")
sLinkFile = sDesktop & "\Bible Chantee - Upload YouTube.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "C:\ScriptBible\bible-chantee\Scripts\LANCER_UPLOAD_YOUTUBE.bat"
oLink.WorkingDirectory = "C:\ScriptBible\bible-chantee\Scripts"
oLink.Description = "Upload automatique YouTube"
oLink.Save
