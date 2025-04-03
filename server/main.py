# from fastapi import FastAPI, File, UploadFile
# import shutil
# import os
# from fastapi.responses import JSONResponse
# app = FastAPI()

# UPLOAD_FOLDER = "uploads"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # 폴더가 없으면 생성

# @app.post("/compare")
# async def compare_images(file: UploadFile = File(...)):
#     file_location = f"{UPLOAD_FOLDER}/{file.filename}"

#     # 🔹 파일 저장
#     with open(file_location, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     print(f"✅ 파일 저장 완료: {file_location}")
    
#     # 🔹 SIFT 비교 함수 호출
#     from matcher import compare_images
#     result = compare_images(file_location)

#     return JSONResponse(content=result)





from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import os
import base64
import uuid

app = FastAPI()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/compare")
async def compare_base64(request: Request):
    try:
        body = await request.json()
        base64_data = body.get("file")

        if not base64_data:
            return JSONResponse(content={"result": "Fail", "message": "파일 데이터가 없습니다."}, status_code=400)

        # 📁 파일 저장 경로 생성
        filename = f"{uuid.uuid4().hex}.jpg"
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        # 🧾 디코딩 및 저장
        with open(file_path, "wb") as f:
            f.write(base64.b64decode(base64_data))

        print(f"✅ base64 이미지 저장 완료: {file_path}")

        # 비교 함수 호출
        from matcher import compare_images
        result = compare_images(file_path)

        return JSONResponse(content=result)

    except Exception as e:
        print("🚨 예외 발생:", e)
        return JSONResponse(content={"result": "Fail", "message": str(e)}, status_code=500)