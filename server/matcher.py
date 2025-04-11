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

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_FOLDER = os.path.join(BASE_DIR, "uploads")


def load_image(image_path):
    if not os.path.exists(image_path):
        print(f"❌ 파일이 존재하지 않습니다: {image_path}")
        return None

    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if image is None:
        print(f"🚨 OpenCV가 이미지를 불러오지 못함: {image_path}")
    else:
        print(f"✅ 이미지 로드 성공: {image_path}")
    image = cv2.resize(image, (2080, 1944))
    return image


def compare_images_orb(user_image_path, template_path):
    template = load_image(template_path)
    user_image = load_image(user_image_path)

    if template is None or user_image is None:
        return {"result": "Fail", "message": "이미지를 불러오지 못함"}

    orb = cv2.ORB_create(nfeatures=1000)
    kp1, des1 = orb.detectAndCompute(template, None)
    kp2, des2 = orb.detectAndCompute(user_image, None)

    if des1 is None or des2 is None:
        return {"result": "Fail", "message": "이미지에서 특정점을 찾을 수 없음"}

    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(des1, des2)
    matches = sorted(matches, key=lambda x: x.distance)

    match_scores = [m.distance for m in matches]
    avg_match_score = sum(match_scores) / len(match_scores) if match_scores else float('inf')

    print(f"🔍 전체 매칭 개수: {len(matches)}")
    print(f"🌟 평균 매칭 점수: {avg_match_score:.2f}")

    if len(matches) > 150 and avg_match_score < 50:
        return {"result": "Pass", "message": "이미지가 일치함"}
    else:
        return {"result": "Fail", "message": "이미지가 충분히 유사하지 않음"}

def compare_images(user_image_path, template_path):
    return compare_images_orb(user_image_path, template_path)
    
if __name__ == "__main__":
    user_image_path = os.path.join(UPLOADS_FOLDER, "captured.jpg")
    template_path = os.path.join(BASE_DIR, "templates", "stage1", "template.jpeg")
    result = compare_images_orb(user_image_path, template_path)
    print(result)
