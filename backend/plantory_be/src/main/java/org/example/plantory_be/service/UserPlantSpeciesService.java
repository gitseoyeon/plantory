package org.example.plantory_be.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.plantory_be.dto.response.UserPlantSpeciesResponse;
import org.example.plantory_be.entity.UserPlantSpecies;
import org.example.plantory_be.repository.UserPlantSpeciesRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserPlantSpeciesService {
    private final UserPlantSpeciesRepository speciesRepository;

    @Transactional(readOnly = true)
    public List<UserPlantSpeciesResponse> listUserPlantSpecies() {

        List<UserPlantSpecies> species = speciesRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));

        return species.stream().map(UserPlantSpeciesResponse::fromEntity).toList();
    }
}
