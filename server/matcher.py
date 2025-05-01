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


# import cv2
# import numpy as np
# import os
# import time

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# UPLOADS_FOLDER = os.path.join(BASE_DIR, "uploads")
# OUTPUT_FOLDER = os.path.join(BASE_DIR, "outputs")
# os.makedirs(OUTPUT_FOLDER, exist_ok=True)

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

#     ### ORB
#     orb_start = time.time()
#     orb = cv2.ORB_create(nfeatures=1000)
#     kp1, des1 = orb.detectAndCompute(template, None)
#     kp2, des2 = orb.detectAndCompute(user_image, None)
#     if des1 is None or des2 is None:
#         return {"result": "Fail", "message": "ORB 특징점을 찾을 수 없음"}

#     bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
#     orb_matches = bf.match(des1, des2)
#     orb_matches = sorted(orb_matches, key=lambda x: x.distance)
#     orb_avg_score = sum(m.distance for m in orb_matches) / len(orb_matches)
#     orb_end = time.time()

#     print(f"[ORB] 전체 매칭 개수: {len(orb_matches)}")
#     print(f"[ORB] 평균 매칭 점수: {orb_avg_score:.2f}")
#     print(f"[ORB] 처리 시간: {orb_end - orb_start:.4f}초")

#     orb_img = cv2.drawMatches(template, kp1, user_image, kp2, orb_matches[:30], None, flags=2)
#     cv2.imwrite(os.path.join(OUTPUT_FOLDER, "orb_result.jpg"), orb_img)

#     ### SIFT
#     sift_start = time.time()
#     sift = cv2.SIFT_create()
#     kp1_s, des1_s = sift.detectAndCompute(template, None)
#     kp2_s, des2_s = sift.detectAndCompute(user_image, None)
#     if des1_s is None or des2_s is None:
#         return {"result": "Fail", "message": "SIFT 특징점을 찾을 수 없음"}

#     index_params = dict(algorithm=1, trees=5)
#     search_params = dict(checks=50)
#     flann = cv2.FlannBasedMatcher(index_params, search_params)
#     matches = flann.knnMatch(des1_s, des2_s, k=2)
#     good_matches = [m for m, n in matches if m.distance < 0.7 * n.distance]
#     sift_avg_score = sum(m.distance for m in good_matches) / len(good_matches) if good_matches else float('inf')
#     sift_end = time.time()

#     print(f"[SIFT] 전체 매칭 개수: {len(matches)}, 유사한 매칭 개수: {len(good_matches)}")
#     print(f"[SIFT] 평균 매칭 점수: {sift_avg_score:.2f}")
#     print(f"[SIFT] 처리 시간: {sift_end - sift_start:.4f}초")

#     sift_img = cv2.drawMatches(template, kp1_s, user_image, kp2_s, good_matches[:30], None, flags=2)
#     cv2.imwrite(os.path.join(OUTPUT_FOLDER, "sift_result.jpg"), sift_img)

#     orb_score = len(orb_matches) / orb_avg_score
#     sift_score = len(good_matches) / sift_avg_score if sift_avg_score != 0 else 0
#     final_score = 0.4 * orb_score + 0.6 * sift_score

#     print(f"✅ 통합 점수: {final_score:.2f} (ORB: {orb_score:.2f}, SIFT: {sift_score:.2f})")

#     if final_score > 4.5:
#         return {"result": "Pass", "message": "이미지가 일치함"}
#     else:
#         return {"result": "Fail", "message": "이미지가 충분히 유사하지 않음"}

# if __name__ == "__main__":
#     user_image_path = os.path.join(UPLOADS_FOLDER, "captured.jpg")
#     template_path = os.path.join(BASE_DIR, "templates", "stage1", "template.jpeg")
#     result = compare_images(user_image_path, template_path)
#     print(result)






# import cv2
# import numpy as np
# import os
# import time

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# UPLOADS_FOLDER = os.path.join(BASE_DIR, "uploads")
# OUTPUT_FOLDER = os.path.join(BASE_DIR, "outputs")
# os.makedirs(OUTPUT_FOLDER, exist_ok=True)

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

# def match_and_score(kp1, des1, kp2, des2, detector_name):
#     index_params = dict(algorithm=1, trees=5)
#     search_params = dict(checks=50)
#     flann = cv2.FlannBasedMatcher(index_params, search_params)

