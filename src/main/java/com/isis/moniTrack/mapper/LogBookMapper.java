package com.isis.moniTrack.mapper;

import org.mapstruct.Mapper;

import java.util.List;

import com.isis.moniTrack.dto.request.LogBookRequest;
import com.isis.moniTrack.dto.response.LogBookResponse;
import com.isis.moniTrack.model.LogBook;

@Mapper(componentModel = "spring")
public interface LogBookMapper {

  LogBook toEntity(LogBookRequest request);

  LogBookResponse toReponse(LogBook entity);

  List<LogBook> toEntityList(List<LogBookRequest> request);

  List<LogBookResponse> toResponseList(List<LogBook> entity);

}
