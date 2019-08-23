echo What you want to do?
read ACTION
echo $ACTION
if [ $ACTION = "build" ]; then
    ionic cordova build android
elif [ $ACTION = "run" ]; then
    cordova run android
else
    ionic cordova run android
fi