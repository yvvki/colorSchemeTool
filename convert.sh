#!/bin/bash

VSC_FILES=./vscode/*.json
TM_OUTDIR=./textmate/

shopt -s nullglob

for FILE in $VSC_FILES
do
    FN="${FILE##*/}"
    DIR="${FILE:0:${#FILE} - ${#FN}}"
    BASE="${FN%.[^.]*}"
    EXT="${FN:${#BASE} + 1}"
    echo converting $DIR$FN to $TM_OUTDIR$BASE.tmTheme ...
	node vsc2tm.js "$FILE" "$TM_OUTDIR$BASE.tmTheme" >> ./colorSchemeTool.log
done


TM_FILES=./textmate/*.tmTheme
IJ_OUTDIR=./intellij/

shopt -s nullglob

for FILE in $TM_FILES
do
    FN="${FILE##*/}"
    DIR="${FILE:0:${#FILE} - ${#FN}}"
    BASE="${FN%.[^.]*}"
    EXT="${FN:${#BASE} + 1}"
    echo converting $DIR$FN to $IJ_OUTDIR$BASE.icls ...
	python colorSchemeTool.py "$FILE" "$IJ_OUTDIR$BASE.icls" >> ./colorSchemeTool.log
done
