# Fusion Pixel 字体资源

使用 [TakWolf/fusion-pixel-font](https://github.com/TakWolf/fusion-pixel-font) 的 [2026.09.01 发布版本](https://github.com/TakWolf/fusion-pixel-font/releases/tag/2026.09.01)，规格为 **12px / proportional / zh_hans / OTF WOFF2**。12px 表示字体设计规格，CSS 仍可设置别的字号；实际显示会随字号、浏览器缩放和设备像素比变化。

## 文件

| 文件 | 大小 | 用途 |
|---|---:|---|
| `fusion-pixel-12px-zh-hans-2026-09-01.css` | 886,321 字节 | 与当前已上传文件逐字节相同，内嵌字体和 Fusion Pixel 主许可证；上传它即可使用 |
| `fusion-pixel-12px-proportional-zh_hans.otf.woff2` | 661,212 字节 | 从官方压缩包原样提取，作为可编辑教程的源资源 |

CSS 使用字体族别名 `Fusion Pixel Blog`，声明 `font-style: normal`、`font-weight: 400` 和 `font-display: swap`。此别名用于网页选择字体，没有修改字体文件内部名称。加载期间页面可以先显示后备字体。

CSS 以 Base64 内嵌 WOFF2，所以原始文件体积会增加；它并不是请求每个汉字的图片。字体 CSS 上传一次后，各篇页面引用同一地址，实际跨页缓存仍取决于服务器响应头和浏览器缓存状态。

## 来源与校验

原始发布资产：

[fusion-pixel-font-12px-proportional-otf.woff2-v2026.09.01.zip](https://github.com/TakWolf/fusion-pixel-font/releases/download/2026.09.01/fusion-pixel-font-12px-proportional-otf.woff2-v2026.09.01.zip)

```text
原始 ZIP SHA256
96a105bf90600c9f589629b7e9cf61ab4d498f1a9af33b6ac6f517d217a3393c

简体中文 WOFF2 SHA256
de421b3da7b20e045f0712ee838f30c225f4610b348efb37e2b31baa98860cbf

已上传字体 CSS SHA256
f02745ce4eb442287c3bc08240e96fadbf921d0e12f5d45623b75d82b617a236
```

本目录只保留使用中的简体中文版本，没有复制同一压缩包内的日文、韩文、繁体中文或拉丁优先变体；不需要再次下载完整 ZIP 才能安装。

## 许可证

字体文件的授权与教程代码分开处理。随源包提供的许可证已原样保存在：

- [Fusion Pixel：SIL Open Font License 1.1](../licenses/fusion-pixel/OFL.txt)
- [Ark Pixel：OFL](../licenses/ark-pixel/OFL.txt)
- [Cubic 11 及其上游许可说明](../licenses/cubic-11/OFL.txt)
- [Galmuri：OFL](../licenses/galmuri/LICENSE.txt)

复用或分发字体资源时保留对应作者、版权和许可文件。若以后重新制作字体子集或改造字体文件，先查看这些上游许可要求；当前同步的是原始字体，没有生成新子集。
