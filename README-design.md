# 仓鼠旅行：设计修改与维护指南

适用版本：2026-09-21 的静态相册，使用 GitHub Pages、Leaflet + MapLibre、OpenFreeMap 青绿色底图，以及单张 500 KB 自动压缩。

本文按本项目实际文件和选择器编写。示例是供你选择的修改方案，不是让你把所有代码同时粘贴进去。后续如果网站结构重做，部分入口也会改变。

## 1. 先记住四个主要入口

| 想修改什么 | 主要文件 | 怎么找 |
| --- | --- | --- |
| 字体、字号、界面颜色、圆角、间距、布局 | `custom.css` | 优先在这个文件修改或追加规则 |
| 网站标题、顶部站名、导航、页脚、网页描述 | `index.html` | 搜索目前页面上显示的文字 |
| 首页标语、按钮、说明、示例旅程、动态页面结构 | `app.js` | 搜索完整文字；同一文字可能出现多次 |
| 海洋、陆地、森林、道路、国界和地图文字颜色 | `map-style.json` | 搜索图层的 `id`，修改其 `paint` |
| 地图默认位置、缩放、路线、地点图标 | `map.js` + `custom.css` | 行为在 JS，地点图标外观在 CSS |
| 浏览器标签页的小图标 | `favicon.svg` | SVG 里的形状和颜色 |
| 旅行名称、照片、城市、日记 | 网站的「整理相册」 | 修改后导出、上传，公开资料在 `album.json` |
| 单张照片体积和像素尺寸 | `compression.mjs` | `PHOTO_MAX_BYTES`、`1800` |

**页面配色和地图配色是两套设置。**改 `custom.css` 不会改变地图海洋；改 `map-style.json` 不会改变网页按钮。

## 2. 文件各自负责什么

| 文件 | 作用 | 日常是否需要改 |
| --- | --- | --- |
| `index.html` | 网页骨架、资源加载顺序、页头页脚 | 改名称和导航时 |
| `style.css` | 原始完整样式，含电脑、平板、手机适配 | 主要用于查找已有规则 |
| `custom.css` | 后加载的自定义样式 | 最常修改 |
| `app.js` | 渲染相册、手账、编辑器、按钮、导入导出 | 改动态文案或功能时 |
| `map.js` | 地图初始化、站点、路线、手动选城市 | 改地图交互时 |
| `map-style.json` | 矢量地图的图层和颜色 | 改底图外观时 |
| `favicon.svg` | 网站小图标 | 换品牌图标时 |
| `album.json` | 已发布旅行目录及照片文件名 | 尽量由编辑器生成 |
| `photo-….jpg` | 编辑器导出的公开照片 | 通过导出上传 |
| `storage.js` | 浏览器本机草稿和照片保存、读取 | 通常不用改 |
| `compression.mjs` | 照片压缩 | 改压缩目标时 |
| `core.mjs` | 数据验证、默认名称、仓库地址、ZIP 处理 | 进阶维护 |
| `access.js` | 本机入口锁的密码摘要 | 不是服务器认证 |
| `leaflet.js`、`leaflet.css` | 地图库依赖 | 不直接编辑 |
| `maplibre-gl.js`、`maplibre-gl.css` | 矢量底图渲染依赖 | 不直接编辑 |
| `leaflet-maplibre-gl.js` | 两个地图库之间的连接程序 | 不直接编辑 |
| `lucerne.jpg` | 初始示例图片 | 发布自己的旅行后示例会隐藏 |
| `world.json` | 最初版简化地图数据，现已不用 | 留着也不会影响新版 |
| 各种 `LICENSE` 文件 | 第三方程序、底图设计的授权说明 | 保留 |
| `GUIDE.md`、`UPDATE.md` 等 | 使用说明和更新说明 | 随功能变化维护 |

旧 `style.css` 里仍有 `.world-map`、`.geography`、`.pin`、`.map-route` 等样式，这是最早的 SVG 地图用的。**现在改它们不会改变新版地图。**

## 3. 修改之前：备份与基本操作

### 3.1 两种备份都需要

1. 网站「整理相册 → 下载完整备份」：保存尚未公开的草稿、照片和文字。
2. 下载仓库代码 ZIP 或在电脑上保留一份副本：保存网站设计。

