package com.ntalk.choi.domain;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * EM_TRAN 테이블과 매핑되는 문자 발송 DTO
 */
public class SmsDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long tranPr;
    private String tranPhone;
    private String tranCallback;
    private Integer tranStatus;
    private LocalDateTime tranDate;
    private Integer tranType;
    private String tranMsg;

    public SmsDTO() {}

    public Long getTranPr() { return tranPr; }
    public void setTranPr(Long tranPr) { this.tranPr = tranPr; }

    public String getTranPhone() { return tranPhone; }
    public void setTranPhone(String tranPhone) { this.tranPhone = tranPhone; }

    public String getTranCallback() { return tranCallback; }
    public void setTranCallback(String tranCallback) { this.tranCallback = tranCallback; }

    public Integer getTranStatus() { return tranStatus; }
    public void setTranStatus(Integer tranStatus) { this.tranStatus = tranStatus; }

    public LocalDateTime getTranDate() { return tranDate; }
    public void setTranDate(LocalDateTime tranDate) { this.tranDate = tranDate; }

    public Integer getTranType() { return tranType; }
    public void setTranType(Integer tranType) { this.tranType = tranType; }

    public String getTranMsg() { return tranMsg; }
    public void setTranMsg(String tranMsg) { this.tranMsg = tranMsg; }
}
