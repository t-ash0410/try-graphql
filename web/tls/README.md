# Cert

ローカルの実行環境をHTTPSに対応するためのcertをセットアップする。

以下のコマンドをローカルのホストマシン上で実行することで証明書が作成される。

```zsh
brew install mkcert
mkcert -install
mkcert localhost 127.0.0.1 ::1
```
