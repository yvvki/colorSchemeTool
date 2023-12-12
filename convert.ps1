$VSC_FILES = Get-ChildItem .\vscode\*.json
$TM_OUTDIR = ".\textmate\"

foreach ($file in $VSC_FILES) {
    $outFile = $file.Name -replace ".json", ".tmTheme"
    $outFile = $TM_OUTDIR + $outFile
    Write-Output "converting $file to $outFile ..."
    node vsc2tm.js $file $outFile | Out-File .\colorSchemeTool.log
}

$TM_FILES = Get-ChildItem .\textmate\*.tmTheme
$IJ_OUTDIR = ".\intellij\"

foreach ($file in $TM_FILES) {
    $outFile = $file.Name -replace ".tmTheme", ".xml"
    $outFile = $IJ_OUTDIR + $outFile
    Write-Output "converting $file to $outFile ..."
    py colorSchemeTool.py $file $outFile | Out-File .\colorSchemeTool.log
}
