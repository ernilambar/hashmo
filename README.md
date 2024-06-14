# hashmo

Create a file with hashed value obtained from timestamp.

Hashed value would look like `1901657805c` or similar.

## Install

```sh
npm install --save-dev hashmo
```
## Examples

Generate file named `hash.txt` with encoded timestamp in root folder.

```sh
hashmo
```

Generate a PHP file named `hash.php` with encoded content in `build` folder.

```sh
hashmo --type=php --destination=./build/ --output=hash.php
```

Output file would look like:

```php
<?php return "1901657805c";
```

## Options

| Argument | Description |
| --- | --- |
| -t, --type <type> | Output type (choices: "plaintext", "php", default: "plaintext") |
| -d, --destination <dir> | Destination directory. Defaults to root directory. |
| -o, --output <filename> | Output file name with extension (default: "hash.txt") |
| --raw | Keep raw timestamp without encoding. |
| -v, --version | Output the current version. |
| -h, --help | Display help for command. |

## Copyright and License

This project is licensed under [MIT](https://opensource.org/license/MIT).

2024 &copy; [Nilambar Sharma](https://www.nilambar.net).
