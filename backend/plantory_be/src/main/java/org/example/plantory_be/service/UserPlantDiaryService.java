package org.example.plantory_be.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.plantory_be.dto.request.UserPlantDiaryRequest;
import org.example.plantory_be.dto.response.UserPlantDiaryResponse;
import org.example.plantory_be.entity.User;
import org.example.plantory_be.entity.UserPlant;
import org.example.plantory_be.entity.UserPlantDiary;
import org.example.plantory_be.entity.UserPlantPhoto;
import org.example.plantory_be.repository.UserPlantDiaryRepository;
import org.example.plantory_be.repository.UserPlantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserPlantDiaryService {
    private final AuthenticationService authenticationService;
    private final UserPlantRepository userPlantRepository;
    private final UserPlantDiaryRepository diaryRepository;

    public UserPlantDiaryResponse createUserPlantDiary(UserPlantDiaryRequest request) {
        User currentUser =  authenticationService.getCurrentUser();

        if (request.getPlantId() == null) {
            throw new IllegalArgumentException("유저식물 ID(plantId)는 필수입니다.");
        }

        UserPlant userPlant = userPlantRepository.findById(request.getPlantId())
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 유저식물 ID 입니다."));

        UserPlantDiary diary = UserPlantDiary.builder()
                .user(currentUser)
                .userPlant(userPlant)
                .diaryDate(request.getDiaryDate())
                .physical(request.getPhysical())
                .manage(request.getManage())
                .preferred(request.getPreferred())
                .careNotes(request.getCareNotes())
                .build();

        if (request.getUserPlantPhotos() != null) {
            List<UserPlantPhoto> photos = request.getUserPlantPhotos().stream()
                    .map(photoReq -> {
                        UserPlantPhoto photo = UserPlantPhoto.builder()
                                .user(currentUser)
                                .imageUrl(photoReq.getImageUrl())
                                .memo(photoReq.getMemo())
                                .userPlantDiary(diary)
                                .build();
                        return photo;
                    })
                    .toList();

            diary.setUserPlantPhotos(photos);
        }

        UserPlantDiary saved = diaryRepository.save(diary);
        return UserPlantDiaryResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public Page<UserPlantDiaryResponse> listUserPlantsDiary(Long plantId, Pageable pageable) {

        authenticationService.getCurrentUser();

        Page<UserPlantDiary> page = diaryRepository.findByUserPlantId(plantId, pageable);
        return page.map(UserPlantDiaryResponse::fromEntity);
    }

    public UserPlantDiaryResponse updateUserPlantDiary(Long diaryId, UserPlantDiaryRequest request) {

        authenticationService.getCurrentUser();

        UserPlantDiary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 성장 기록입니다."));

        diary.setDiaryDate(request.getDiaryDate());
        diary.setPhysical(request.getPhysical());
        diary.setManage(request.getManage());
        diary.setPreferred(request.getPreferred());
        diary.setCareNotes(request.getCareNotes());

        UserPlantDiary update = diaryRepository.save(diary);
        return UserPlantDiaryResponse.fromEntity(update);
    }

    public void deleteUserPlantDiary(Long diaryId) {

        User currentUser = authenticationService.getCurrentUser();

        UserPlantDiary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 성장 기록입니다."));

        if (!diary.getUserPlant().getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("본인 식물의 성장기록만 삭제할 수 있습니다.");
        }

        diaryRepository.deleteById(diaryId);
    }
}
