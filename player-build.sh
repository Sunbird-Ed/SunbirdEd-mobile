if [ -d "sunbird-content-player" ]; then rm -Rf sunbird-content-player; fi
git clone git@github.com:project-sunbird/sunbird-content-player.git
cd ./sunbird-content-player/
echo "Enter branch-name: "
read branchName
git checkout $branchName
cd ./player/
npm install
sed -i 's/process.env.build_number/process.env.build_number|| 1/' webpack.config.js
sed -i 's/process.env.player_version_number/process.env.player_version_number|| 1/' webpack.config.js
npm run package-coreplugins -- --env.channel=sunbird
npm run build-preview sunbird
cd ./www
rsync -a --exclude 'preview.html' ./preview/* ../../../content-player/
rm -Rf ../../../sunbird-content-player/
