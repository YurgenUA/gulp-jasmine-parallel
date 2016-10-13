echo "build.ch executing..."
echo "listing installed packages..."
npm list
echo "(re)installed packages..."
npm install
gulp unit-test