仓库备份不包含只存在 Safari 里的草稿。完整草稿备份可能含私人内容，不要上传公开仓库。

### 3.2 iPad 上改少量文字

在 GitHub 仓库打开目标文件，找到编辑按钮（通常是铅笔），修改后提交到网站使用的分支。也可以在文本编辑器修改文件后，用 GitHub 的 Upload files 上传同名文件覆盖。

保持文件名不变，不要让系统自动变成 `custom (1).css` 或 `map-style.json.txt`。上传到原文件所在位置；本项目这些入口都在仓库最外层。

### 3.3 有电脑以后

用代码编辑器打开整个网站文件夹，先使用搜索定位文字。Mac 通常用 `⌘F` 搜索当前文件，Windows 用 `Ctrl+F`；全项目搜索可以查到某段文字出现在哪些文件。

`style.css` 和 `map-style.json` 有些内容很长，可以使用编辑器的「格式化文档」展开缩进。格式化只是排版，不应改变内容。

不要用 Word 编辑网页源代码；它可能替换引号或保存成其他格式。保持纯文本、UTF-8 编码。

## 4. 改网站名称、标题和文案

### 4.1 浏览器标题、搜索描述、页头页脚

打开 `index.html`：

```html
<title>仓鼠旅行</title>
<meta name="description" content="仓鼠旅行：在地图上翻阅旅行照片，沿着路线重温每一程。">
```

`title` 是浏览器标签页标题；`description` 是网页描述，搜索引擎是否采用、何时更新不由网站直接控制。

顶部品牌目前在这一段：

```html
<a class="brand" href="#">
  <span class="brand-icon">◎</span>
  <span>仓鼠旅行<small>把旅途收进相册</small></span>
</a>
```

可改站名和副标题的文字，保留标签和 `class`。页脚在 `<footer>` 中单独修改。

### 4.2 首页和动态按钮文字

打开 `app.js` 搜索：

| 页面上的内容 | 搜索文字 |
| --- | --- |
| 首页大标题 | `走过的地方，`、`留下的时光。` |
| 首页英文小标题 | `A PERSONAL TRAVEL ATLAS` |
| 手账区英文标题 | `THE JOURNAL` |
| 手账区中文标题 | `一程，一本手账` |
| 足迹与路线切换 | `我的足迹`、`旅行路线` |
| 照片按钮 | `翻开相册` |
| 手账按钮 | `翻阅手账` |
| 编辑页面标题 | `把这一程，收进相册。` |
| 登录入口页面 | `整理我的旅程` |
| 示例资料 | `const sample=` |

比如把下面的标题片段：

```html
<h1>走过的地方，<span>留下的时光。</span></h1>
```

改成：

```html
<h1>山川与日常，<span>都值得收藏。</span></h1>
```

它在 JavaScript 的 HTML 模板里，不是在 `index.html` 里。

**修改「整理相册」要同时检查两个文件：**`index.html` 定义初始文字，`app.js` 会在页面切换时重新设置文字。只改前者，加载后可能又变回来。

### 4.3 更彻底地更名

如果以后站名再次变更，除 `index.html` 外，还要检查：

- `app.js` 中公开导出的 `album.title` 固定值、版权文字、登录页名称。
- `core.mjs` 的 `emptyAlbum()` 默认标题。
- 已发布 `album.json` 的 `title`，最好通过编辑器重新导出更新。
- `README` 和其他说明文件。

旅行的真实内容在编辑器里修改。不要为了改日记去改演示用的 `sample`。

### 4.4 不要破坏程序标记

修改文字时保留 `id="edit-link"`、`data-action`、`${…}`、反引号和括号等结构。它们用于按钮绑定和动态数据插入。

在 HTML 文字中需要显示 `&`、`<` 时，可写成 `&amp;`、`&lt;`。在 JavaScript 的字符串中直接加入引号、反引号或 `${` 可能影响语法；普通文案修改尽量只替换原来的文字部分。

## 5. 改字体和字号

### 5.1 优先修改 custom.css 顶部变量