#     matches = flann.knnMatch(des1, des2, k=2)
#     good = [m for m, n in matches if m.distance < 0.7 * n.distance]
#     avg_score = sum(m.distance for m in good) / len(good) if good else float('inf')
#     print(f"[{detector_name}] 유사 매칭 개수: {len(good)}, 평균 거리: {avg_score:.2f}")
#     return good, avg_score

# def compare_images(user_image_path, template_path):
#     template = load_image(template_path)
#     user_image = load_image(user_image_path)

#     if template is None or user_image is None:
#         return {"result": "Fail", "message": "이미지를 불러올 수 없음"}

#     # ORB
#     orb = cv2.ORB_create(nfeatures=1000)
#     kp1_orb, des1_orb = orb.detectAndCompute(template, None)
#     kp2_orb, des2_orb = orb.detectAndCompute(user_image, None)
#     if des1_orb is None or des2_orb is None:
#         return {"result": "Fail", "message": "ORB 특징점 실패"}
#     bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
#     matches_orb = bf.match(des1_orb, des2_orb)
#     orb_avg = sum(m.distance for m in matches_orb) / len(matches_orb)
#     orb_score = len(matches_orb) / orb_avg
#     print(f"[ORB] 점수: {orb_score:.2f}")
#     orb_img = cv2.drawMatches(template, kp1_orb, user_image, kp2_orb, matches_orb[:30], None)
#     cv2.imwrite(os.path.join(OUTPUT_FOLDER, "orb.jpg"), orb_img)

#     # SIFT
#     sift = cv2.SIFT_create()
#     kp1_sift, des1_sift = sift.detectAndCompute(template, None)
#     kp2_sift, des2_sift = sift.detectAndCompute(user_image, None)
#     if des1_sift is None or des2_sift is None:
#         return {"result": "Fail", "message": "SIFT 특징점 실패"}
#     matches_sift, sift_avg = match_and_score(kp1_sift, des1_sift, kp2_sift, des2_sift, "SIFT")
#     sift_score = len(matches_sift) / sift_avg if sift_avg != 0 else 0
#     sift_img = cv2.drawMatches(template, kp1_sift, user_image, kp2_sift, matches_sift[:30], None)
#     cv2.imwrite(os.path.join(OUTPUT_FOLDER, "sift.jpg"), sift_img)

#     # SURF
#     surf = cv2.xfeatures2d.SURF_create(hessianThreshold=400)
#     kp1_surf, des1_surf = surf.detectAndCompute(template, None)
#     kp2_surf, des2_surf = surf.detectAndCompute(user_image, None)
#     if des1_surf is None or des2_surf is None:
#         return {"result": "Fail", "message": "SURF 특징점 실패"}
#     matches_surf, surf_avg = match_and_score(kp1_surf, des1_surf, kp2_surf, des2_surf, "SURF")
#     surf_score = len(matches_surf) / surf_avg if surf_avg != 0 else 0
#     surf_img = cv2.drawMatches(template, kp1_surf, user_image, kp2_surf, matches_surf[:30], None)
#     cv2.imwrite(os.path.join(OUTPUT_FOLDER, "surf.jpg"), surf_img)

#     # Final score
#     final_score = 0.3 * orb_score + 0.4 * sift_score + 0.3 * surf_score
#     print(f"🎯 통합 점수: {final_score:.2f} (ORB: {orb_score:.2f}, SIFT: {sift_score:.2f}, SURF: {surf_score:.2f})")

#     if final_score > 4.5:
#         return {"result": "Pass", "message": "이미지가 충분히 유사함"}
#     else:
#         return {"result": "Fail", "message": "유사하지 않음"}

# if __name__ == "__main__":
#     user_image_path = os.path.join(UPLOADS_FOLDER, "captured.jpg")
#     template_path = os.path.join(BASE_DIR, "templates", "stage1", "template.jpeg")
#     result = compare_images(user_image_path, template_path)
#     print(result)




# import cv2
# import numpy as np
# import os
# import time

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# UPLOADS_FOLDER = os.path.join(BASE_DIR, "uploads")
# OUTPUT_FOLDER = os.path.join(BASE_DIR, "outputs")
# os.makedirs(OUTPUT_FOLDER, exist_ok=True)

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

# def match_and_score(kp1, des1, kp2, des2, method):
#     start = time.time()
#     index_params = dict(algorithm=1, trees=5)
#     search_params = dict(checks=50)
#     flann = cv2.FlannBasedMatcher(index_params, search_params)

