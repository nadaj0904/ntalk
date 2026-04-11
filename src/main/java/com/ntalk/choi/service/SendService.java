package com.ntalk.choi.service;

import com.ntalk.choi.domain.CustomerDTO;
import com.ntalk.choi.domain.SendQueueDTO;
import com.ntalk.choi.domain.SendTemplateDTO;
import java.util.List;
import java.util.Map;

public interface SendService {
    List<CustomerDTO> getPlannerListForSend();
    Map<String, Object> getActiveCustomersByPlanners(List<Integer> plannerIds);
    List<SendTemplateDTO> getTemplateList();
    SendTemplateDTO getTemplate(int templateId);
    int requestBulkSend(List<SendQueueDTO> sendList, String createdId);
}