```css
:root {
  --body-font: Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --title-font: 'Songti SC', 'Noto Serif CJK SC', Georgia, serif;
  --body-size: 16px;
  --brand-size: 28px;
  --heading-size: clamp(28px, 3vw, 40px);
}
```

| 变量 | 用途 |
| --- | --- |
| `--body-font` | 正文基础字体 |
| `--title-font` | 已绑定到它的站名和首页标题字体 |
| `--body-size` | 正文基础字号，不会覆盖组件里单独指定的字号 |
| `--brand-size` | 顶部站名字号；手机另有覆盖规则 |
| `--heading-size` | 首页及编辑页主标题字号 |

`clamp(28px, 3vw, 40px)` 表示根据屏幕宽度变化，最小 28px、最大 40px。想固定大小可以改成 `34px`。

字体按列表顺序尝试，设备没有对应字体时使用后面的替代字体。**只写一个字体名，不会自动下载该字体。**因此 iPad、Windows、Mac 的最终字形可能不同。

### 5.2 让更多标题也使用同一字体

当前部分组件有自己的字体设置，不会随着标题变量全部变化。可在 `custom.css` 最后追加：

```css
.memory-body h2,
.section-heading h2,
.trip-body h3,
.start-card h3,
.login-card h1 {
  font-family: var(--title-font);
}
```

若喜欢现代无衬线风格，把 `--title-font` 改成和 `--body-font` 相同的字体列表即可。

### 5.3 单独改某一块的字号

```css
/* 导航文字 */
.header nav { font-size: 15px; }

/* 站名下的小字 */
.brand small { font-size: 13px; letter-spacing: 1px; }

/* 右侧地点名称 */
.memory-body h2 { font-size: 32px; }

/* 旅行卡片名称 */
.trip-body h3 { font-size: 23px; }

/* 按钮文字 */
.primary, .secondary { font-size: 15px; }

/* 照片和地点说明 */
.memory-note { font-size: 16px; line-height: 1.9; }
```

`font-size` 是字号，`line-height` 是行距，`letter-spacing` 是字距，`font-weight` 是字重。

注意 `.brand>span:last-child` 的手机字号在 `custom.css` 的 `@media(max-width:600px)` 中固定为 22px。若只改桌面变量却发现手机没变，也要改这一处。

### 5.4 自己上传字体文件

如需在不同设备显示同一字体，可使用有网页嵌入许可的 `.woff2` 文件。例如上传 `travel-font.woff2` 到仓库最外层，然后在 `custom.css` 追加：

```css
@font-face {
  font-family: 'TravelFont';
  src: url('./travel-font.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

:root {
  --title-font: 'TravelFont', 'Songti SC', serif;
}
```

上述文件名是示例，项目并没有自带这份字体。中文字体可能很大，且不一定包含全部汉字；先核对许可和覆盖范围。地图文字使用另一套在线字形资源，不会跟着网页 `@font-face` 改变。

## 6. 改网页颜色

### 6.1 当前主色变量

在 `custom.css` 顶部修改：

```css
:root {
  --ink: #19382f;     /* 主要文字 */
  --green: #235c49;   /* 主按钮、地点标记 */
  --paper: #f8f7f3;   /* 网页背景 */
  --line: #d7dfd4;    /* 边框 */
  --muted: #6d7c71;  /* 次要文字 */
  --gold: #b47936;   /* 序号和部分强调色，原定义在 style.css */
}
```

可以将 `--gold` 加入现有的 `:root`，不必专门去编辑 `style.css`。

### 6.2 变量没覆盖到的颜色

部分组件颜色直接写在样式里。若改了主色后仍有旧颜色，可追加对应规则：

```css
.heading h1 span { color: #718a70; }
.primary:hover { background: #184735; }
.secondary { background: #fffdf7; border-color: #c4d4bb; }
.tabs { background: #e8eedf; }
.map-toolbar, .map-bottom { background: #f6f7ef; }
.trip-card, .editor-card { background: #fffef9; }
.start-card { background: #edf2e3; }
.notice { background: #edf3e7; color: #526a47; }
```

浏览器地址栏的主题色在 `index.html`：

```html
<meta name="theme-color" content="#235c49">
```

网站小图标的颜色在 `favicon.svg`。它们不会自动跟着 CSS 变量变化。

