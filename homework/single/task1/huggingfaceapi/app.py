"""A minimal interactive FLUX Realism LoRA demo powered by Gradio."""

from __future__ import annotations

import json
import os
import time
from datetime import datetime
from pathlib import Path

import gradio as gr
from dotenv import load_dotenv
from huggingface_hub import InferenceClient


MODEL_ID = "XLabs-AI/flux-RealismLora"
PROVIDER = "fal-ai"
PROJECT_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = PROJECT_DIR / "outputs"

DEFAULT_PROMPT = (
    "A documentary photograph of a quiet university campus after rain, "
    "students walking naturally, wet pavement reflecting soft morning light, "
    "realistic materials and proportions, subtle colors, eye-level view, "
    "35mm lens, natural depth of field"
)

CSS = """
.gradio-container { max-width: 1180px !important; }
.hero { text-align: center; margin-bottom: 0.75rem; }
.hero h1 { margin-bottom: 0.25rem; }
.hint { color: var(--body-text-color-subdued); font-size: 0.92rem; }
#generate-button { min-height: 46px; font-weight: 700; }
"""


def _write_record(record: dict, stem: str) -> Path:
    """Save a token-free JSON record for homework evidence."""
    record_path = OUTPUT_DIR / f"{stem}.json"
    record_path.write_text(
        json.dumps(record, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return record_path


def generate_image(
    prompt: str,
    negative_prompt: str,
    width: int,
    height: int,
    steps: int,
    guidance_scale: float,
    seed: float,
):
    """Call Hugging Face Inference Providers and return a generated image."""
    prompt = prompt.strip()
    negative_prompt = negative_prompt.strip()

    if not prompt:
        raise gr.Error("请输入提示词后再生成。")

    token = os.getenv("HF_TOKEN")
    if not token:
        raise gr.Error("没有找到 HF_TOKEN。请按照 README 创建 .env 文件后重启项目。")

    width = int(width)
    height = int(height)
    steps = int(steps)
    seed = int(seed)
    guidance_scale = float(guidance_scale)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().astimezone()
    stem = timestamp.strftime("flux_%Y%m%d_%H%M%S_%f")
    image_path = OUTPUT_DIR / f"{stem}.png"

    parameters = {
        "width": width,
        "height": height,
        "num_inference_steps": steps,
        "guidance_scale": guidance_scale,
        "seed": seed,
    }
    if negative_prompt:
        parameters["negative_prompt"] = negative_prompt

    record = {
        "status": "started",
        "requested_at": timestamp.isoformat(timespec="seconds"),
        "model": MODEL_ID,
        "provider": PROVIDER,
        "prompt": prompt,
        "parameters": parameters,
    }

    started = time.perf_counter()
    try:
        client = InferenceClient(provider=PROVIDER, api_key=token)
        image = client.text_to_image(
            prompt=prompt,
            model=MODEL_ID,
            **parameters,
        )
        elapsed = time.perf_counter() - started
        image.save(image_path)

        record.update(
            {
                "status": "success",
                "elapsed_seconds": round(elapsed, 2),
                "output": str(image_path.relative_to(PROJECT_DIR)),
            }
        )
        record_path = _write_record(record, stem)

        status = (
            "### 调用成功\n\n"
            f"- 模型：`{MODEL_ID}`\n"
            f"- 服务商：`{PROVIDER}`\n"
            f"- 尺寸：`{width} × {height}`\n"
            f"- Seed：`{seed}`\n"
            f"- 耗时：`{elapsed:.2f} 秒`\n"
            f"- 记录：`{record_path.name}`"
        )
        print(
            f"[SUCCESS] model={MODEL_ID} provider={PROVIDER} "
            f"size={width}x{height} seed={seed} elapsed={elapsed:.2f}s "
            f"output={image_path.name}",
            flush=True,
        )
        return image, status, str(image_path)
    except Exception as error:
        elapsed = time.perf_counter() - started
        record.update(
            {
                "status": "error",
                "elapsed_seconds": round(elapsed, 2),
                "error_type": type(error).__name__,
                "error_message": str(error),
            }
        )
        _write_record(record, stem)
        print(
            f"[ERROR] model={MODEL_ID} provider={PROVIDER} "
            f"type={type(error).__name__} message={error}",
            flush=True,
        )
        raise gr.Error(f"生成失败：{type(error).__name__}: {error}") from error


def build_demo() -> gr.Blocks:
    """Build the single-page Gradio interface."""
    with gr.Blocks(
        title="FLUX 写实图像生成",
        theme=gr.themes.Soft(primary_hue="orange", neutral_hue="slate"),
        css=CSS,
    ) as demo:
        gr.HTML(
            """
            <div class="hero">
              <h1>FLUX 写实图像生成</h1>
              <p>通过 Hugging Face Inference Providers 调用 XLabs Realism LoRA</p>
              <p class="hint">只有点击“生成图片”才会产生云端推理费用。</p>
            </div>
            """
        )

        with gr.Row(equal_height=False):
            with gr.Column(scale=5):
                prompt = gr.Textbox(
                    value=DEFAULT_PROMPT,
                    label="正向提示词",
                    lines=8,
                    placeholder="描述希望生成的真实世界场景……",
                )
                negative_prompt = gr.Textbox(
                    label="负向提示词（可选）",
                    lines=3,
                    placeholder="例如：illustration, CGI, distorted hands, blurry",
                )

                with gr.Accordion("生成参数", open=False):
                    with gr.Row():
                        width = gr.Dropdown(
                            choices=[512, 768, 1024], value=768, label="宽度"
                        )
                        height = gr.Dropdown(
                            choices=[512, 768, 1024], value=1024, label="高度"
                        )
                    with gr.Row():
                        steps = gr.Slider(
                            minimum=1,
                            maximum=50,
                            value=28,
                            step=1,
                            label="推理步数",
                        )
                        guidance_scale = gr.Slider(
                            minimum=1.0,
                            maximum=10.0,
                            value=3.5,
                            step=0.1,
                            label="提示词引导强度",
                        )
                    seed = gr.Number(
                        value=12345,
                        precision=0,
                        label="Seed（固定后便于比较提示词）",
                    )

                generate_button = gr.Button(
                    "生成图片", variant="primary", elem_id="generate-button"
                )

            with gr.Column(scale=6):
                output_image = gr.Image(label="生成结果", type="pil")
                status = gr.Markdown("### 等待生成\n\n填写提示词后点击生成。")
                download = gr.File(label="下载本次结果")

        gr.Examples(
            examples=[
                [DEFAULT_PROMPT],
                [
                    "A candid street photograph of an elderly bicycle repairer "
                    "working beside a small shop in Fuzhou, late afternoon sunlight, "
                    "natural skin texture, authentic tools and environment, 50mm lens"
                ],
            ],
            inputs=[prompt],
            label="提示词示例（点击只会填入，不会自动生成）",
        )

        inputs = [
            prompt,
            negative_prompt,
            width,
            height,
            steps,
            guidance_scale,
            seed,
        ]
        outputs = [output_image, status, download]
        generate_button.click(
            fn=generate_image,
            inputs=inputs,
            outputs=outputs,
            concurrency_limit=1,
        )
        prompt.submit(
            fn=generate_image,
            inputs=inputs,
            outputs=outputs,
            concurrency_limit=1,
        )

    return demo


if __name__ == "__main__":
    load_dotenv(PROJECT_DIR / ".env")
    build_demo().launch(server_name="127.0.0.1", inbrowser=True)
