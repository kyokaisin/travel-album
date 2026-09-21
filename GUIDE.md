# 在 iPad 上使用旅行相册

这个版本只使用 GitHub Pages。没有服务器账单、信用卡绑定、API 密钥或 ChatGPT 登录。整理入口使用本机账号密码锁，不能代替服务器验证。

## 第一次启用网站

打开 https://github.com/kyokaisin/travel-album/settings/pages

在 **Build and deployment** 下选择：

- Source：**Deploy from a branch**
- Branch：**main**
- Folder：**/ (root)**
- 点击 **Save**，等待部署完成。

网站预期地址：https://kyokaisin.github.io/travel-album/

只有 GitHub 显示部署完成后这个地址才可用。

## 整理旅行

1. 用 Safari 打开网站，点击右上角「整理相册」。
2. 填写旅行名称和日期，添加城市。
3. 城市可以用中文或英文搜索，也可以直接点击地图定位后填写名称。
4. 选择一站，再批量选择该城市的照片。没有 GPS 完全不影响使用。
5. 使用箭头调整旅行站点和照片顺序；第一张照片作为本站封面。
6. 填写旅行日记、照片说明与拍摄日期。

照片支持 JPEG、PNG、WebP，每张原图不超过 50 MB；相机 RAW 或 HEIC 请先导出为 JPEG。展示照片在浏览器中缩小至最长边 1800 像素，不保留原始 GPS 元数据。请另外保管原始照片。

## 公开发布

1. 勾选准备公开的旅行的「纳入公开文件」。
2. 点击「预览」检查。
3. 点击「导出公开文件」，下载 ZIP。
4. 打开 iPad「文件」App，在「下载项」轻点 ZIP 解压。
5. 打开 https://github.com/kyokaisin/travel-album/upload/main
6. 点击 **choose your files**，进入解压文件夹，选择 `album.json` 和所有 `photo-….jpg`。
7. 文件放在仓库最外层。不要上传 ZIP 本身，不要多套一层文件夹。
8. 点击 **Commit changes**，等待 GitHub Pages 更新，再刷新相册。

公开仓库里的文件和历史版本均可被他人读取。未勾选的草稿不会进入公开文件包。取消公开后更新 `album.json` 会把旅行从网站中移除，但仓库里的旧图片和历史记录不会自动删除。

## 草稿和备份

整理页面不是服务器后台。草稿和新照片只保存在当前浏览器的 IndexedDB 中，不会同步到其他设备，也不会自动上传。其他人打开整理页面只能整理他们自己设备上的副本；修改此仓库仍需要你的 GitHub 写入权限。

定期点击「下载完整备份」，保存到 iPad「文件」或 iCloud。完整备份包含私人草稿，请不要放入公开仓库。

更换设备后，在新设备打开整理页面，用「恢复 ZIP 备份」选择原始备份文件。请不要重新压缩备份。清理 Safari 网站数据、无痕模式、浏览器空间回收可能导致本机草稿丢失。

「载入网站上的相册」会替换本机草稿；先备份尚未公开的修改。

## 初版范围

- 世界地图可拖动、缩放；地点可点选或用键盘 Enter 打开。
- 路线按站点顺序示意，不是实际 GPS 轨迹；相同城市可重复停留。
- 本机照片整理、备份恢复和公开文件导出。
- 当前单次公开导出最多 98 张照片，以配合 GitHub 网页一次上传不超过 100 个文件；ZIP 不超过 90 MB。更多照片需要后续扩展分批发布。
- 需要联网加载地图、公开相册和搜索未收录城市。常用城市内置在网页中。
- 本机编辑器对外可见，但不能替其他用户提交 GitHub。

## 设计与素材

保留米白与深绿色界面。首次发布自己的旅行后，示例自动消失。

示例照片：Andrew Bossi / Wikimedia Commons，CC BY-SA 2.5，已缩放并在页面展示时裁切。
原图：https://commons.wikimedia.org/wiki/File:6617-6618_-_Vitznau_-_Vierwaldst%C3%A4ttersee.jpg
许可：https://creativecommons.org/licenses/by-sa/2.5/

地图：Leaflet 1.9.4（BSD-2-Clause）+ OpenStreetMap 标准瓦片，版权归 OpenStreetMap contributors。原 world.json 不再使用。
城市搜索：Open-Meteo / GeoNames。

## 今后修改设计

网站源码保存在这个仓库。`index.html` 为页面入口，`style.css` 为样式，`app.js` 为相册交互，`map.js` 为地图，`core.mjs` 为数据与 ZIP，`storage.js` 为本机草稿存储。修改源码并提交后，GitHub Pages 会重新部署。不依赖原来的学校 ChatGPT 工作区。