尽量让正文和背景有足够明暗差；不要把按钮文字、城市名和说明一起改成很淡的颜色。

## 7. 改地图颜色与文字

### 7.1 现在使用哪套地图

Leaflet 管理拖动、缩放、地点和路线，MapLibre 渲染矢量底图；底图样式保存在 `map-style.json`，在线地图数据来自 OpenFreeMap。

`map.js` 中的入口是：

```js
const MAP_STYLE='./map-style.json';
```

日常改色只需要修改 JSON，不必更换地图服务或地图程序。

### 7.2 地图颜色速查

在 `map-style.json` 的 `layers` 数组中，按 `id` 搜索：

| 图层 id | 影响范围 | 属性 | 青绿版颜色 |
| --- | --- | --- | --- |
| `background` | 基础陆地背景 | `background-color` | `#e1e9d5` |
| `water` | 海洋、湖泊 | `fill-color` | `#c2dedb` |
| `park` | 公园 | `fill-color` | `#c4d9ae` |
| `landcover_wood` | 林地 | `fill-color` | `#b3cc9c` |
| `landuse_residential` | 居住用地 | `fill-color` | `#ecebdc` |
| `waterway` | 河流线 | `line-color` | `#a5cecb` |
| `building` | 建筑 | `fill-color`、`fill-outline-color` | `#dcdcc9`、`#c6ceb9` |
| `boundary_2` | 国家级边界 | `line-color` | `#96a98d` |
| `boundary_3` | 部分下级行政边界 | `line-color` | `#96a98d` |
| `boundary_disputed` | 争议边界线 | `line-color` | `#96a98d` |
| `label_city`、`label_city_capital` | 城市文字 | `text-color` | `#486044` |
| `label_country_1/2/3` | 国家文字图层 | `text-color` | `#486044` |
| `water_name_point_label`、`water_name_line_label` | 水域名称 | `text-color` | `#537f7b` |

`label_country_1/2/3` 是三个独立 id，不是一个包含斜杠的 id。

例如找到 `"id": "water"` 对应的对象，只把它的 `paint` 中 `fill-color` 改成：

```json
"fill-color": "#b8deda"
```

**这是属性片段，不是整个文件。不要用这一行覆盖整个 JSON。**也不要删除同一个图层里的 `source`、`source-layer`、`filter` 等字段。

道路的 `id` 多以 `highway_` 开头；`casing` 是外边线，`inner` 是内部。单改一层可能只改到部分道路。

森林和道路有缩放条件，部分颜色要放大后才明显。它们并不是所有缩放级别都会显示。

### 7.3 地图文字字号

地图文字不受网页 `font-size` 控制。找到对应文字图层，查看 `layout` 的 `text-size`。有些字号是根据缩放级别计算的数组，不是单个数字。

初学者可以只调整已有数值，保留数组结构；不要把 `text-field` 中的地名表达式误删。更改字体还会涉及 `text-font` 与 `glyphs` 字形服务是否匹配，不建议随意填网页字体名。

### 7.4 防止海上“泡泡”回来

当前边界图层的过滤条件包含：

```json
["!=", ["get", "maritime"], 1]
```

这是排除海上边界的条件，改色时保留它。不要为恢复颜色换回旧的 OpenStreetMap 图片瓦片地址，那会重新带回之前的海上边界圈。

### 7.5 JSON 编辑注意事项

- 键名和文字用英文双引号。
- 相邻属性之间有逗号，最后一个属性后不要多加逗号。
- 不支持 `//` 或 `/* */` 注释。
- 改完可以用编辑器检查 JSON 语法。
- 地图右下角的来源和许可署名需要保留。

## 8. 改地图位置、路线和地点标记

### 8.1 默认中心与缩放

`map.js` 初始化中有：

```js
.setView([23,15],2)
```

Leaflet 的顺序是 **[纬度, 经度]**。最后的 `2` 是缩放级别，越大越近。

例如改成偏向欧洲的视角：

```js
.setView([48,10],4)
```

地图「全球」按钮里也有一次 `.setView([23,15],2)`。如果希望点击按钮后回到新默认位置，两处都要改；如果只想初次打开聚焦欧洲、按钮仍显示全球，则只改初始化那一处。

