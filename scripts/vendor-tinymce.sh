#!/usr/bin/env bash
set -euo pipefail

VER_DEFAULT="4.7.13"
VER="${1:-$VER_DEFAULT}"
DEST="web/public/vendor/tinymce/$VER"

mkdir -p "$DEST/themes/modern" "$DEST/plugins/table" "$DEST/plugins/lists" "$DEST/plugins/advlist" "$DEST/skins/lightgray/fonts" "$DEST/skins/lightgray/img"

download() {
  local url="$1" out="$2"
  echo "fetch: $url -> $out"
  curl -fsSL "$url" -o "$out" || {
    echo "retry via unpkg/cdnjs"
    return 1
  }
}

get() {
  local path="$1" out="$2"
  download "https://cdn.jsdelivr.net/npm/tinymce@$VER/$path" "$out" || \
  download "https://unpkg.com/tinymce@$VER/$path" "$out" || \
  download "https://cdnjs.cloudflare.com/ajax/libs/tinymce/$VER/$path" "$out"
}

get tinymce.min.js "$DEST/tinymce.min.js"
get themes/modern/theme.min.js "$DEST/themes/modern/theme.min.js"
get plugins/table/plugin.min.js "$DEST/plugins/table/plugin.min.js"
get plugins/lists/plugin.min.js "$DEST/plugins/lists/plugin.min.js"
get plugins/advlist/plugin.min.js "$DEST/plugins/advlist/plugin.min.js"
get skins/lightgray/skin.min.css "$DEST/skins/lightgray/skin.min.css"
get skins/lightgray/content.min.css "$DEST/skins/lightgray/content.min.css"
get skins/lightgray/fonts/tinymce.ttf "$DEST/skins/lightgray/fonts/tinymce.ttf"
get skins/lightgray/fonts/tinymce.woff "$DEST/skins/lightgray/fonts/tinymce.woff"
get skins/lightgray/img/anchor.png "$DEST/skins/lightgray/img/anchor.png"
get skins/lightgray/img/loader.gif "$DEST/skins/lightgray/img/loader.gif"

echo "TinyMCE $VER vendor files prepared under $DEST"
