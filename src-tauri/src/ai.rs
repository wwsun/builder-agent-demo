use reqwest;
use serde::Deserialize;

/// System instructions for each role type
fn get_system_instruction(role: &str) -> &'static str {
    match role {
        "developer" => r#"你是一位精通 HTML、Tailwind CSS 的前端开发专家。
你的任务是根据用户需求，生成**可直接运行的、高保真的 HTML 页面代码**。
要求：
1. **必须**包含 `<!DOCTYPE html>` 和 `<html>` 标签。
2. 在 `<head>` 中引入 Tailwind CSS：`<script src="https://cdn.tailwindcss.com"></script>`。
3. 使用 Tailwind CSS 实现所有样式，追求现代、美观、商业级别的视觉效果。
4. 使用 FontAwesome 或类似 CDN 图标库（如 `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />`），以便图标能直接显示。
5. 如果需要图片，使用 `https://picsum.photos/seed/{keyword}/800/600`。
6. 代码应包含适当的交互（可以使用简单的 `<script>` 标签写原生 JS）。
7. 直接返回完整的 HTML 代码，用 ```html 包裹。"#,

        "product" => r#"你是一位资深的产品经理。
你的任务是根据用户的模糊需求，撰写一份结构清晰、内容详实的 PRD（产品需求文档）。
要求：
1. 使用 Markdown 格式。
2. 包含：项目背景、核心玩法/功能、用户路径、功能详细需求（前端/后端）、UI/UX 规范等章节。
3. 语言风格专业、逻辑严密，同时易于理解。
4. 使用中文回答。"#,

        "designer" => r#"你是一位资深的交互设计师。
你的任务是根据用户需求，生成**低保真/线框图风格的 HTML 页面代码**，用于展示布局和结构。
要求：
1. **必须**包含 `<!DOCTYPE html>` 和 `<html>` 标签。
2. 在 `<head>` 中引入 Tailwind CSS：`<script src="https://cdn.tailwindcss.com"></script>`。
3. 样式风格：
   - 使用黑白灰（grayscale）色调。
   - 使用边框（border）、背景色块来表示区域。
   - 使用 "X" 或占位符图标表示图片。
   - 字体使用等宽字体或系统默认字体，体现"设计稿"的草图感。
   - 可以在元素旁添加简单的标注（如红色文字说明）。
4. 直接返回完整的 HTML 代码，用 ```html 包裹。"#,

        _ => "You are a helpful AI assistant.",
    }
}

/// Get the model ID based on the role
fn get_model_id(role: &str) -> &'static str {
    match role {
        "developer" => "gemini-3.1-pro-preview",
        _ => "gemini-3-flash-preview",
    }
}

/// Gemini API response structures
#[derive(Deserialize)]
struct GeminiResponse {
    candidates: Option<Vec<Candidate>>,
}

#[derive(Deserialize)]
struct Candidate {
    content: Option<Content>,
}

#[derive(Deserialize)]
struct Content {
    parts: Option<Vec<Part>>,
}

#[derive(Deserialize)]
struct Part {
    text: Option<String>,
}

/// Generate content using Gemini AI API
#[tauri::command]
pub async fn generate_content(
    role: String,
    prompt: String,
    system_instruction: Option<String>,
) -> Result<String, String> {
    let api_key = std::env::var("GEMINI_API_KEY")
        .map_err(|_| "GEMINI_API_KEY environment variable is not set. Please set it in .env file or system environment.".to_string())?;

    let model_id = get_model_id(&role);
    let system_text = system_instruction
        .unwrap_or_else(|| get_system_instruction(&role).to_string());

    let url = format!(
        "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent?key={}",
        model_id, api_key
    );

    let body = serde_json::json!({
        "contents": [
            {
                "role": "user",
                "parts": [{ "text": prompt }]
            }
        ],
        "systemInstruction": {
            "parts": [{ "text": system_text }]
        }
    });

    let client = reqwest::Client::new();
    let response = client
        .post(&url)
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Failed to send request to Gemini API: {}", e))?;

    if !response.status().is_success() {
        let status = response.status();
        let error_body = response.text().await.unwrap_or_default();
        return Err(format!(
            "Gemini API returned error status {}: {}",
            status, error_body
        ));
    }

    let gemini_response: GeminiResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse Gemini API response: {}", e))?;

    let text = gemini_response
        .candidates
        .and_then(|c| c.into_iter().next())
        .and_then(|c| c.content)
        .and_then(|c| c.parts)
        .and_then(|p| p.into_iter().next())
        .and_then(|p| p.text)
        .unwrap_or_else(|| "抱歉，我暂时无法生成内容，请稍后再试。".to_string());

    Ok(text)
}
