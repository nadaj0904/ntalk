package com.ntalk.choi.service;

import com.ntalk.choi.domain.SendTemplateDTO;
import com.ntalk.choi.domain.SendTemplatePageRequest;

import java.util.List;

public interface SendTemplateService {
    List<SendTemplateDTO> getTemplateList(SendTemplatePageRequest req);
    int getTemplateCount(SendTemplatePageRequest req);
    SendTemplateDTO getTemplate(int templateId);
    int addTemplate(SendTemplateDTO template);
    int updateTemplate(SendTemplateDTO template);
    int deleteTemplates(List<Integer> ids);
}
