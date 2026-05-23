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
        
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String reqDtm = java.time.LocalDateTime.now().format(formatter);
        String senderKey = "05effb35329654198980dd7e6c6c50f7f2a65deb"; // from profile.md
        
        for (SendQueueDTO item : sendList) {
            item.setCreatedId(createdId);
            
            // Generate SN
            item.setSn("Test-" + java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 15));
            item.setSenderKey(senderKey);
            item.setChannel("B"); // Brand Message
            item.setSndType("P"); // Push
            item.setTargetType("I"); // Targeting type
            item.setVariableType("N"); // Message type '자유형'
            
            // Phone number formatting (digits only)
            if (item.getPhoneNum() != null) {
                item.setPhoneNum(item.getPhoneNum().replaceAll("[^0-9]", ""));
            } else if (item.getCustomerMobile() != null) {
                item.setPhoneNum(item.getCustomerMobile().replaceAll("[^0-9]", ""));
            } else {
                item.setPhoneNum("01000000000"); // fallback
            }
            
            item.setReqDtm(reqDtm);
            
            // Set message type
            if (item.getTmplCd() != null && (item.getTmplCd().equals("BI") || item.getTmplCd().equals("BW"))) {
                item.setMsgType(item.getTmplCd());
            } else {
                item.setMsgType("BT");
            }
            
            if (item.getTmplCd() == null || item.getTmplCd().isEmpty()) {
                item.setTmplCd("BT");
            }
        }
        return sendMapper.insertSendQueueBatch(sendList);
    }
}
