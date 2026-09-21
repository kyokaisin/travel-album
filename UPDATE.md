# 仓鼠旅行 · 第二版更新

## iPad 更新

1. 先在旧网站下载完整备份，保存好尚未发布的照片。
2. 解压更新 ZIP，把里面的文件上传到原仓库最外层，提交覆盖同名文件。
3. 更新包不包含 album.json 和任何旅行照片，不会替换你的公开相册数据。
4. Pages 部署完成后刷新网站。打开「整理相册」，输入已约定的账号密码。
5. 旧版 album.json 的 title 可能还保留旧称。登录后导出公开文件并重新上传，会将公开 title 统一改成「仓鼠旅行」，同时保留所选公开旅行。请先确认本机旅行数据完整。
6. 原 world.json 不再使用，可以删除；它不含个人资料。

## 字体、字号和内容在哪里改

| 要改什么 | 文件 / 位置 |
| --- | --- |
| 全站字体、基础字号、品牌字号、首页大标题字号、配色 | custom.css 顶部变量，有中文注释 |
| 原始布局、间距、各组件字号和手机适配 | style.css |
| 浏览器标题、搜索描述、顶部站名、副标题、底部文字 | index.html |
| 首页标语、按钮、说明和示例旅行文字 | app.js，搜索页面上对应的中文 |
| 自己的旅行名称、照片说明、日记 | 在整理页面修改并导出上传；公开数据存于 album.json |
| 底图提供商、路线样式、缩放范围 | map.js |

地图使用本地保存的 Leaflet / MapLibre 程序和 OpenFreeMap 在线矢量瓦片（Positron 样式，排除 maritime 海上边界）；没有第三方字体、统计脚本或实时定位功能。版权信息保留在地图右下方。底图采用标准地理配色，页面与标记保持原来的绿色。

## 账号密码的实际权限

新增的是「本机入口锁」。刷新或关闭页面后需要重新输入；可以用「锁定整理空间」退出。密码不会上传到服务器，公开代码保存摘要而非原文，但可被猜测或绕过；它不加密浏览器里的草稿。

访客不能通过网站直接修改你的公开相册。真正公开发布仍由 GitHub 仓库写入权限控制。不要把入口密码用于 GitHub 或其他重要账号。需要真正的服务器账号密码登录及直接上传时，必须另建认证与上传后端，不能只靠 GitHub Pages。

## 隐私检查和剩余事项

- 新版页面、默认标题与文档已去掉原来的个人姓名；公开导出会使用统一站名。
- 当前公开仓库旧提交仍含个人邮箱，旧版本源码仍能查到旧站名中的姓名。覆盖文件不能删除这些历史。
- 在 GitHub 的个人 Settings → Emails 开启 Keep my email addresses private；若提供 Block command line pushes that expose my email，也开启。未来电脑提交必须配置 GitHub 提供的 noreply 邮箱。这不会更改旧提交。
- 要清理旧记录，需要在备份后重写受影响的 Git 历史，并视情况联系 GitHub Support 清理缓存引用；第三方已下载的副本无法保证回收。此更新没有删除仓库或改写提交历史。
- 仓库地址仍关联 GitHub 用户名。检查个人主页、头像、简介及其他公开仓库是否能关联真实身份。本次没有完成整个 GitHub 账号的隐私审计。
- 站点没有读取或展示用户设备 IP、邮箱、精确实时定位的代码，也没有分析统计。GitHub 托管及 OpenFreeMap 地图服务仍会处理网络 IP、浏览器信息；搜索非内置城市时 Open-Meteo 会收到搜索词及请求信息。
- 通过编辑器选择的照片会重新编码为 JPEG，并使用随机文件名，避免直接带出原照片 EXIF 和原文件名。直接上传原图到仓库不经过此流程。
- 照片画面、路牌、人脸、证件、日记、日期与公开地点本身也可能识别个人；发布前自行检查。被移除的旧照片与历史版本不会自动删除。
- 完整备份包含未公开草稿，只放在个人设备或私人备份空间，不上传公开仓库。

参考：
- https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address
- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
- https://operations.osmfoundation.org/policies/tiles/
- https://leafletjs.com/
