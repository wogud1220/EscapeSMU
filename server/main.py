from fastapi import FastAPI, File, UploadFile
import shutil
import os
from fastapi.responses import JSONResponse
app = FastAPI()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # 폴더가 없으면 생성

@app.post("/compare")
async def compare_images(file: UploadFile = File(...)):
    file_location = f"{UPLOAD_FOLDER}/{file.filename}"

    # 🔹 파일 저장
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"✅ 파일 저장 완료: {file_location}")
    
    # 🔹 SIFT 비교 함수 호출
    from matcher import compare_images
    result = compare_images(file_location)

    return JSONResponse(content=result)


