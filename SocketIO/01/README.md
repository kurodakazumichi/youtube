# 001 socket.ioとは？

## 状況

- WebRTCやってたらSocket.IOというのが出てきた
- WebSocketに関連した技術らしいけどほぼ名前しか知らない
- とりあえず[公式ドキュメント](https://socket.io/docs/v4/)を読んで勉強してみる



※socket.ioの前にWebSocketをなんとなく知っている前提なところがあるので、先にWebSocketについて学んでおくことが望ましい。無職の学び舎動画だと[WebSocketServerを作る](https://youtu.be/_LUebDfq15s)を見ておくと良いかも。



## 流れ

- Socket.IOってなに？
- Socket.IOにはないもの
- Socket.IOの特徴(WebSocketと比べてどうなの的な)



## Socket.IOってなに？

```mermaid
flowchart LR
Client-->Server
Server-->Client

```

>  Socket.IOは、クライアントとサーバー間の低遅延、双方向、イベントベースの通信を可能にするライブラリです。

WebSocketで出来ることと基本的には似ているというか、立ち位置的には同じ？ただ`Socket.IO`さんのほうが便利機能が充実している感



- WebSocketプロトコル上に構築されている。
- Server側とClient側で利用できる実装(ライブラリ？)がある
- Server側はjs、Java、Pythonで使えるライブラリが用意されている(他もある？)
- Client側はほとんどの主要な言語で使える実装がある(js、Java、C++、Swift、Dart、etc...)



## What Socket.IO is not

> Socket.IO is **NOT** a WebSocket implementation.
>
> (Socket.IOはWebSocketの実装ではありません。)

🤔🤔🤔

いまいちどういうことか理解しにくかったけど、`Socket.IO`は可能な限りWebSocketプロトコルを使って通信をするけど、やりとりに追加のメタデータ(要するにSocket.IO独自のデータ？)を追加するので、「WebSocketを使って実装したクライアント側のプログラム」から「Socket.IOで実装されたサーバー」には正常に接続できないし、逆に「Socket.IOで実装されたクライアント側のプログラム」から、「プレーンなWebSocketサーバー」に接続することはできない。

つまり、Socket.IOを使う場合はサーバー、クライアントの両方が**Sokcet.IO**を使って実装しないとたいていうまくいかんぞっていうことを言っているのではないかと思う。

以下のようなコードではサーバーに繋がらないよと書いてあった。

```js
const socket = io("ws://echo.websocket.org");
```



> Socket.IO is not meant to be used in a background service for mobile applications.
>
> (Socket.IOは、モバイルアプリケーションのバックグラウンドサービスでの利用を想定していません。)

Socket.IOライブラリはサーバーとのTCP接続をオープンにしておくため、ユーザーのバッテリー消費が激しくなる可能性があるとのこと、モバイルアプリ用途とかだったらFCM(Firebase Cloud Messaging)みたいなサービスを使ってねということらしい。

今はそこまで考えてないしFirebaseの事は忘れるとする。



## 特徴

WebSocketと比べてSocket.IOがどうなのかという話

### HTTP long-polling fallback

基本はWebSocketで接続を試みるけど、無理だったらHTTPロングポーリングにフォールバックするよ



### Automatic reconnection

サーバーとクライアント間の接続が切れたとき、自動的に再接続する仕組みがあるよ

Socket.IOには接続の状態を定期的にチェックするハートビートメカニズムが搭載されていて、クライアントが切断されると、なるべくサーバーに負担をかけないように再接続する仕組みがあるらしい



### Packet buffering

クライアントが切断されたとき、パケットは自動的にバッファされて再接続時に送信されるよ



## 疑問点

### Socket.IOは今でも必要？

技術の流行り廃れが激しいので、Socket.IOって今でも使えるの？という疑問に対して公式の見解は

Socket.IOを使わないでWebSocketで実装する場合、結局のところSocket.IOで実装されている再接続や、確認応答の仕組みを自分で実装することになると思うんだよね的な事が書かれてる。

2022年4月24日現在の個人的な見解だと、サーバー、クライアント間で通信するならSocket.IOは有効打なんじゃないかと思う。



### Socket.IOプロトコルのオーバーヘッド

Socket.IOの通信ではWebSocketのプレーンなデータにちょっとデータを追加するので、データは数バイト増えるらしい

けど基本的にWebSocketプロトコルでやり取りしているのであれば、相違点はその追加される数バイトのデータくらいなのかなという所感、一応[カスタムパーサー](https://socket.io/docs/v4/custom-parser/)というのを使って、追加されるデータを削減する事もできるらしいが今は放置する。



## まとめ

今回は公式ドキュメントのIntroductionをさらっと読んでみた。

まずは実際に使ってみなことには感覚もわからないので、次は実際に使いながら試していきたいと思う。
