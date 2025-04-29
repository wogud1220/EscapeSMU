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


# server/main.py

# from fastapi import FastAPI, File, UploadFile, Form
# from fastapi.responses import JSONResponse
# import shutil
# import os

# app = FastAPI()

# UPLOAD_FOLDER = "uploads"
# TEMPLATE_FOLDER = "templates"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# @app.post("/compare")
# async def compare_images(
#     file: UploadFile = File(...),
#     user_id: str = Form(...),
#     stage: str = Form(...)
# ):
#     # 🔸 업로드 경로: uploads/{user_id}/{stage}.jpg
#     user_folder = os.path.join(UPLOAD_FOLDER, user_id)
#     os.makedirs(user_folder, exist_ok=True)

#     filename = f"{stage}.jpg"
#     file_location = os.path.join(user_folder, filename)

#     # 🔸 파일 저장
#     with open(file_location, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)
#     print(f"✅ 업로드 완료: {file_location}")

#     # 🔸 템플릿 경로: templates/{stage}/template.jpeg
#     template_path = os.path.join(TEMPLATE_FOLDER, stage, "template.jpeg")
#     print(f"🔍 템플릿 경로: {template_path}")

#     # 🔸 비교
#     from matcher import compare_images
#     result = compare_images(file_location, template_path)

#     return JSONResponse(content=result)





from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
import shutil
import os

app = FastAPI()

UPLOAD_FOLDER = "uploads"
TEMPLATE_FOLDER = "templates"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/compare")
async def compare_images(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    stage: str = Form(...)
):
    # 🔸 업로드 경로: uploads/{user_id}/{stage}.jpg
    user_folder = os.path.join(UPLOAD_FOLDER, user_id)
    os.makedirs(user_folder, exist_ok=True)

    filename = f"{stage}.jpg"
    file_location = os.path.join(user_folder, filename)

    # 🔸 파일 저장
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    print(f"✅ 업로드 완료: {file_location}")

    # 🔸 템플릿 경로: templates/{stage}/template.jpeg
    template_path = os.path.join(TEMPLATE_FOLDER, stage, "template.jpeg")
    print(f"🔍 템플릿 경로: {template_path}")

    # 🔸 비교
    from matcher import compare_images
    result = compare_images(file_location, template_path)

    return JSONResponse(content=result)



@app.post("/gpt-compare")
async def compare_images_gpt(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    stage: str = Form(...)
):
    user_folder = os.path.join(UPLOAD_FOLDER, user_id)
    os.makedirs(user_folder, exist_ok=True)

    filename = f"{stage}.jpg"
    file_location = os.path.join(user_folder, filename)

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    print(f"✅ [GPT] 업로드 완료: {file_location}")

    template_path = os.path.join(TEMPLATE_FOLDER, stage, "template.jpeg")
    print(f"🔍 [GPT] 템플릿 경로: {template_path}")

    result = await compare_with_gpt(file_location, template_path)
    return JSONResponse(content=result)