旅行路线模式会调用 `fit()` 根据站点自动调整范围，所以不一定使用上述默认视角。

### 8.2 路线颜色和线型

在 `map.js` 搜索 `L.polyline`，当前参数包括：

```js
{color:'#235c49',weight:3,opacity:.85,dashArray:'7 7',interactive:false}
```

| 参数 | 含义 |
| --- | --- |
| `color` | 路线颜色，当前写死在 JS 里，不跟随 `--green` |
| `weight` | 线宽 |
| `opacity` | 不透明度，0～1 |
| `dashArray` | 虚线的实线和空隙长度 |

想改金色实线，可把 `color` 改为 `'#b47936'`，并删除整个 `dashArray:'7 7',` 属性。保留其他代码，特别是跨日期变更线的处理。

当前路线是站点之间的行程示意，不是实际道路导航或 GPS 轨迹。

### 8.3 地点标记颜色与大小

颜色来自 `custom.css` 中 `.travel-marker span` 的 `background:var(--green)`。

只改变颜色，可追加：

```css
.travel-marker span { background: #b47936; }
```

当前有编号圆点为 26×26px，普通空心内容的圆点通过 `:empty` 规则缩为 17×17px。要把有编号标记放大到 30×30px，应同时修改：

```css
.travel-marker span { width: 30px; height: 30px; font-size: 12px; }
```

以及 `map.js` 中 `L.divIcon` 的：

```js
iconSize:[30,30],iconAnchor:[15,15]
```

普通点的 `.travel-marker span:empty` 也要相应调整尺寸和 `margin`，否则中心可能偏移。不要只放大外观而忽略图标锚点。

## 9. 改图标

### 9.1 左上角品牌图标

当前是 `index.html` 的：

```html
<span class="brand-icon">◎</span>
```

最简单可改为：

```html
<span class="brand-icon" aria-hidden="true">🐹</span>
```

Emoji 在不同设备上可能长得不同。如果想固定外观，可以上传自己的 `hamster-logo.svg` 或 PNG：

```html
<span class="brand-icon"><img src="./hamster-logo.svg" alt=""></span>
```

然后在 `custom.css` 追加：

```css
.brand-icon img { width: 38px; height: 38px; object-fit: contain; }
```

上述 logo 文件需你自己提供。这里保留外面的 `span`，避免破坏现有品牌选择器。旁边已有站名，因此装饰图片可以使用空 `alt`。

### 9.2 浏览器小图标

`favicon.svg` 的 `fill` 是填充色，`stroke` 是线条色。可以直接调整当前图形，或用自己制作的同名 SVG 覆盖它。

如果换成 PNG，需要同时修改 `index.html`：

```html
<link rel="icon" href="./favicon.png" type="image/png">
```

浏览器的小图标缓存可能比网页更久。如果仅改图标却看不到变化，可给图标地址加版本参数，例如 `./favicon.svg?v=2`。

### 9.3 按钮上的箭头、符号

大部分 `↗`、`◎`、`⌁`、`＋` 是文字字符，并非图片。在 `app.js`、`index.html` 或 `map.js` 搜索相应文字后修改。

只删除文字里的箭头，保留按钮的 `id`、`data-action` 和 `aria-label`。不要全局删除所有 `+`，它也是 JavaScript 运算符。

## 10. 改布局、留白、圆角和照片展示

以下例子均放在 `custom.css` 最后。相同项目尽量保留一份有效规则，避免越追加越难找。

### 10.1 页面宽度

```css
main, .header, footer {
  width: 92%;
  max-width: 1320px;
}
```

`width` 控制小屏幕左右留白，`max-width` 控制大屏幕最大内容宽度。

### 10.2 地图高度

```css
/* 只调整公开相册，不影响编辑器中的小地图 */
#atlas-map { min-height: 500px; }

@media (max-width: 760px) {
  #atlas-map { min-height: 360px; }
}
```

编辑器地图用 `#editor-map` 单独设置，注意同时考虑已有 `height` 和 `min-height`。

### 10.3 右侧地点卡片宽度