#     matches = flann.knnMatch(des1, des2, k=2)
#     good = [m for m, n in matches if m.distance < 0.7 * n.distance]
#     elapsed = time.time() - start
#     avg_score = sum(m.distance for m in good) / len(good) if good else float('inf')
#     print(f"[{method}] 매칭 수: {len(good):>3}, 평균 거리: {avg_score:6.2f}, 소요 시간: {elapsed:.3f}s")
#     return good, avg_score, elapsed

# def compare_images(user_image_path, template_path):
#     template = load_image(template_path)
#     user_image = load_image(user_image_path)

#     if template is None or user_image is None:
#         return {"result": "Fail", "message": "이미지를 불러올 수 없음"}

#     results = []

#     # ORB
#     orb = cv2.ORB_create(nfeatures=1000)
#     kp1_orb, des1_orb = orb.detectAndCompute(template, None)
#     kp2_orb, des2_orb = orb.detectAndCompute(user_image, None)
#     if des1_orb is None or des2_orb is None:
#         print("❌ ORB 특징점 실패")
#     else:
#         bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
#         start = time.time()
#         matches_orb = bf.match(des1_orb, des2_orb)
#         elapsed = time.time() - start
#         avg = sum(m.distance for m in matches_orb) / len(matches_orb)
#         score = len(matches_orb) / avg if avg != 0 else 0
#         print(f"[ORB] 매칭 수: {len(matches_orb):>3}, 평균 거리: {avg:6.2f}, 소요 시간: {elapsed:.3f}s, 점수: {score:.2f}")
#         orb_img = cv2.drawMatches(template, kp1_orb, user_image, kp2_orb, matches_orb[:30], None)
#         cv2.imwrite(os.path.join(OUTPUT_FOLDER, "orb.jpg"), orb_img)
#         results.append(("ORB", len(matches_orb), avg, elapsed, score))

#     # SIFT
#     sift = cv2.SIFT_create()
#     kp1_sift, des1_sift = sift.detectAndCompute(template, None)
#     kp2_sift, des2_sift = sift.detectAndCompute(user_image, None)
#     if des1_sift is None or des2_sift is None:
#         print("❌ SIFT 특징점 실패")
#     else:
#         matches_sift, avg_sift, time_sift = match_and_score(kp1_sift, des1_sift, kp2_sift, des2_sift, "SIFT")
#         score = len(matches_sift) / avg_sift if avg_sift != 0 else 0
#         sift_img = cv2.drawMatches(template, kp1_sift, user_image, kp2_sift, matches_sift[:30], None)
#         cv2.imwrite(os.path.join(OUTPUT_FOLDER, "sift.jpg"), sift_img)
#         results.append(("SIFT", len(matches_sift), avg_sift, time_sift, score))

#     # SURF
#     surf = cv2.xfeatures2d.SURF_create(hessianThreshold=400)
#     kp1_surf, des1_surf = surf.detectAndCompute(template, None)
#     kp2_surf, des2_surf = surf.detectAndCompute(user_image, None)
#     if des1_surf is None or des2_surf is None:
#         print("❌ SURF 특징점 실패")
#     else:
#         matches_surf, avg_surf, time_surf = match_and_score(kp1_surf, des1_surf, kp2_surf, des2_surf, "SURF")
#         score = len(matches_surf) / avg_surf if avg_surf != 0 else 0
#         surf_img = cv2.drawMatches(template, kp1_surf, user_image, kp2_surf, matches_surf[:30], None)
#         cv2.imwrite(os.path.join(OUTPUT_FOLDER, "surf.jpg"), surf_img)
#         results.append(("SURF", len(matches_surf), avg_surf, time_surf, score))

#     print("\n📊 요약 결과:")
#     for name, num, avg, t, score in results:
#         print(f"{name:<6}: 매칭 수 = {num:>3}, 평균 거리 = {avg:6.2f}, 시간 = {t:.3f}s, 점수 = {score:.2f}")

#     best = max(results, key=lambda x: x[-1]) if results else ("None", 0, 0, 0, 0)
#     return {"result": "Pass" if best[-1] > 4.5 else "Fail", "message": f"최고 성능: {best[0]} ({best[-1]:.2f})"}

