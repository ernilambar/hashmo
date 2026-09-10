# hashmo

CLI to write a file with a timestamp-based hash (plaintext, PHP, or JSON).

**Requires Node.js 22 or later.**

## Install

```sh
npm install --save-dev hashmo
```

## Usage

Default: writes `hash.txt` in the current directory with a hex timestamp (e.g. `1901657805c`). On success, the written file path is printed unless you pass `--quiet`.

```sh
hashmo
```

PHP output in a build folder:

```sh
hashmo --type=php --destination=./build/ --output=hash.php
```

```php
<?php return "1901657805c";
```

JSON output:

```sh
hashmo --type=json -d ./dist -o version.json
```

```json
{"hash":"1901657805c"}
```

## Options

| Option | Description |
| --- | --- |
| `-t, --type` | Output type: `plaintext`, `php`, or `json` (default: `plaintext`) |
| `-d, --destination` | Destination directory (default: current directory) |
| `-o, --output` | Output filename (default: `hash.txt`) |
| `--raw` | Use raw decimal timestamp instead of hex |
| `-q, --quiet` | Do not print the written file path |
| `-v, --version` | Show version |
| `-h, --help` | Show help |

## License

Licensed under [MIT](https://opensource.org/license/MIT).

## Copyright

© 2026 [Nilambar Sharma](https://www.nilambar.net)