```css
@media (min-width: 761px) {
  .atlas { grid-template-columns: minmax(0, 1fr) 350px; }
}
```

原版中等屏幕会用更窄的侧栏，上例会覆盖它；修改后要检查 iPad 横屏是否仍有足够地图空间。不要把双栏规则无条件应用到手机。

### 10.4 旅行卡片每行几个

```css
.trip-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }

@media (max-width: 1100px) {
  .trip-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 760px) {
  .trip-grid { grid-template-columns: 1fr; }
}
```

`gap` 是卡片间距。`padding` 是卡片内容与边缘的距离，`margin` 是元素外部距离。

### 10.5 卡片圆角与阴影

```css
.atlas, .trip-card, .editor-card { border-radius: 18px; }
.trip-card { box-shadow: 0 6px 20px #19382f0d; }
.trip-body { padding: 24px; }
```

### 10.6 照片被裁切怎么办

当前封面使用 `object-fit: cover`：照片填满固定框，多余部分会被裁掉；不会修改原文件。

要显示完整照片：

```css
.trip-cover img,
.memory-cover img {
  object-fit: contain;
  background: #edf1e8;
}
```

`contain` 会保留完整比例，但可能出现留边。想继续铺满、优先保留上半部分，可以用：

```css
.trip-cover img { object-fit: cover; object-position: center 30%; }
```

其他照片入口：`.journal-photo img` 是手账照片，`.photo-card>img` 是编辑器缩略图，`.light-photo` 是弹窗大图。弹窗目前已用 `contain`。

当前每站第一张照片作为本站封面；旅行卡片使用按站点顺序找到的第一张照片。调整封面优先在编辑器中调整照片或站点顺序，而不是在 CSS 里指定图片。

## 11. 手机和平板为什么和电脑不一样

原 `style.css` 含 1100px、760px 的窄屏规则，以及 1450px 以上的大屏规则；`custom.css` 还有 600px 以下的覆盖。

这些数值判断的是浏览器视口宽度，不是设备型号。iPad 横竖屏、分屏可能触发不同布局。

修改时检查三种宽度：宽屏电脑、iPad、窄屏手机。网页内按钮至少保持容易点按；不要为了好看让关闭按钮或提交按钮太小。

**追加规则的位置很重要。**例如在文件最后添加全局 `.brand>span:last-child { font-size:30px; }`，可能盖过前面为手机设置的 22px。需要手机字号时，将相应 `@media` 规则放在这条全局规则之后。

## 12. CSS 修改不生效时怎么判断

当前加载顺序是：地图库样式 → `style.css` → `custom.css`。

通常把自定义规则写在 `custom.css` 后面即可覆盖原样式，但并非“最后一条永远赢”：选择器更具体、`!important`、行内样式等都会影响优先级。

排查顺序：

1. 确认文件名、路径和提交分支正确。
2. 确认 Pages 部署成功。
3. 搜索该选择器，看看是否还有手机规则或更具体的规则。
4. 确认正在修改当前地图的样式，而不是旧 SVG 地图规则。
5. 刷新页面；用无痕窗口只检查外观。

不要一上来给所有规则加 `!important`。例如 `.heading h1 span` 比普通的 `h1` 规则更具体，要改标题后半句应直接覆盖它。

## 13. 照片压缩和存储：与设计相关的设置

`compression.mjs` 中：

```js
export const PHOTO_MAX_BYTES=500000;
```

这是每张最大 500,000 字节，约 500 KB，不是每张都必须刚好 500 KB。

最长边在 `Math.min(1800, …)` 中定义；JPEG 先尝试质量 `.88`，再降低质量，必要时进一步缩小尺寸。更高像素和更高画质不一定能同时满足固定体积上限。

这些设置只作用于之后通过编辑器新选择的照片，不改变手机原图，也不会重新压缩已经发布的照片。若改上限，顺便更新 `app.js` 和说明文档中“500 KB”的文字。

**当前仍有功能限制：所有纳入公开的旅行合计最多 98 张照片，导出和备份另有约 90 MB 限制。**这不是每段旅行 98 张。不要只改报错文字或把数字调大就当作支持任意照片量；更多照片需要配套的分批上传、增量导出和备份方案。

## 14. 登录入口与隐私

