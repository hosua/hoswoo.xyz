#!/bin/bash

set -e # Exit on error

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
if ! pip list | grep -q pygbag; then
  . init-venv.sh
  VENV_ACTIVATED=1
fi
./build-web.sh
mkdir -p "$BUILD_DIR"/TetriPy/web
cp -r build/web/. "$BUILD_DIR"/TetriPy/web/
if [ -n "$VENV_ACTIVATED" ]; then
  deactivate
  unset VENV_ACTIVATED
fi
popd || exit

echo Building FlapPy-bird...
pushd FlapPy-bird || exit
if ! pip list | grep -q pygbag; then
  . init-venv.sh
  VENV_ACTIVATED=1
fi
./build-web.sh
mkdir -p "$BUILD_DIR"/FlapPy-bird/web
cp -r build/web/. "$BUILD_DIR"/FlapPy-bird/web/
if [ -n "$VENV_ACTIVATED" ]; then
  deactivate
  unset VENV_ACTIVATED
fi
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
