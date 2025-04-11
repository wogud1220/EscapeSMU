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
OUTPUT_FOLDER = os.path.join(BASE_DIR, "outputs")
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

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

    ### ORB
    orb_start = time.time()
    orb = cv2.ORB_create(nfeatures=1000)
    kp1, des1 = orb.detectAndCompute(template, None)
    kp2, des2 = orb.detectAndCompute(user_image, None)
    if des1 is None or des2 is None:
        return {"result": "Fail", "message": "ORB 특징점을 찾을 수 없음"}

    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    orb_matches = bf.match(des1, des2)
    orb_matches = sorted(orb_matches, key=lambda x: x.distance)
    orb_avg_score = sum(m.distance for m in orb_matches) / len(orb_matches)
    orb_end = time.time()

    print(f"[ORB] 전체 매칭 개수: {len(orb_matches)}")
    print(f"[ORB] 평균 매칭 점수: {orb_avg_score:.2f}")
    print(f"[ORB] 처리 시간: {orb_end - orb_start:.4f}초")

    orb_img = cv2.drawMatches(template, kp1, user_image, kp2, orb_matches[:30], None, flags=2)
    cv2.imwrite(os.path.join(OUTPUT_FOLDER, "orb_result.jpg"), orb_img)

    ### SIFT
    sift_start = time.time()
    sift = cv2.SIFT_create()
    kp1_s, des1_s = sift.detectAndCompute(template, None)
    kp2_s, des2_s = sift.detectAndCompute(user_image, None)
    if des1_s is None or des2_s is None:
        return {"result": "Fail", "message": "SIFT 특징점을 찾을 수 없음"}

    index_params = dict(algorithm=1, trees=5)
    search_params = dict(checks=50)
    flann = cv2.FlannBasedMatcher(index_params, search_params)
    matches = flann.knnMatch(des1_s, des2_s, k=2)
    good_matches = [m for m, n in matches if m.distance < 0.7 * n.distance]
    sift_avg_score = sum(m.distance for m in good_matches) / len(good_matches) if good_matches else float('inf')
    sift_end = time.time()

    print(f"[SIFT] 전체 매칭 개수: {len(matches)}, 유사한 매칭 개수: {len(good_matches)}")
    print(f"[SIFT] 평균 매칭 점수: {sift_avg_score:.2f}")
    print(f"[SIFT] 처리 시간: {sift_end - sift_start:.4f}초")

    sift_img = cv2.drawMatches(template, kp1_s, user_image, kp2_s, good_matches[:30], None, flags=2)
    cv2.imwrite(os.path.join(OUTPUT_FOLDER, "sift_result.jpg"), sift_img)

    orb_score = len(orb_matches) / orb_avg_score
    sift_score = len(good_matches) / sift_avg_score if sift_avg_score != 0 else 0
    final_score = 0.4 * orb_score + 0.6 * sift_score

    print(f"✅ 통합 점수: {final_score:.2f} (ORB: {orb_score:.2f}, SIFT: {sift_score:.2f})")

    if final_score > 4.5:
        return {"result": "Pass", "message": "이미지가 일치함"}
    else:
        return {"result": "Fail", "message": "이미지가 충분히 유사하지 않음"}

if __name__ == "__main__":
    user_image_path = os.path.join(UPLOADS_FOLDER, "captured.jpg")
    template_path = os.path.join(BASE_DIR, "templates", "stage1", "template.jpeg")
    result = compare_images(user_image_path, template_path)
    print(result)