
import base64
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # .env 파일에서 환경변수 로드

API_KEY = os.getenv("OPENAI_API_KEY")  # 🔑 .env에서 키 불러오기

def send_to_gpt(user_img_path, template_img_path):
    def encode_image_base64(path):
        with open(path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")

    user_image_b64 = encode_image_base64(user_img_path)
    template_image_b64 = encode_image_base64(template_img_path)

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "gpt-4-vision-preview",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "두 이미지는 같은 장소를 촬영한 것인지 판별해줘. 같으면 '같다', 다르면 '다르다'로만 답해."},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{template_image_b64}"}},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{user_image_b64}"}}
                ]
            }
        ],
        "max_tokens": 20
    }

    try:
        res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        answer = res.json()["choices"][0]["message"]["content"]
        print("🧠 GPT 응답:", answer)
        if "같다" in answer:
            return {"result": "Pass", "message": "GPT: 이미지가 일치합니다"}
        else:
            return {"result": "Fail", "message": "GPT: 이미지가 다릅니다"}
    except Exception as e:
        print("❌ GPT 요청 실패:", e)
        return {"result": "Error", "message": str(e)}