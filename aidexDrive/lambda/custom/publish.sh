#! /bin/bash

rm index.zip 
zip -X -r ./index.zip *
aws lambda update-function-code --function-name ask-custom-aidexDrive-default --zip-file fileb://index.zip

