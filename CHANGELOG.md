# Changelog

## [2.0.0] - 2025-03-13

* Added - Validation: reject empty or whitespace `--output`; exit 1 with message.
* Added - Validation: destination must be a directory; exit 1 when it is a file.
* Added - PHP output escaping for hash in `--type=php` (safe for any string).
* Added - Version from package.json for `-v` / `--version`.
* Added - `--type=json` writes `{"hash":"..."}`.
* Added - Print written file path on success; `-q, --quiet` to suppress.
* Changed - Write and destination errors go to stderr and exit 1.
* Changed - Fix file descriptor leak when output file already exists.
* Changed - Hash file write uses create-then-overwrite to avoid TOCTOU races.

## [1.0.3]

* Added - CLI: hash from timestamp; plaintext/php; destination, output, raw options.
