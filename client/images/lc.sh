#!/bin/bash

# if [ "$1" == "css" ];then
# 	TAR="css"
# 	SRC="less"
# 	SEDRULE="\://less-css: s;require;//require;"
# elif [ "$1" == "less" ]; then
# 	TAR="less"
# 	SRC="css"
# 	SEDRULE="\://less-css: s;.*// *r; r;"
# else
# 	echo argument is err!
# 	exit 0
# fi

find . -name "*.jpg" -type f |
	while read file
	do
		convert "$file" -resize '500x>' -gravity center -crop 500x300+0+0 +repage ./min/"$file"
	done