# if __name__ == "__main__":
#     user_image_path = os.path.join(UPLOADS_FOLDER, "captured.jpg")
#     template_path = os.path.join(BASE_DIR, "templates", "stage1", "template.jpeg")
#     result = compare_images(user_image_path, template_path)
#     print(result)




# import cv2
# import numpy as np
# import os
# import time

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# UPLOADS_FOLDER = os.path.join(BASE_DIR, "uploads")
# OUTPUT_FOLDER = os.path.join(BASE_DIR, "outputs")
# os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# def load_image(image_path):
#     if not os.path.exists(image_path):
#         print(f"❌ 파일이 존재하지 않습니다: {image_path}")
#         return None
#     image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
#     if image is None:
#         print(f"🚨 OpenCV가 이미지를 불러올 수 없음: {image_path}")
#     else:
#         print(f"✅ 이미지 로드 성공: {image_path}")
#     # image = cv2.resize(image, (2080, 1944))
#     image = cv2.resize(image, (1050, 1400))
#     return image

# def match_and_score(kp1, des1, kp2, des2, method, matcher):
#     match_start = time.time()
#     matches = matcher.knnMatch(des1, des2, k=2)
#     total_matches = len(matches)
#     good = [m for m, n in matches if m.distance < 0.7 * n.distance]
#     match_time = time.time() - match_start
#     avg_score = sum(m.distance for m in good) / len(good) if good else float('inf')
#     print(f"[{method}] 전체 매칭 수: {total_matches:>3}, 좋은 매칭 수: {len(good):>3}, 평균 거리: {avg_score:6.2f}, 소요 시간: {match_time:.3f}s")
#     # print(f"[{method}] 매칭 수: {len(good):>3}, 평균 거리: {avg_score:6.2f}, 소요 시간: {match_time:.3f}s")
#     return good, avg_score, match_time

# def compare_images(user_image_path, template_path):
#     template = load_image(template_path)
#     user_image = load_image(user_image_path)

#     if template is None or user_image is None:
#         return {"result": "Fail", "message": "이미지를 불러올 수 없음"}

#     results = []

#     # ORB
#     orb = cv2.ORB_create(nfeatures=1000)
#     orb_start = time.time()
#     kp1_orb, des1_orb = orb.detectAndCompute(template, None)
#     kp2_orb, des2_orb = orb.detectAndCompute(user_image, None)
#     orb_time = time.time() - orb_start
#     if des1_orb is None or des2_orb is None:
#         print("❌ ORB 특징점 실패")
#     else:
#         bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
#         match_start = time.time()
#         matches_orb = bf.match(des1_orb, des2_orb)
#         match_time = time.time() - match_start
#         avg = sum(m.distance for m in matches_orb) / len(matches_orb)
#         score = len(matches_orb) / avg if avg != 0 else 0
#         print(f"[ORB] 특징점 추출 시간: {orb_time:.3f}s")
#         print(f"[ORB] 매칭 수: {len(matches_orb):>3}, 평균 거리: {avg:6.2f}, 소요 시간: {match_time:.3f}s, 점수: {score:.2f}")
#         orb_img = cv2.drawMatches(template, kp1_orb, user_image, kp2_orb, matches_orb[:30], None)
#         cv2.imwrite(os.path.join(OUTPUT_FOLDER, "orb.jpg"), orb_img)
#         results.append(("ORB", len(matches_orb), avg, orb_time + match_time, score))

#     # SIFT
#     sift = cv2.SIFT_create()
#     sift_start = time.time()
#     kp1_sift, des1_sift = sift.detectAndCompute(template, None)
#     kp2_sift, des2_sift = sift.detectAndCompute(user_image, None)
#     sift_time = time.time() - sift_start
#     if des1_sift is None or des2_sift is None:
#         print("❌ SIFT 특징점 실패")
#     else:
#         matcher = cv2.FlannBasedMatcher(dict(algorithm=1, trees=5), dict(checks=50))
#         matches_sift, avg_sift, time_sift = match_and_score(kp1_sift, des1_sift, kp2_sift, des2_sift, "SIFT", matcher)
#         score = len(matches_sift) / avg_sift if avg_sift != 0 else 0
#         sift_img = cv2.drawMatches(template, kp1_sift, user_image, kp2_sift, matches_sift[:30], None)
#         cv2.imwrite(os.path.join(OUTPUT_FOLDER, "sift.jpg"), sift_img)
#         results.append(("SIFT", len(matches_sift), avg_sift, sift_time + time_sift, score))

