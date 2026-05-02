package com.ntalk.choi.service;

import com.ntalk.choi.domain.PlannerDTO;
import com.ntalk.choi.domain.PlannerPageRequest;

import java.util.List;

public interface PlannerService {
    List<PlannerDTO> getPlannerList(PlannerPageRequest req);
    int getPlannerCount(PlannerPageRequest req);
    PlannerDTO getPlanner(int plannerId);
    int addPlanner(PlannerDTO planner);
    int updatePlanner(PlannerDTO planner);
    int deletePlanners(List<Integer> ids, String deletedBy);
}
