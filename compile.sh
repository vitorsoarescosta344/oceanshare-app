clear && 
cd android &&
./gradlew clean && 
cd .. &&

rm -rf android/app/build &&

rm -rf package-lock.json &&
rm -rf yarn.lock &&
rm -rf node_modules &&

npm cache clean --force &&
npm install --legacy-peer-deps &&

#cd ios &&
#rm -rf Podfile.lock &&
#rm -rf Pods &&
#pod deintegrate && pod install --repo-update
#cd .. 

cd ios &&
rm -rf main.jsbundle &&
rm -rf Podfile.lock &&
rm -rf Pods &&
rm -rf ~/Library/Caches/CocoaPods Pods ~/Library/Developer/Xcode/DerivedData/\* &&
pod cache clean --all &&
pod deintegrate && pod install --repo-update
cd .. 