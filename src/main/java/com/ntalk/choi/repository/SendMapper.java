package com.ntalk.choi.repository;

import com.ntalk.choi.domain.CustomerDTO;
import com.ntalk.choi.domain.SendQueueDTO;
import com.ntalk.choi.domain.SendTemplateDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface SendMapper {
    List<CustomerDTO> selectPlannerListForSend();
    List<CustomerDTO> selectActiveCustomersByPlannerIds(@Param("plannerIds") List<Integer> plannerIds);
    int selectActiveCustomerCountByPlannerIds(@Param("plannerIds") List<Integer> plannerIds);
    List<SendTemplateDTO> selectTemplateList();
    SendTemplateDTO selectTemplateById(@Param("templateId") int templateId);
    int insertSendQueueBatch(@Param("list") List<SendQueueDTO> queueList);
}
