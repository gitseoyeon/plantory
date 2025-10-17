package org.example.plantory_be.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.plantory_be.dto.request.UserPlantRequest;
import org.example.plantory_be.dto.response.UserPlantResponse;
import org.example.plantory_be.entity.User;
import org.example.plantory_be.entity.UserPlant;
import org.example.plantory_be.entity.UserPlantSpecies;
import org.example.plantory_be.repository.UserPlantRepository;
import org.example.plantory_be.repository.UserPlantSpeciesRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserPlantService {

    private final AuthenticationService authenticationService;
    private final UserPlantSpeciesRepository userPlantSpeciesRepository;
    private final UserPlantRepository userPlantRepository;

    public UserPlantResponse createUserPlant(UserPlantRequest request) {

        User currentUser = authenticationService.getCurrentUser();

        UserPlantSpecies species = null;
        if (request.getSpecies_id() != null) {
            species = userPlantSpeciesRepository.findById(request.getSpecies_id())
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 종(species) ID입니다."));
        }

        UserPlant userPlant = UserPlant.builder()
                .user(currentUser)
                .userPlantSpecies(species)
                .name(request.getName().trim())
                .petName(request.getPetName().trim())
                .acquiredDate(request.getAcquiredDate())
                .imageUrl(request.getImageUrl())
                .indoor(request.isIndoor())
                .location(request.getLocation())
                .store(request.getStore())
                .price(request.getPrice())
                .potSize(request.getPotSize())
                .qrUrl(request.getQrUrl())
                .qrImageUrl(request.getQrImageUrl())
                .build();

        UserPlant saved = userPlantRepository.save(userPlant);
        return UserPlantResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public Page<UserPlantResponse> listUserPlants(Pageable pageable) {
        User currentUser = authenticationService.getCurrentUser();

        Page<UserPlant> page = (currentUser.getId() == null)
                ? userPlantRepository.findAllByOrderByCreatedAtDesc(pageable)
                : userPlantRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId(), pageable);

        return page.map(UserPlantResponse::fromEntity);
    }

    public UserPlantResponse updateUserPlant(Long plantId, UserPlantRequest request) {

        UserPlant plant = userPlantRepository.findById(plantId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 식물입니다"));

        User currentUser = authenticationService.getCurrentUser();

        if (!plant.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("본인 소유의 식물만 수정할 수 있습니다");
        }

        if (request.getSpecies_id() != null) {
            UserPlantSpecies species = userPlantSpeciesRepository.findById(request.getSpecies_id())
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 종(species)입니다"));
            plant.setUserPlantSpecies(species);
        }

        plant.setName(request.getName());
        plant.setPetName(request.getPetName());
        plant.setAcquiredDate(request.getAcquiredDate());
        plant.setImageUrl(request.getImageUrl());
        plant.setIndoor(request.isIndoor());
        plant.setLocation(request.getLocation());
        plant.setStore(request.getStore());
        plant.setPrice(request.getPrice());
        plant.setPotSize(request.getPotSize());
        plant.setQrUrl(request.getQrUrl());
        plant.setQrImageUrl(request.getQrImageUrl());

        UserPlant updated = userPlantRepository.save(plant);
        return UserPlantResponse.fromEntity(updated);
    }

    public void deleteUserPlant(Long plantId) {

        User currentUser = authenticationService.getCurrentUser();

        UserPlant plant = userPlantRepository.findById(plantId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 식물입니다."));

        if (!plant.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("본인 소유의 식물만 삭제할 수 있습니다.");
        }

        userPlantRepository.delete(plant);
    }
}
