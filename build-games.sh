#!/bin/bash

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
mv build "$BUILD_DIR"/TetriPy
deactivate
popd || exit

echo Building FlapPy-bird...
pushd FlapPy-bird || exit
. init-venv.sh
./build-web.sh
mv build "$BUILD_DIR"/FlapPy-bird
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
