package com.ntalk.choi.domain;

import java.io.Serializable;

public class SendStatDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    // 요약 통계용 필드
    private int totalCount;
    private int waitingCount;
    private int successCount;
    private int failedCount;

    // 그리드 데이터용 (템플릿별/메시지타입별/부서별 등 상세)
    private String statDate;
    private String msgType;
    private String reqDeptCd;

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public int getWaitingCount() {
        return waitingCount;
    }

    public void setWaitingCount(int waitingCount) {
        this.waitingCount = waitingCount;
    }

    public int getSuccessCount() {
        return successCount;
    }

    public void setSuccessCount(int successCount) {
        this.successCount = successCount;
    }

    public int getFailedCount() {
        return failedCount;
    }

    public void setFailedCount(int failedCount) {
        this.failedCount = failedCount;
    }

    public String getStatDate() {
        return statDate;
    }

    public void setStatDate(String statDate) {
        this.statDate = statDate;
    }

    public String getMsgType() {
        return msgType;
    }

    public void setMsgType(String msgType) {
        this.msgType = msgType;
    }

    public String getReqDeptCd() {
        return reqDeptCd;
    }

    public void setReqDeptCd(String reqDeptCd) {
        this.reqDeptCd = reqDeptCd;
    }
}
