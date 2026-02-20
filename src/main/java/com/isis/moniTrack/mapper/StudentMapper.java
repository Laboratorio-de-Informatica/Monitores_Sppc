package com.isis.moniTrack.mapper;

import org.mapstruct.Mapper;

import com.isis.moniTrack.dto.request.StudentRequest;
import com.isis.moniTrack.dto.response.StudentResponse;
import com.isis.moniTrack.model.Student;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StudentMapper {

  Student toEntity(StudentRequest request);

  StudentResponse toResponse(Student student);

  List<Student> toDtoList(List<StudentRequest> requests);

}
