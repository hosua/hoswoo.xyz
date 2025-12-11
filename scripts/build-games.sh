#!/bin/bash

set -e # Exit on error
set -x # Print commands as they execute

npm i
npm run update-submodules

GAMES_DIR="./games"
BUILD_DIR="./public/games"

mkdir -p "$BUILD_DIR"
pushd "$BUILD_DIR" || exit
BUILD_DIR="$(pwd)"
popd || exit

echo Building games to \""$BUILD_DIR"\"...
pushd "$GAMES_DIR" || exit

echo "=== Building TetriPy ==="
pushd TetriPy || exit
echo "Current directory: $(pwd)"
echo "Sourcing init-venv.sh..."
. init-venv.sh || {
  echo "ERROR: Failed to source init-venv.sh"
  exit 1
}
echo "init-venv.sh sourced successfully"
echo "Running build-web.sh for TetriPy..."
./build-web.sh || {
  echo "ERROR: build-web.sh failed with exit code $?"
  exit 1
}
echo "build-web.sh completed successfully"
echo "Checking if build/web exists..."
if [ -d "build/web" ]; then
  echo "✓ build/web directory found"
  echo "Copying TetriPy build files..."
  mkdir -p "$BUILD_DIR"/TetriPy/web
  cp -r build/web/. "$BUILD_DIR"/TetriPy/web/
  echo "TetriPy files copied successfully"
  ls -la "$BUILD_DIR"/TetriPy/web/ | head -10
else
  echo "ERROR: build/web directory not found for TetriPy!"
  echo "Current directory: $(pwd)"
  echo "Contents of TetriPy directory:"
  ls -la
  echo "Checking for build directory:"
  ls -la build/ 2>&1 || echo "build/ does not exist"
  exit 1
fi
deactivate || true
popd || exit

echo "=== Building FlapPy-bird ==="
pushd FlapPy-bird || exit
echo "Current directory: $(pwd)"
echo "Sourcing init-venv.sh..."
. init-venv.sh || {
  echo "ERROR: Failed to source init-venv.sh"
  exit 1
}
echo "init-venv.sh sourced successfully"
echo "Running build-web.sh for FlapPy-bird..."
./build-web.sh || {
  echo "ERROR: build-web.sh failed with exit code $?"
  exit 1
}
echo "build-web.sh completed successfully"
echo "Checking if build/web exists..."
if [ -d "build/web" ]; then
  echo "✓ build/web directory found"
  echo "Copying FlapPy-bird build files..."
  mkdir -p "$BUILD_DIR"/FlapPy-bird/web
  cp -r build/web/. "$BUILD_DIR"/FlapPy-bird/web/
  echo "FlapPy-bird files copied successfully"
  ls -la "$BUILD_DIR"/FlapPy-bird/web/ | head -10
else
  echo "ERROR: build/web directory not found for FlapPy-bird!"
  echo "Current directory: $(pwd)"
  echo "Contents of FlapPy-bird directory:"
  ls -la
  echo "Checking for build directory:"
  ls -la build/ 2>&1 || echo "build/ does not exist"
  exit 1
fi
deactivate || true
popd || exit

exit # TODO: REMOVE ME

echo Building sdl2-pathfinder...
pushd sdl2-pathfinder || exit
./build_emscripten.sh
mv build "$BUILD_DIR"/sdl2-pathfinder
popd || exit

echo Building SnakePlusPLus...
pushd SnakePlusPlus || exit
./build-wasm.sh
mv build "$BUILD_DIR"/SnakePlusPlus
popd || exit

echo Building shermie-invaders...
pushd shermie-invaders || exit
npm i
npm run build
mv dist "$BUILD_DIR"/shermie-invaders
popd || exit

echo "All games built successfully!"
echo "Final build directory contents:"
ls -la "$BUILD_DIR"/
