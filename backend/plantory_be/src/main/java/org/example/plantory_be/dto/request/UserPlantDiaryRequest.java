package org.example.plantory_be.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserPlantDiaryRequest {

    @NotNull(message = "성장 기록을 등록할 반려 식물을 선택 해주세요.")
    private Long plantId;

    private LocalDate diaryDate;

    @Size(max = 200, message = "생육 정보는 200자 이내여야 합니다.")
    private String physical;

    @Size(max = 200, message = "관리 정보는 200자 이내여야 합니다.")
    private String manage;

    @Size(max = 200, message = "환경 정보는 200자 이내여야 합니다.")
    private String preferred;

    @Size(max = 200, message = "특이사항은 200자 이내여야 합니다.")
    private String careNotes;
}
