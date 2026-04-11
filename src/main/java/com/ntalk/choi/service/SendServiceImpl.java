package com.ntalk.choi.service;

import com.ntalk.choi.domain.CustomerDTO;
import com.ntalk.choi.domain.SendQueueDTO;
import com.ntalk.choi.domain.SendTemplateDTO;
import com.ntalk.choi.repository.SendMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SendServiceImpl implements SendService {
    private final SendMapper sendMapper;
    public SendServiceImpl(SendMapper sendMapper) { this.sendMapper = sendMapper; }

    @Override
    public List<CustomerDTO> getPlannerListForSend() { return sendMapper.selectPlannerListForSend(); }

    @Override
    public Map<String, Object> getActiveCustomersByPlanners(List<Integer> plannerIds) {
        Map<String, Object> result = new HashMap<>();
        if (plannerIds == null || plannerIds.isEmpty()) {
            result.put("list", List.of());
            result.put("totalCount", 0);
            return result;
        }
        result.put("list", sendMapper.selectActiveCustomersByPlannerIds(plannerIds));
        result.put("totalCount", sendMapper.selectActiveCustomerCountByPlannerIds(plannerIds));
        return result;
    }

    @Override
    public List<SendTemplateDTO> getTemplateList() { return sendMapper.selectTemplateList(); }

    @Override
    public SendTemplateDTO getTemplate(int templateId) { return sendMapper.selectTemplateById(templateId); }

    @Override
    @Transactional
    public int requestBulkSend(List<SendQueueDTO> sendList, String createdId) {
        if (sendList == null || sendList.isEmpty()) return 0;
        sendList.forEach(item -> item.setCreatedId(createdId));
        return sendMapper.insertSendQueueBatch(sendList);
    }
}
