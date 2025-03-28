# Sub-Store 项目结构文档

Sub-Store是一个高级订阅管理工具，支持多种代理平台，包括QX、Loon、Surge、Stash、Egern和Shadowrocket。

## 项目整体结构

```
.
├── LICENSE                           # GPL V3 许可证
├── README.md                         # 项目说明文档
├── backend                           # 后端代码
│   ├── banner                        # 应用横幅信息
│   ├── bundle-esbuild.js             # esbuild打包脚本
│   ├── bundle.js                     # 打包脚本
│   ├── dev-esbuild.js                # 开发环境esbuild启动脚本
│   ├── dist                          # 构建输出目录
│   ├── gulpfile.babel.js             # gulp构建配置文件
│   ├── jsconfig.json                 # JavaScript配置文件
│   ├── package.json                  # 项目依赖配置
│   ├── patches                       # 补丁文件目录
│   └── src                           # 源代码目录
├── config                            # 不同平台的配置文件
├── nginx                             # Nginx配置文件
├── scripts                           # 脚本文件（用于处理节点）
└── vs.code-workspace                 # VSCode工作区配置文件
```

## 后端核心结构 (backend/src)

```
src
├── constants.js                      # 常量定义
├── core                              # 核心功能
│   ├── app.js                        # 应用入口
│   ├── proxy-utils                   # 代理工具
│   │   ├── parsers                   # 各种格式解析器
│   │   ├── preprocessors             # 预处理器
│   │   ├── processors                # 处理器
│   │   ├── producers                 # 各平台订阅生成器
│   │   └── validators                # 验证器
│   └── rule-utils                    # 规则工具
├── main.js                           # 主入口文件
├── products                          # 产品输出
│   ├── cron-sync-artifacts.js        # 定时同步构件
│   ├── resource-parser.loon.js       # Loon资源解析器
│   ├── sub-store-0.js                # Sub-Store核心组件
│   └── sub-store-1.js                # Sub-Store扩展组件
├── restful                           # RESTful API接口
│   ├── artifacts.js                  # 构件管理接口
│   ├── collections.js                # 集合管理接口
│   ├── download.js                   # 下载接口
│   ├── errors                        # 错误处理
│   ├── file.js                       # 文件管理
│   ├── index.js                      # API入口
│   ├── miscs.js                      # 杂项接口
│   ├── module.js                     # 模块管理
│   ├── node-info.js                  # 节点信息
│   ├── parser.js                     # 解析器接口
│   ├── preview.js                    # 预览接口
│   ├── response.js                   # 响应处理
│   ├── settings.js                   # 设置接口
│   ├── sort.js                       # 排序接口
│   ├── subscriptions.js              # 订阅管理接口
│   ├── sync.js                       # 同步接口
│   └── token.js                      # 令牌管理
├── test                              # 测试代码
│   └── proxy-parsers                 # 代理解析器测试
└── utils                             # 工具函数
    ├── database.js                   # 数据库工具
    ├── dns.js                        # DNS工具
    ├── download.js                   # 下载工具
    ├── env.js                        # 环境工具
    ├── flow.js                       # 流量工具
    ├── geo.js                        # 地理位置工具
    ├── gist.js                       # Gist工具
    ├── headers-resource-cache.js     # 头部资源缓存
    ├── index.js                      # 工具入口
    ├── logical.js                    # 逻辑工具
    ├── migration.js                  # 迁移工具
    ├── resource-cache.js             # 资源缓存
    ├── rs.js                         # 资源管理工具
    ├── script-resource-cache.js      # 脚本资源缓存
    ├── user-agent.js                 # UA工具
    └── yaml.js                       # YAML工具
```

## 配置文件 (config)

```
config
├── Egern.yaml                       # Egern配置文件
├── Loon.plugin                      # Loon插件配置
├── QX-Task.json                     # QX任务配置
├── QX.snippet                       # QX片段配置
├── README.md                        # 配置说明文档
├── Stash.stoverride                 # Stash覆盖配置
├── Surge-Beta.sgmodule              # Surge Beta模块
├── Surge-Noability.sgmodule         # Surge无能力模块
├── Surge-ability.sgmodule           # Surge能力模块
└── Surge.sgmodule                   # Surge标准模块
```

## 脚本文件 (scripts)

```
scripts
├── demo.js                          # 示例脚本，展示如何处理节点
├── fancy-characters.js              # 花式字符处理脚本
├── ip-flag-node.js                  # IP国旗节点脚本
├── ip-flag.js                       # IP国旗处理脚本
├── media-filter.js                  # 媒体过滤脚本
├── revert.js                        # 还原脚本
├── tls-fingerprint.js               # TLS指纹脚本
├── udp-filter.js                    # UDP过滤脚本
└── vmess-ws-obfs-host.js            # Vmess WS混淆主机脚本
```

## 功能说明

### 核心功能

- 各种代理协议格式的转换（SS、SSR、VMess、Trojan等）
- 订阅格式化和处理
- 多订阅合并管理

### 支持的输入格式

- 代理URI方案（socks5、http等）
- 多种代理协议URI
- Clash格式
- QX、Loon、Surge等各平台格式

### 支持的输出平台

- JSON格式
- Stash
- Clash.Meta
- Surfboard
- Surge/SurgeMac
- Loon
- Egern
- Shadowrocket
- QX
- sing-box
- V2Ray

### 订阅处理功能

- 正则过滤
- 地区过滤
- 类型过滤
- 脚本过滤
- 代理属性设置
- 节点排序
- 节点重命名
- 域名解析等

### 部署和运行

- 支持Node.js环境运行
- 提供RESTful API接口
- 支持定时任务管理
- 支持与Gist同步配置

### 扩展性

- 提供脚本系统允许用户自定义处理逻辑
- 支持各种平台特有功能的扩展

总体而言，Sub-Store是一个功能强大的代理订阅管理工具，允许用户灵活地处理和转换不同格式的代理订阅，适配各种代理客户端平台，并提供丰富的自定义功能。 