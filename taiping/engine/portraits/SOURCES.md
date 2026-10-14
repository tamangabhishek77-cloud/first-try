# Portrait sources (Wikimedia Commons, public domain)

| key | Commons file |
|---|---|
| hong | Alleged engraving of Hong Xiuquan (square edit).jpg — alleged likeness |
| zengF | Zeng Guofan Photograph.jpg |
| zengQ | 平定粵匪功臣像─曾國荃像.jpg |
| gordon | Charles George Gordon by Geruzet Freres.jpg |
| ward | Fredericktward.jpg |
| liangFa | Liang Fa, the first Chinese evangelist.jpg |
| emperor | Xianfeng (closeup).jpg |
| sun | Sun Yat Sen portrait 2.jpg |
| mao | Mao Zedong in Yan'an.jpg |

`proc.py` crops each to the face and tints it sepia into `proc/<key>.png`; `gfx.mjs` `medallion()` draws the photo in place of the drawn bust when one exists.
