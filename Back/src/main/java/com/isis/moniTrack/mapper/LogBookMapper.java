package com.isis.moniTrack.mapper;


import org.mapstruct.Mapper;

import com.isis.moniTrack.dto.request.LogBookRequest;
import com.isis.moniTrack.dto.response.LogBookResponse;
import com.isis.moniTrack.model.LogBook;

@Mapper(componentModel = "spring")
public interface LogBookMapper{

}
