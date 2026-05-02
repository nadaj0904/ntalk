package com.ntalk.choi.service;

import com.ntalk.choi.domain.PlannerDTO;
import com.ntalk.choi.domain.PlannerPageRequest;
import com.ntalk.choi.repository.PlannerMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PlannerServiceImpl implements PlannerService {

    private final PlannerMapper plannerMapper;

    public PlannerServiceImpl(PlannerMapper plannerMapper) {
        this.plannerMapper = plannerMapper;
    }

    @Override
    public List<PlannerDTO> getPlannerList(PlannerPageRequest req) {
        return plannerMapper.selectPlannerList(req);
    }

    @Override
    public int getPlannerCount(PlannerPageRequest req) {
        return plannerMapper.selectPlannerCount(req);
    }

    @Override
    public PlannerDTO getPlanner(int plannerId) {
        return plannerMapper.selectPlannerById(plannerId);
    }

    @Override
    @Transactional
    public int addPlanner(PlannerDTO planner) {
        return plannerMapper.insertPlanner(planner);
    }

    @Override
    @Transactional
    public int updatePlanner(PlannerDTO planner) {
        return plannerMapper.updatePlanner(planner);
    }

    @Override
    @Transactional
    public int deletePlanners(List<Integer> ids, String deletedBy) {
        if (ids == null || ids.isEmpty()) return 0;
        return plannerMapper.deletePlanners(ids);
    }
}