`access.js` 只是本机入口锁，不是安全的服务器后台，也不加密草稿。真正更改公开网站需要 GitHub 仓库写入权限。

如果以后换入口凭据，当前程序是将“账号 + 英文冒号 + 密码”的 UTF-8 文本计算 SHA-256，并与 `digest` 比较。不要直接把密码文字填入 `digest`；摘要也不能让弱密码或前端验证变成安全认证。本文不列出实际凭据，方便将指南公开放在仓库里。

设计修改时不要把真实姓名、私人邮箱、住址或私人备份放入网页、注释、README。公开仓库的源码和历史同样可读；改掉当前文字不代表旧提交消失。

照片经过编辑器重新编码会丢弃原图 EXIF，但画面上的证件、门牌、人脸以及公开行程本身仍可能识别个人。

## 15. 修改完怎样预览和发布

### 15.1 电脑本地预览

不要直接双击 `index.html` 作为最终检查方式。本项目使用 JavaScript 模块和 `fetch`，通过 `file://` 打开可能失败。

如果电脑已经安装 Python，在网站文件夹中打开终端运行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Windows 安装了 Python 启动器时可使用：

```sh
py -m http.server 8000 --bind 127.0.0.1
```

再访问 `http://localhost:8000/`。结束时在终端按 `Ctrl+C`。在线地图仍需要网络。

本地预览和线上网站是不同地址，浏览器草稿也分开。本地看不到线上草稿是正常的；需要时导入自己的备份，不要清空旧设备数据。

### 15.2 发布

只上传本次改过的文件；新增字体或图标文件也要一起上传。使用原文件名覆盖，提交到 Pages 已配置的分支后等待部署。

设计修改通常不需要重新上传 `album.json` 和照片。不要为了更新样式把一个空的相册文件覆盖到已有旅行上。

本指南可保留为 `README-design.md`。若希望它成为 GitHub 仓库首页说明，可在保留原说明副本后改名为 `README.md` 上传。README 不会自动出现在相册页脚，若希望访客可打开，可以在 `index.html` 的页脚添加：

```html
<a href="./README-design.md">设计修改指南</a>
```

浏览器对 Markdown 的显示方式可能不同，GitHub 文件页会提供排版后的阅读视图。

## 16. 更新后仍显示旧样式：不要删除草稿

先查看部署是否完成，再刷新或使用无痕窗口检查。无痕窗口只用于确认显示，不要在里面长期整理照片。

**不要清除 Safari 网站数据来解决样式缓存。**这可能把 IndexedDB 里的草稿和照片一并删除。

如果需要给资源标记新版本：

- CSS：把 `index.html` 中链接改成 `./custom.css?v=2`。
- 底图样式：把 `map.js` 的 `MAP_STYLE` 改成 `./map-style.json?v=2`。
- 地图模块：在 `app.js` 中将地图导入路径改成 `./map.js?v=2`。
- 主程序：在 `index.html` 中将主程序地址改成 `./app.js?v=2`。

版本参数要加在**真正变动的资源及引用链上**。只给首页网址加参数，不保证它引用的 CSS、JS 都重新下载。修改地图模块引用后，也要确保新的 `app.js` 已被浏览器加载。

这些参数不改变网站的域名和草稿存储位置。不要改 IndexedDB 数据库名称来解决缓存问题；虽然名字仍沿用早期项目名，但它是找回既有草稿的内部地址。

## 17. 最后检查清单

- [ ] 网站标题、品牌、页脚是否一致？
- [ ] 文字在米白和浅绿色背景上是否清楚？
- [ ] 电脑、iPad、手机有没有横向溢出或挤在一起？
- [ ] 地图能拖动、缩放、选地点，路线和署名正常？
- [ ] 海上边界过滤条件保留了吗？
- [ ] 照片裁切是否符合预期，弹窗能看到完整照片？
- [ ] 整理入口、预览、备份等按钮仍能操作？
- [ ] 没有误覆盖相册目录和照片？
- [ ] 私人信息、凭据和完整备份没有随设计文件公开？

建议每次只修改一个类别，例如先改字体，确认满意后再改布局。这样一旦显示异常，可以很快找到原因。
