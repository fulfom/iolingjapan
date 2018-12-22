+++
title = "ポスター"
description = "poster"
keywords = []
+++

## ポスターの例題

例題 : 以下はトンガ語で書かれた数式です。  
valu ono = 86  
tolu × tolu tolu = hiva hiva  
taha tolu × fitu noa = hiva taha noa  
ua nima × fā = taha noa noa  
(a) 324 をトンガ語で表してください  
(b) fitu ua valu を算用数字で書いてください  

<details><summary>解答解説</summary>
解答  
(a) tolu ua fā  
(b) 728  

解説  
(1) 同じ数字を表す数詞はないだろう  
(2) 全ての数詞は負でない整数を表すはず  

tolu × tolu tolu = hiva hiva に注目  
tolu tolu の解釈を考える  
tolu × n + tolu (位取り)  

86 が2桁で表されることから, 10進数以上であると分かる。n = 10, 20 と予想。  

tolu^2 × (n+1) = hiva × (n+1)  
\> tolu^2 = hiva  
よって tolu = 2, 3, 4  
hiva = 4, 9, 16  

taha tolu × fitu noa = hiva taha noa に注目  

一の位は最初に言うのか, 最後に言うのか  
例) taha tolu は tolu × n + taha か taha × n + tolu か？  

最初説(tolu × n + taha; 小から大)  
最も大きな位を掛け合わせただけで noa + 1 以上になってしまう場合数式が成り立たないので  
noa × tolu < noa +1  
tolu < 1+ 1/noa (noa は最高位に出るので0ではない)  
tolu = 1  
tolu は 2, 3, 4だったので矛盾  
よって最後説(taha × n + tolu; 大から小)が正しい  

省略するが n = 20 とすると矛盾するのでこの言語は10進数  
言語の側面から見ることも可能で, 20進数にしては数詞が少なく, 派生接辞もないので10進数だろうと言える。  

taha tolu × fitu noa = hiva taha noa の 1の位だけに注目する  
左辺の1の位の積の1の位は noa (言い換えると, tolu × noa ≡ noa (mod 10))  
tolu に候補の数をあてはめてみる  
tolu = 2 のとき noa = 0  
tolu = 3 のとき noa = 0, 5  

ua nima × fā = taha noa noa に注目  
tolu = 3, noa = 5 のとき,  
taha noa noa = 55 + 100 × taha  
155 = 5×31  
255 = 3×5×17   
455 = 5×7×13  
755 = 5×151  
全て(1)に反するので矛盾 noa = 0  
同様に taha noa noa = 100 × taha について taha に色々数字をあてはめると, 25×4 = 100 以外は数字被りがあるのでこれが正しい  

13 × fitu × 10 = 910 となるので  
fitu = 7  
</details>