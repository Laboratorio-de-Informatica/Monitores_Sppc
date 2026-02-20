package com.isis.moniTrack.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.isis.moniTrack.dto.request.MonitorRequest;
import com.isis.moniTrack.dto.response.MonitorResponse;
import com.isis.moniTrack.model.Monitor;

@Mapper(componentModel = "spring")
public interface MonitorMapper {

  Monitor toEntity(MonitorRequest request);

  MonitorResponse toResponse(Monitor monitor);

  List<MonitorResponse> toListResponse(List<Monitor> monitor);

  List<Monitor> toListEntity(List<MonitorRequest> monitorRequest);

}
