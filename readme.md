# Vite+Vue+PyWebview(32) 项目注意事项

## 1. 项目结构
```
├── static
  ├── assets
  ├── index.html
├── web-page
│ ├── 正常vite目录
├── main.py

```
## 2. 项目配置
### 2.1 修改 vite.config.ts
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "../static",
  },
  base:"./"
})
```
### 2.2 在  ```./web-page/index.html```中添加如下代码
#### 为了解决pywebview的内置服务器不会添加响应头```content-type:text/javascript```引起的type=module的js文件加载失败的问题

```html
<script>
    const urls = []
  const els = document.querySelectorAll('script')
  for (let i = 0; i < els.length; i++) {
    const el = els[i]
    if (el.type === 'module') {
      urls.push(el.src)
      el.remove()
    }
  }
  console.log(urls)
  urls.map(url=>{
    window.fetch(url).then(res=>{
      res.text().then(js=>{
        const elScript = document.createElement('script')
        elScript.type = 'module'
        elScript.innerHTML = js
        document.body.appendChild(elScript)
      })
    })
  })
</script>
```
### 2.2 在 ```main.py```中设置pywebview的启动参数
* 注意
  * 必须设置```url="static/index.html"```
  * 必须设置```http_server=True```

```python
import webview

win = webview.create_window(title="test", url="static/index.html")
webview.start(http_server=True)

```

## 3.pyinstaller打包设置
### 3.1 使用```.spec```文件打包

* 先使用如下命令自动生成一次spec文件
```
pyinstaller -Fw main.py --uac-admin
```
* 生成spec文件如下
 ```python
 # -*- mode: python ; coding: utf-8 -*-


block_cipher = None


a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)
pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='main',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    uac_admin=True,
)
 ```
* 修改spec文件
    * 修改```datas```的值为```[("static","./static")]```，使打包时包含```static```文件夹
    * 修改```name```的值为```你想要的程序名字```

* 再次打包
```
pyinstaller main.spec
```
## 4.python库版本
```
pywebview 3.7.2
python 3.9.13 32位
# 不同位的pywebview在打包时出现的问题不同
```
# 注意事项
* ### 1.pywebview 3.7.2 32位打包时只能在全英文目录下运行
* ### 2.pywebview 3.7.2 64位打包时没有这个限制，有以下限制
```
#以下文件需添加到datas选项中，(目标文件/文件夹路径， 保存路径('.'在多文件打包时为当前exe文件目录， 单文件时为临时释放目录，和程序exe不在同一目录)) 

Microsoft.Toolkit.Forms.UI.Controls.WebView.dll
Microsoft.Toolkit.Forms.UI.Controls.WebView.LICENSE.md
Microsoft.Web.WebView2.Core.dll
Microsoft.Web.WebView2.LICENSE.md
Microsoft.Web.WebView2.WinForms.dll
WebBrowserInterop.x64.dll
WebBrowserInterop.x86.dll
# 文件夹 以上均可在 pywebview库 里面可找到， 保存路径为文件名
x86
arm64
x64

# python运行时 在 python/Lib/site-packages 里面
# 64位打包时不知道为什么没有自己携带上，无语死了
Python.Runtime.dll
```




