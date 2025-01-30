# bench-html-parsers

## このリポジトリについて
htmlのparserライブラリの性能検証

## ビルド
```console
$ npm ci
$ npm run build
```

## 使い方
```
Usage: npm run start -- (jsdom|htmlparser2) <infile> [<outfile>]
```

### 実行例
jsdomで性能測定のみ実行
```console
$ npm run start -- jsdom sample.html
```

htmlparser2で性能測定 + 変換後html出力
```console
$ npm run start -- htmlparser2 sample.html output.html
```
