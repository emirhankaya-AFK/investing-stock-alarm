$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.IO.Path]::Combine([System.Environment]::GetFolderPath("Desktop"), "Borsa Alarm.lnk")
$Shortcut = $WshShell.CreateShortcut($DesktopPath)
$Shortcut.TargetPath = "C:\Users\emirh\.gemini\antigravity\scratch\investing-stock-alarm\launch.bat"
$Shortcut.WorkingDirectory = "C:\Users\emirh\.gemini\antigravity\scratch\investing-stock-alarm"
$Shortcut.IconLocation = "shell32.dll, 147" # A nice chart/stats icon
$Shortcut.Save()
Write-Output "Kisayol olusturuldu: $DesktopPath"
