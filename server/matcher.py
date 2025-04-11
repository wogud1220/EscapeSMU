# import cv2
# import numpy as np
# import os

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# UPLOADS_FOLDER = os.path.join(BASE_DIR, "uploads")


# def load_image(image_path):
#     if not os.path.exists(image_path):
#         print(f"❌ 파일이 존재하지 않습니다: {image_path}")
#         return None

#     image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
#     if image is None:
#         print(f"🚨 OpenCV가 이미지를 불러올 수 없음: {image_path}")
#     else:
#         print(f"✅ 이미지 로드 성공: {image_path}")
#     image = cv2.resize(image, (2080, 1944))
#     return image


# def compare_images(user_image_path, template_path):
#     template = load_image(template_path)
#     user_image = load_image(user_image_path)

#     if template is None or user_image is None:
#         return {"result": "Fail", "message": "이미지를 불러올 수 없음"}

#     sift = cv2.SIFT_create()
#     kp1, des1 = sift.detectAndCompute(template, None)
#     kp2, des2 = sift.detectAndCompute(user_image, None)

#     if des1 is None or des2 is None:
#         return {"result": "Fail", "message": "이미지에서 특징점을 찾을 수 없음"}

#     FLANN_INDEX_KDTREE = 1
#     index_params = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)
#     search_params = dict(checks=50)
#     flann = cv2.FlannBasedMatcher(index_params, search_params)

#     matches = flann.knnMatch(des1, des2, k=2)
#     good_matches = [m for m, n in matches if m.distance < 0.7 * n.distance]

#     match_scores = [m.distance for m in good_matches]
#     avg_match_score = sum(match_scores) / len(match_scores) if match_scores else float('inf')

#     print(f"🔍 전체 매칭 개수: {len(matches)}, 유사한 매칭 개수 (Ratio Test 적용): {len(good_matches)}")
#     print(f"🎯 평균 매칭 점수: {avg_match_score:.2f}")

#     if len(good_matches) > 250 and avg_match_score < 170:
#         return {"result": "Pass", "message": "이미지가 일치함"}
#     else:
#         return {"result": "Fail", "message": "이미지가 충분히 유사하지 않음"}


# if __name__ == "__main__":
#     user_image_path = os.path.join(UPLOADS_FOLDER, "captured.jpg")
#     template_path = os.path.join(BASE_DIR, "templates", "stage1", "template.jpeg")
#     result = compare_images(user_image_path, template_path)
#     print(result)


import cv2
import numpy as np
import os
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_FOLDER = os.path.join(BASE_DIR, "uploads")


def load_image(image_path):
    if not os.path.exists(image_path):
        print(f"❌ 파일이 존재하지 않습니다: {image_path}")
        return None

    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if image is None:
        print(f"🚨 OpenCV가 이미지를 불러올 수 없음: {image_path}")
    else:
        print(f"✅ 이미지 로드 성공: {image_path}")
    image = cv2.resize(image, (2080, 1944))
    return image


def compare_images(user_image_path, template_path):
    template = load_image(template_path)
    user_image = load_image(user_image_path)

    if template is None or user_image is None:
        return {"result": "Fail", "message": "이미지를 불러올 수 없음"}

    # ORB
    orb_start = time.time()
    orb = cv2.ORB_create(nfeatures=1000)
    kp1_orb, des1_orb = orb.detectAndCompute(template, None)
    kp2_orb, des2_orb = orb.detectAndCompute(user_image, None)

    orb_matches = []
    orb_score = float('inf')
    if des1_orb is not None and des2_orb is not None:
        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
        orb_matches = bf.match(des1_orb, des2_orb)
        orb_matches = sorted(orb_matches, key=lambda x: x.distance)
        orb_scores = [m.distance for m in orb_matches]
        orb_score = sum(orb_scores) / len(orb_scores) if orb_scores else float('inf')
    orb_time = time.time() - orb_start

    print(f"[ORB] 전체 매칭 개수: {len(orb_matches)}")
    print(f"[ORB] 평균 매칭 점수: {orb_score:.2f}")
    print(f"[ORB] 처리 시간: {orb_time:.4f}초")

    # SIFT
    sift_start = time.time()
    sift = cv2.SIFT_create()
    kp1_sift, des1_sift = sift.detectAndCompute(template, None)
    kp2_sift, des2_sift = sift.detectAndCompute(user_image, None)

    sift_matches = []
    sift_good_matches = []
    sift_score = float('inf')
    if des1_sift is not None and des2_sift is not None:
        index_params = dict(algorithm=1, trees=5)
        search_params = dict(checks=50)
        flann = cv2.FlannBasedMatcher(index_params, search_params)
        matches = flann.knnMatch(des1_sift, des2_sift, k=2)
        sift_good_matches = [m for m, n in matches if m.distance < 0.7 * n.distance]
        sift_scores = [m.distance for m in sift_good_matches]
        sift_score = sum(sift_scores) / len(sift_scores) if sift_scores else float('inf')
    sift_time = time.time() - sift_start

    print(f"[SIFT] 전체 매칭 개수: {len(matches)}")
    print(f"[SIFT] 유사한 매칭 개수: {len(sift_good_matches)}")
    print(f"[SIFT] 평균 매칭 점수: {sift_score:.2f}")
    print(f"[SIFT] 처리 시간: {sift_time:.4f}초")

    orb_effectiveness = len(orb_matches) / (orb_score + 1)
    sift_effectiveness = len(sift_good_matches) / (sift_score + 1)
    better = "ORB" if orb_effectiveness > sift_effectiveness else "SIFT"
    print(f"✅ 최종 선택된 알고리즘: {better}")

    return {
        "result": "Pass" if better == "ORB" and orb_score < 50 else "Fail",
        "message": f"{better} 알고리즘 사용됨",
        "selected_algorithm": better,
        "orb_score": orb_score,
        "sift_score": sift_score,
        "orb_matches": len(orb_matches),
        "sift_matches": len(sift_good_matches),
        "orb_time": orb_time,
        "sift_time": sift_time,
    }
