# Hugging Face FLUX 写实图像生成

这是一个用于第一次个人作业的最小交互式图像生成项目。它通过 Hugging Face Inference Providers 调用老师指定的 [`XLabs-AI/flux-RealismLora`](https://huggingface.co/XLabs-AI/flux-RealismLora)，模型在 fal 的云端设备上运行，本机只负责显示网页和保存结果。

## Gradio 是什么

Gradio 是一个 Python 界面框架，可以把普通 Python 函数快速包装成浏览器页面。本项目不需要另外编写 React/Vue 前端或后端接口：`generate_image()` 负责调用 API，Gradio 自动提供提示词输入框、生成按钮、状态信息、图片预览和文件下载控件。

## 项目结构

```text
huggingfaceapi/
├── app.py              # API 调用和 Gradio 交互页面
├── requirements.txt    # Python 依赖
├── .env.example        # Token 配置示例
├── .gitignore          # Git 忽略规则
└── outputs/            # 图片和不含 Token 的 JSON 调用记录
```

运行或编译后产生的 `__pycache__/` 会保留在本地，不需要手动清除；它已写入 `.gitignore`，不会被提交到 Git。缓存文件依赖 Python 版本和平台，不参与程序逻辑。

## 1. 准备 Hugging Face Token

1. 登录 Hugging Face，进入 [Access Tokens](https://huggingface.co/settings/tokens)。
2. 创建 Fine-grained Token，并授予调用 Inference Providers 的权限。
3. 复制 `.env.example` 粘贴并改名为 `.env`：
4. 编辑 `.env`，写入自己的 Token：

```dotenv
HF_TOKEN=hf_你的真实Token
```

`.env` 已被 Git 忽略。不要把真实 Token 放入源代码、截图、博客或 GitHub 仓库。

## 2. 安装依赖

在本目录打开 PowerShell：

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## 3. 启动项目

```powershell
.\.venv\Scripts\python.exe app.py
```

程序会自动打开浏览器。也可以手动访问终端显示的本地地址，通常为：

```text
http://127.0.0.1:7860
```

启动页面不会调用模型，也不会产生推理费用。填写提示词并点击“生成图片”后才会发起一次云端请求。

## 4. 作业演示建议

1. 保持 Seed 和生成参数不变，先使用基础提示词生成第一张图片。
2. 截取交互页面和终端中的成功记录，截图时不要显示 `.env`。
3. 修改提示词中的环境、光线、构图和镜头描述，再生成第二张图片。
4. 对比两次结果，在博客中说明提示词为什么这样修改、哪些细节得到改善。
5. 从 `outputs/` 选择最终图片和对应 JSON 记录作为调用成功的证据。

每次调用都会生成两个同名文件：

```text
outputs/flux_日期_时间.png
outputs/flux_日期_时间.json
```

JSON 记录包含模型、服务商、提示词、参数、耗时和执行结果，不会记录 Hugging Face Token。

## 常见问题

### 提示“没有找到 HF_TOKEN”

确认 `.env` 位于 `app.py` 同一目录，并重新启动程序。

### 返回 401 或 403

检查 Token 是否正确，以及是否具有 Inference Providers 调用权限。

### 返回额度或支付错误

在 Hugging Face 的 Billing 与 Inference Providers 设置中检查剩余额度、支付方式和 fal 服务状态。

### 修改代码后没有生效

在终端按 `Ctrl+C` 停止服务，然后重新运行 `app.py`。
