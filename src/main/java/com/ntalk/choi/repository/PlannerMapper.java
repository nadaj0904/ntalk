package com.ntalk.choi.repository;

import com.ntalk.choi.domain.PlannerDTO;
import com.ntalk.choi.domain.PlannerPageRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PlannerMapper {
    List<PlannerDTO> selectPlannerList(PlannerPageRequest req);
    int selectPlannerCount(PlannerPageRequest req);
    PlannerDTO selectPlannerById(int plannerId);
    int insertPlanner(PlannerDTO planner);
    int updatePlanner(PlannerDTO planner);
    int deletePlanners(@Param("ids") List<Integer> ids);
}
