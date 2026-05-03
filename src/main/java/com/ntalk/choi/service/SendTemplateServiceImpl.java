package com.ntalk.choi.service;

import com.ntalk.choi.domain.SendTemplateDTO;
import com.ntalk.choi.domain.SendTemplatePageRequest;
import com.ntalk.choi.repository.SendTemplateMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SendTemplateServiceImpl implements SendTemplateService {

    private final SendTemplateMapper sendTemplateMapper;

    public SendTemplateServiceImpl(SendTemplateMapper sendTemplateMapper) {
        this.sendTemplateMapper = sendTemplateMapper;
    }

    @Override
    public List<SendTemplateDTO> getTemplateList(SendTemplatePageRequest req) {
        return sendTemplateMapper.selectTemplateList(req);
    }

    @Override
    public int getTemplateCount(SendTemplatePageRequest req) {
        return sendTemplateMapper.selectTemplateCount(req);
    }

    @Override
    public SendTemplateDTO getTemplate(int templateId) {
        return sendTemplateMapper.selectTemplateById(templateId);
    }

    @Override
    @Transactional
    public int addTemplate(SendTemplateDTO template) {
        return sendTemplateMapper.insertTemplate(template);
    }

    @Override
    @Transactional
    public int updateTemplate(SendTemplateDTO template) {
        return sendTemplateMapper.updateTemplate(template);
    }

    @Override
    @Transactional
    public int deleteTemplates(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) return 0;
        return sendTemplateMapper.deleteTemplates(ids);
    }
}
