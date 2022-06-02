# サンプルコード

## ヒープ領域のイメージ

※スライド参照



## ヒープ領域の利用例

### ヒープ領域の確保と解放



#### スタブ

```c
#include <stdlib.h>

int main(void) {
}
```



#### 確保

```diff
#include <stdlib.h>

int main(void) {
+	// 1024byteのメモリを確保する
+	// mallocの戻り値は void型のポインタ(void*)である
+	// void* は 汎用ポインタ型といい、とりあえずメモリのアドレスだけど、なんの型なのかは不明という型である
+	void* p = malloc(1024);
}
```

デバッグモードの場合、確保したメモリは`cd`で埋まる



#### 解放

```diff
#include <stdlib.h>

int main(void)
{
	// 1024byteのメモリを確保する
	// mallocの戻り値は void型のポインタ(void*)である
	// void* は 汎用ポインタ型といい、とりあえずメモリのアドレスだけど、なんの型なのかは不明という型である
	void* p = malloc(1024);

+	// 確保したメモリを解放する
+	free(p);
+	return 0;
}
```

デバッグモードの場合、メモリを解放すると`dd`でうまる、これを見て解放されたか確認できる



#### ゼロクリア

```diff
#include <stdlib.h>
int main(void)
{
	// 1024byteのメモリを確保する
	// mallocの戻り値は void型のポインタ(void*)である
	// void* は 汎用ポインタ型といい、とりあえずメモリのアドレスだけど、なんの型なのかは不明という型である
	void* p = malloc(1024);

+	// 確保したメモリ領域を0でクリアする
+   if (p != 0) {
+		memset(p, 0, 1024);
+   }

	// 確保したメモリを解放する
	free(p);
	return 0;
}
```



#### 余談 バッファオーバーランの検知

ちなみにデバッグの場合は指定したメモリの前後に`FD`という4byteの余分なメモリも確保される、これはバッファオーバーラン検知用で、メモリを解放する時にここがFDになってなかったらはみ出したね？っていう検知に使われる



### voidポインタ？

```c
int main() {
  // voidポインタ、voidはないとか不定みたいな意味がある
  void* p = 0;

  // voidポインタは汎用ポインタとも呼ばれcharやint型のアドレスなど、どんな型のアドレスでも入る
  // というかメモリ的には何でも入るけど
  int  a = 10;
  char b = 100;
  p = &a;
  p = &b;

  // voidポインタは参照はできない(C言語の気持ちになってメモリの参照や代入について考えてみよう)
  p = &a;
  *p;       // 参照できない
  *p = 100; // 参照先へ代入できない

  p = &b;
  *p;
  *p = 10;
}
```



### 注意点

```c
#include <stdio.h>
#include <stdlib.h>

int main() 
{
  // メモリを確保
  void* p = malloc(1024);

  // 注意点1 メモリの確保に失敗してる可能性だってある
  if (p == 0) {
    printf("mallocの戻り値が0 = メモリの確保に失敗した\n");
    return 0;
  }

  // 注意点2 自分で確保したメモリは使い終わったら解放すること
  // 解放を忘れると永遠にメモリが解放されない
  // これを「メモリの解放忘れ」や「メモリリーク」という
  free(p);

  // 注意点3 メモリを解放したらポインタには0を入れておく
  // 解放したメモリアドレスは使う事はないし、使ってはいけないので
  p = 0;

  return 0;
}
```



### 配列として使ってみる

#### void* のままだと使えない

```c
#include <stdlib.h>

int main(void)
{
	void* p = malloc(1024);
	if (p == 0) return 0;

	// voidポインタのままだと参照先に代入はできない
	p[0] = 100;

	free(p);
	return 0;
}
```



#### ポインタの型を変えるキャスト

```diff
#include <stdlib.h>

int main(void)
{
+	// void*をchar*にキャスト
	char* p = (char*)malloc(1024);
	if (p == 0) return 0;

+	// char型のポインタなら参照先が1byteだとわかるので代入できる
+   // 1024byteをchar型の配列として使えば1024要素ある配列として扱える
	p[0] = 100;

	free(p);
	return 0;
}
```



#### char型の配列として扱う

```c
#include <stdlib.h>

int main(void)
{
	char* p = malloc(1024);

	// 1024byteのメモリをcharの配列としてみると、配列のサイズは1024 / sizeof(char)
	int size = 1024 / sizeof(char);

	for (int i = 0; i < size; ++i) {
		p[i] = i;
	}

	free(p);
	return 0;
}
```



#### int型の配列として扱う

```diff
#include <stdlib.h>

int main(void)
{
+	short* p = malloc(1024);

+	// 1024byteのメモリをintの配列としてみると、配列のサイズは1024 / sizeof(int)
+	int size = 1024 / sizeof(int);

	for (int i = 0; i < size; ++i) {
		p[i] = i;
	}

	free(p);
	return 0;
}
```



#### double型の配列として扱う

```diff
#include <stdlib.h>

int main(void)
{
+	double* p = malloc(1024);

+	// 1024byteのメモリをshortの配列としてみると、配列のサイズは1024 / sizeof(double)
+	int size = 1024 / sizeof(double);

	for (int i = 0; i < size; ++i) {
		p[i] = (double)i;
	}

	free(p);
	return 0;
}
```



