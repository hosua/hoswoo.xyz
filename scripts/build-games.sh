#!/bin/bash

set -e  # Exit on error

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

echo Building TetriPy...
pushd TetriPy || exit
. init-venv.sh
./build-web.sh
echo "Checking if build/web exists..."
if [ -d "build/web" ]; then
  echo "Copying TetriPy build files..."
  mkdir -p "$BUILD_DIR"/TetriPy/web
  cp -r build/web/. "$BUILD_DIR"/TetriPy/web/
  echo "TetriPy files copied successfully"
  ls -la "$BUILD_DIR"/TetriPy/web/ | head -10
else
  echo "ERROR: build/web directory not found for TetriPy!"
  exit 1
fi
deactivate
popd || exit

echo Building FlapPy-bird...
pushd FlapPy-bird || exit
. init-venv.sh
./build-web.sh
echo "Checking if build/web exists..."
if [ -d "build/web" ]; then
  echo "Copying FlapPy-bird build files..."
  mkdir -p "$BUILD_DIR"/FlapPy-bird/web
  cp -r build/web/. "$BUILD_DIR"/FlapPy-bird/web/
  echo "FlapPy-bird files copied successfully"
  ls -la "$BUILD_DIR"/FlapPy-bird/web/ | head -10
else
  echo "ERROR: build/web directory not found for FlapPy-bird!"
  exit 1
fi
deactivate
popd || exit

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
