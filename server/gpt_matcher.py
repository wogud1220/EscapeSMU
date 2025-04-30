
# import base64
# import requests
# import os
# import time
# from dotenv import load_dotenv
# # EscapeSMU/.env 를 명시적으로 지정
# dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
# load_dotenv(dotenv_path)  # .env 파일에서 환경변수 로드

# API_KEY = os.getenv("OPENAI_API_KEY")  # 🔑 .env에서 키 불러오기
# print("dotenv_path:", dotenv_path)
# print("✅ API_KEY 로드됨:", API_KEY)
# def send_to_gpt(user_img_path, template_img_path):
#     def encode_image_base64(path):
#         with open(path, "rb") as f:
#             return base64.b64encode(f.read()).decode("utf-8")

#     user_image_b64 = encode_image_base64(user_img_path)
#     template_image_b64 = encode_image_base64(template_img_path)

#     headers = {
#         "Authorization": f"Bearer {API_KEY}",
#         "Content-Type": "application/json"
#     }

#     payload = {
#         "model": "gpt-4o",
#         "messages": [
#             {
#                 "role": "user",
#                 "content": [
#                     {"type": "text", "text": "두 이미지는 같은 장소를 촬영한 것인지 판별해줘. 같으면 '같다', 다르면 '다르다'로만 답해."},
#                     {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{template_image_b64}"}},
#                     {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{user_image_b64}"}}
#                 ]
#             }
#         ],
#         "max_tokens": 10
#     }

#     try:
#         start_time = time.time()
#         res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
#         elapsed = time.time() - start_time

#         data = res.json()
#         print("📦 GPT 전체 응답:", data)
#         print(f"⏱️ GPT 응답 시간: {elapsed:.2f}초")

#         if "choices" in data and data["choices"]:
#             answer = data["choices"][0]["message"]["content"]
#             print("🧠 GPT 응답:", answer)
#             if "같다" in answer:
#                 return {"result": "Pass", "message": "GPT: 이미지가 일치합니다"}
#             else:
#                 return {"result": "Fail", "message": "GPT: 이미지가 다릅니다"}
#         else:
#             error_msg = data.get("error", {}).get("message", "GPT 응답 형식이 올바르지 않습니다.")
#             print("⚠️ GPT 응답 오류:", error_msg)
#             return {"result": "Error", "message": error_msg}

#     except Exception as e:
#         print("❌ GPT 요청 실패:", e)
#         return {"result": "Error", "message": str(e)}






# resize, max tokens, temperature 변경

import base64
import requests
import os
import time
import io
from PIL import Image
from dotenv import load_dotenv

# 명시적으로 EscapeSMU/.env 지정
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(dotenv_path)

API_KEY = os.getenv("OPENAI_API_KEY")
print("dotenv_path:", dotenv_path)
print("✅ API_KEY 로드됨:", API_KEY)


def resize_and_encode_image(path, size=(512, 512)):
    try:
        with Image.open(path).convert("RGB") as img:
            img = img.resize(size)
            buffer = io.BytesIO()
            img.save(buffer, format="JPEG")
            return base64.b64encode(buffer.getvalue()).decode("utf-8")
    except Exception as e:
        print(f"❌ 이미지 처리 실패: {path}", e)
        return None


def send_to_gpt(user_img_path, template_img_path):
    user_image_b64 = resize_and_encode_image(user_img_path)
    template_image_b64 = resize_and_encode_image(template_img_path)

    if not user_image_b64 or not template_image_b64:
        return {"result": "Error", "message": "이미지 인코딩 실패"}

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    # payload = {
    #     "model": "gpt-4o",
    #     "temperature": 0.0,
    #     "max_tokens": 10,
    #     "messages": [
    #         {
    #             "role": "user",
    #             "content": [
    #                 {"type": "text", "text": "두 이미지는 같은 장소를 촬영한 것인지 판별해줘. 같으면 '같다', 다르면 '다르다'로만 답해."},
    #                 {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{template_image_b64}"}},
    #                 {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{user_image_b64}"}}
    #             ]
    #         }
    #     ]
    # }


    payload = {
    "model": "gpt-4o",
    "temperature": 0.0,
    "max_tokens": 20,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": (
                        "다음 두 이미지를 비교해. 실제 현장에서 찍은 사진인지, 모니터(또는 화면) 사진인지 판별해줘.\n"
                        "1. 키보드, 마우스, 모니터 화면이 보이면 화면 촬영으로 간주해.\n"
                        "2. 반사광, 픽셀, 왜곡이 있으면 화면 촬영으로 간주해.\n"
                        "3. 같은 장소의 실제 촬영이면 '실제 촬영: 같다'라고 답해.\n"
                        "4. 다르면 '실제 촬영: 다르다'라고 답해.\n"
                        "5. 화면을 찍은 것으로 보이면 '화면 촬영'이라고 답해.\n\n"
                        "세 가지 중 하나로만 정확히 짧게 답해:\n"
                        "- 실제 촬영: 같다\n"
                        "- 실제 촬영: 다르다\n"
                        "- 화면 촬영"
                    )
                },
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{template_image_b64}"}},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{user_image_b64}"}}
            ]
        }
    ]
}

    try:
        start_time = time.time()
        res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        elapsed = time.time() - start_time

        data = res.json()
        print("📦 GPT 전체 응답:", data)
        print(f"⏱️ GPT 응답 시간: {elapsed:.2f}초")

        if "choices" in data and data["choices"]:
            answer = data["choices"][0]["message"]["content"]
            print("🧠 GPT 응답:", answer)
            if "같다" in answer:
                return {"result": "Pass", "message": "GPT: 이미지가 일치합니다"}
            else:
                return {"result": "Fail", "message": "GPT: 이미지가 다릅니다"}
        else:
            error_msg = data.get("error", {}).get("message", "GPT 응답 형식이 올바르지 않습니다.")
            print("⚠️ GPT 응답 오류:", error_msg)
            return {"result": "Error", "message": error_msg}

    except Exception as e:
        print("❌ GPT 요청 실패:", e)
        return {"result": "Error", "message": str(e)}