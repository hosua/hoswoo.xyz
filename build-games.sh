#!/bin/bash

npm i
npm run update-submodules

GAMES_DIR="./games"
BUILD_DIR="./public/games"

mkdir -p "$BUILD_DIR"
pushd "$BUILD_DIR"
BUILD_DIR="$(pwd)"
popd

echo Building games to \"$BUILD_DIR\"...
pushd "$GAMES_DIR"

echo Building TetriPy...
pushd TetriPy
. init-venv.sh
./build-web.sh
mv build "$BUILD_DIR"/TetriPy
deactivate
popd

echo Building FlapPy-bird...
pushd FlapPy-bird
. init-venv.sh
./build-web.sh
mv build "$BUILD_DIR"/FlapPy-bird
deactivate
popd

echo Building sdl2-pathfinder...
pushd sdl2-pathfinder
./build_emscripten.sh
mv build "$BUILD_DIR"/sdl2-pathfinder
popd

echo Building SnakePlusPLus...
pushd SnakePlusPlus
./build-wasm.sh
mv build "$BUILD_DIR"/SnakePlusPlus
popd

echo Building shermie-invaders...
pushd shermie-invaders
npm i
npm run build
mv dist "$BUILD_DIR"/shermie-invaders
popd


