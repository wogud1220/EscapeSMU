

# import cv2
# import numpy as np
# import os

# # 📌 기준 이미지 (템플릿) 경로 설정
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# TEMPLATE_PATH = os.path.join(BASE_DIR, "templates", "template.jpg")
# UPLOADS_FOLDER = os.path.join(BASE_DIR, "uploads")

# def load_image(image_path):
#     """ 이미지를 로드하는 함수 """
#     if not os.path.exists(image_path):
#         print(f"❌ 파일이 존재하지 않습니다: {image_path}")
#         return None

#     image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
#     if image is None:
#         print(f"🚨 OpenCV가 이미지를 불러올 수 없음: {image_path}")
#     else:
#         print(f"✅ 이미지 로드 성공: {image_path}")

#     return image

# def compare_images(user_image_path):
#     """ 사용자 이미지와 템플릿 이미지를 SIFT + Ratio Test로 비교 """
#     template = load_image(TEMPLATE_PATH)
#     user_image = load_image(user_image_path)

#     if template is None or user_image is None:
#         return {"result": "Fail", "message": "이미지를 불러올 수 없음"}

#     # ✅ SIFT 알고리즘 적용
#     sift = cv2.SIFT_create()
#     kp1, des1 = sift.detectAndCompute(template, None)
#     kp2, des2 = sift.detectAndCompute(user_image, None)

#     if des1 is None or des2 is None:
#         return {"result": "Fail", "message": "이미지에서 특징점을 찾을 수 없음"}

#     # ✅ FLANN 기반 매칭 (속도 향상)
#     FLANN_INDEX_KDTREE = 1
#     index_params = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)
#     search_params = dict(checks=50)
#     flann = cv2.FlannBasedMatcher(index_params, search_params)

#     matches = flann.knnMatch(des1, des2, k=2)  # 가장 가까운 2개의 매칭 점 찾기

#     # ✅ Lowe’s Ratio Test 적용 (비율이 0.7 이하인 것만 선택)
#     good_matches = [m for m, n in matches if m.distance < 0.7 * n.distance]

#     print(f"🔍 전체 매칭 개수: {len(matches)}, 유사한 매칭 개수 (Ratio Test 적용): {len(good_matches)}")

#     # ✅ 유사한 매칭이 일정 개수 이상일 경우 "Pass"
#     if len(good_matches) > 100:  # 20개 이상일 때 성공으로 판단
#         return {"result": "Pass", "message": "이미지가 일치함"}
#     else:
#         return {"result": "Fail", "message": "이미지가 일치하지 않음"}

# # ✅ 예제 실행 (업로드된 사진과 비교)
# if __name__ == "__main__":
#     user_image_path = os.path.join(UPLOADS_FOLDER, "captured.jpg")
#     result = compare_images(user_image_path)
#     print(result)


# ''' BFMatcher → FLANN Matcher	FLANN을 이용하여 속도 향상
# Lowe’s Ratio Test 적용	비슷한 특징점이 진짜 맞는지 검증
# 좋은 매칭 개수 기준 변경	20개 이상의 **“좋은 매칭”**이 있으면 통과
# 매칭 개수만 비교 ❌	이제 질 좋은 매칭 수만을 기준으로 함 '''



import cv2
import numpy as np
import os

# 📌 기준 이미지 (템플릿) 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_PATH = os.path.join(BASE_DIR, "templates", "template.jpg")
UPLOADS_FOLDER = os.path.join(BASE_DIR, "uploads")

def load_image(image_path):
    """ 이미지를 로드하는 함수 """
    if not os.path.exists(image_path):
        print(f"❌ 파일이 존재하지 않습니다: {image_path}")
        return None

    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if image is None:
        print(f"🚨 OpenCV가 이미지를 불러올 수 없음: {image_path}")
    else:
        print(f"✅ 이미지 로드 성공: {image_path}")

    return image

def compare_images(user_image_path):
    """ 사용자 이미지와 템플릿 이미지를 SIFT + FLANN + Ratio Test로 비교 """
    template = load_image(TEMPLATE_PATH)
    user_image = load_image(user_image_path)

    if template is None or user_image is None:
        return {"result": "Fail", "message": "이미지를 불러올 수 없음"}

    # ✅ SIFT 알고리즘 적용
    sift = cv2.SIFT_create()
    kp1, des1 = sift.detectAndCompute(template, None)
    kp2, des2 = sift.detectAndCompute(user_image, None)

    if des1 is None or des2 is None:
        return {"result": "Fail", "message": "이미지에서 특징점을 찾을 수 없음"}

    # ✅ FLANN 기반 매칭 (속도 향상)
    FLANN_INDEX_KDTREE = 1
    index_params = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)
    search_params = dict(checks=50)
    flann = cv2.FlannBasedMatcher(index_params, search_params)

    matches = flann.knnMatch(des1, des2, k=2)  # 가장 가까운 2개의 매칭 점 찾기

    # ✅ Lowe’s Ratio Test 적용 (비율이 0.7 이하인 것만 선택)
    good_matches = [m for m, n in matches if m.distance < 0.7 * n.distance]

    # ✅ 매칭 점수 계산
    match_scores = [m.distance for m in good_matches]
    avg_match_score = sum(match_scores) / len(match_scores) if match_scores else float('inf')

    print(f"🔍 전체 매칭 개수: {len(matches)}, 유사한 매칭 개수 (Ratio Test 적용): {len(good_matches)}")
    print(f"🎯 평균 매칭 점수: {avg_match_score:.2f}")

    # ✅ 매칭 성공 기준 (더 엄격한 기준 적용)
    if len(good_matches) > 300 and avg_match_score < 120:
        return {"result": "Pass", "message": "이미지가 일치함"}
    else:
        return {"result": "Fail", "message": "이미지가 충분히 유사하지 않음"}

# ✅ 예제 실행 (업로드된 사진과 비교)
if __name__ == "__main__":
    user_image_path = os.path.join(UPLOADS_FOLDER, "captured.jpg")
    result = compare_images(user_image_path)
    print(result)