#     # SURF
#     surf = cv2.xfeatures2d.SURF_create(hessianThreshold=800)
#     surf_start = time.time()
#     kp1_surf, des1_surf = surf.detectAndCompute(template, None)
#     kp2_surf, des2_surf = surf.detectAndCompute(user_image, None)
#     surf_time = time.time() - surf_start
#     if des1_surf is None or des2_surf is None:
#         print("❌ SURF 특징점 실패")
#     else:
#         matcher = cv2.FlannBasedMatcher(dict(algorithm=1, trees=5), dict(checks=50))
#         matches_surf, avg_surf, time_surf = match_and_score(kp1_surf, des1_surf, kp2_surf, des2_surf, "SURF", matcher)
#         score = len(matches_surf) / avg_surf if avg_surf != 0 else 0
#         surf_img = cv2.drawMatches(template, kp1_surf, user_image, kp2_surf, matches_surf[:30], None)
#         cv2.imwrite(os.path.join(OUTPUT_FOLDER, "surf.jpg"), surf_img)
#         results.append(("SURF", len(matches_surf), avg_surf, surf_time + time_surf, score))

#     print("\n📊 요약 결과:")
#     for name, num, avg, t, score in results:
#         print(f"{name:<6}: 매칭 수 = {num:>3}, 평균 거리 = {avg:6.2f}, 시간 = {t:.3f}s, 점수 = {score:.2f}")

#     best = max(results, key=lambda x: x[-1]) if results else ("None", 0, 0, 0, 0)
#     return {"result": "Pass" if best[-1] > 4.5 else "Fail", "message": f"최고 성능: {best[0]} ({best[-1]:.2f})"}

# if __name__ == "__main__":
#     user_image_path = os.path.join(UPLOADS_FOLDER, "captured.jpg")
#     template_path = os.path.join(BASE_DIR, "templates", "stage1", "template.jpeg")
#     result = compare_images(user_image_path, template_path)
#     print(result)



# 최종 SIFT만 사용하는 코드.
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
    image = cv2.resize(image, (1050, 1400))
    return image

def match_and_score(kp1, des1, kp2, des2, matcher):
    match_start = time.time()
    matches = matcher.knnMatch(des1, des2, k=2)
    good = [m for m, n in matches if m.distance < 0.7 * n.distance]
    match_time = time.time() - match_start
    avg_score = sum(m.distance for m in good) / len(good) if good else float('inf')
    print(f"매칭 수: {len(good):>3}, 평균 거리: {avg_score:6.2f}, 소요 시간: {match_time:.3f}s")
    return good, avg_score, match_time

def compare_images(user_image_path, template_path):
    template = load_image(template_path)
    user_image = load_image(user_image_path)

    if template is None or user_image is None:
        return {"result": "Fail", "message": "이미지를 불러올 수 없음"}

    # SIFT
    sift = cv2.SIFT_create()
    sift_start = time.time()
    kp1, des1 = sift.detectAndCompute(template, None)
    kp2, des2 = sift.detectAndCompute(user_image, None)
    sift_time = time.time() - sift_start

    if des1 is None or des2 is None:
        print("❌ SIFT 특징점 실패")
        return {"result": "Fail", "message": "SIFT 특징점 추출 실패"}

    matcher = cv2.FlannBasedMatcher(dict(algorithm=1, trees=5), dict(checks=50))
    matches, avg, match_time = match_and_score(kp1, des1, kp2, des2, matcher)
    score = len(matches) / avg if avg != 0 else 0

    sift_img = cv2.drawMatches(template, kp1, user_image, kp2, matches[:30], None)
    cv2.imwrite(os.path.join(OUTPUT_FOLDER, "sift.jpg"), sift_img)

    print("\n📊 요약 결과:")
    print(f"SIFT  : 매칭 수 = {len(matches):>3}, 평균 거리 = {avg:6.2f}, 시간 = {(sift_time + match_time):.3f}s, 점수 = {score:.2f}")

    return {"result": "Pass" if score > 4.5 else "Fail", "message": f"성능 점수: {score:.2f}"}

if __name__ == "__main__":
    user_image_path = os.path.join(UPLOADS_FOLDER, "captured.jpg")
    template_path = os.path.join(BASE_DIR, "templates", "stage1", "template.jpeg")
    result = compare_images(user_image_path, template_path)
    print(result)