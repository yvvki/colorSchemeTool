$VSC_FILES = Get-ChildItem .\vscThemes\*.json
$TM_OUTDIR = ".\tmThemes\"

foreach ($file in $VSC_FILES) {
    $outFile = $file.Name -replace ".json", ".tmTheme"
    $outFile = $TM_OUTDIR + $outFile
    Write-Output "converting $file to $tmFile"
    node vsc2tm.js $file $outFile | Out-File .\colorSchemeTool.log
}

$TM_FILES = Get-ChildItem .\tmThemes\*.tmTheme
$IJ_OUTDIR = ".\intellijThemes\"

foreach ($file in $TM_FILES) {
    $outFile = $file.Name -replace ".tmTheme", ".xml"
    $outFile = $IJ_OUTDIR + $outFile
    Write-Output "converting $file to $ijFile"
    py colorSchemeTool.py $file $outFile | Out-File .\colorSchemeTool.log
}

