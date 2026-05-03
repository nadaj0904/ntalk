package com.ntalk.choi.repository;

import com.ntalk.choi.domain.SendTemplateDTO;
import com.ntalk.choi.domain.SendTemplatePageRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SendTemplateMapper {
    List<SendTemplateDTO> selectTemplateList(SendTemplatePageRequest req);
    int selectTemplateCount(SendTemplatePageRequest req);
    SendTemplateDTO selectTemplateById(int templateId);
    int insertTemplate(SendTemplateDTO template);
    int updateTemplate(SendTemplateDTO template);
    int deleteTemplates(@Param("ids") List<Integer> ids);
}
