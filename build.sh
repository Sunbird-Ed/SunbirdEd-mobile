# Simple script to clean install
rm -rf node_modules
rm -rf platforms
rm -rf plugins
rm -rf www

NPM_COUNTER=0
CORDOVA_COUNTER=0

# NPM[0]=""
# CORDOVA[0]=""

file="./build_config"
while IFS="=" read -r key value; do
  case "$key" in
    '#'*) ;;
    'npm'*)
      NPM[$NPM_COUNTER]=$value
      NPM_COUNTER=`expr $NPM_COUNTER + 1`;;
    'cordova'*)
      CORDOVA[$CORDOVA_COUNTER]=$value
      CORDOVA_COUNTER=`expr $CORDOVA_COUNTER + 1`;;
  esac
done < "$file"

git clone --depth 1 https://github.com/project-sunbird/genie-sdk-wrapper.git
cd genie-sdk-wrapper
rm package-lock.json
npm install
npm run build

rm `pwd`/dist/dependencies.json

npm pack `pwd`/dist


cd ..
npm install
npm install `pwd`/genie-sdk-wrapper/*.tgz --save

rm -rf genie-sdk-wrapper

for cordova_plugin in "${CORDOVA[@]}"
do
  ionic cordova plugin add $cordova_plugin
done

rm -rf platforms

curl -L -o ./plugins/cordova-plugin-genie-sdk/secret.gradle https://www.dropbox.com/s/wjxnd7s8h4ce7vl/secret.gradle?dl=1

ionic cordova platforms add android


curl -L -o ./gk.jks https://www.dropbox.com/s/0vorw73102zr97c/gk.jks?dl=1
curl -L -o ./build.json https://www.dropbox.com/s/n7aj1kf1ztigidn/build.json?dl=1

if [ -e ./plugins/cordova-plugin-genie-sdk/secret.gradle ]; then echo "Ok"; else echo "Not Okay"; fi


ionic cordova build android --prod --release --buildConfig build.json

