package com.ntalk.choi.domain;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 발송 큐 DTO
 */
public class SendQueueDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer queueId;
    private Integer customerId;
    private Integer plannerId;
    private Integer templateId;
    private String messageText;
    private String imageUrl;
    private String sendType;       // IMMEDIATE, SCHEDULED
    private LocalDateTime scheduledAt;
    private String status;         // PENDING, SENT, FAILED, CANCELLED
    private LocalDateTime sentAt;
    private String errorMessage;
    private String createdId;
    private LocalDateTime createdAt;
    private String updatedId;
    private LocalDateTime updatedAt;

    // Alimtalk (MZSENDTRAN) / Brand Message (MZBRMSENDTRAN) 전용 필드
    private String sn;
    private String senderKey;
    private String channel;
    private String sndType;
    private String phoneNum;
    private String tmplCd;
    private String reqDtm;
    private String attachment;
    private String title;
    private String header;
    private String msgType;
    private String targetType;
    private String variableType;

    // JOIN 조회용
    private String customerName;
    private String customerMobile;
    private String plannerName;
    private String plannerCode;

    public SendQueueDTO() {}

    public Integer getQueueId() { return queueId; }
    public void setQueueId(Integer queueId) { this.queueId = queueId; }
    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }
    public Integer getPlannerId() { return plannerId; }
    public void setPlannerId(Integer plannerId) { this.plannerId = plannerId; }
    public Integer getTemplateId() { return templateId; }
    public void setTemplateId(Integer templateId) { this.templateId = templateId; }
    public String getMessageText() { return messageText; }
    public void setMessageText(String messageText) { this.messageText = messageText; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getSendType() { return sendType; }
    public void setSendType(String sendType) { this.sendType = sendType; }
    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public String getCreatedId() { return createdId; }
    public void setCreatedId(String createdId) { this.createdId = createdId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getUpdatedId() { return updatedId; }
    public void setUpdatedId(String updatedId) { this.updatedId = updatedId; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerMobile() { return customerMobile; }
    public void setCustomerMobile(String customerMobile) { this.customerMobile = customerMobile; }
    public String getPlannerName() { return plannerName; }
    public void setPlannerName(String plannerName) { this.plannerName = plannerName; }
    public String getPlannerCode() { return plannerCode; }
    public void setPlannerCode(String plannerCode) { this.plannerCode = plannerCode; }

    public String getSn() { return sn; }
    public void setSn(String sn) { this.sn = sn; }
    public String getSenderKey() { return senderKey; }
    public void setSenderKey(String senderKey) { this.senderKey = senderKey; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
    public String getSndType() { return sndType; }
    public void setSndType(String sndType) { this.sndType = sndType; }
    public String getPhoneNum() { return phoneNum; }
    public void setPhoneNum(String phoneNum) { this.phoneNum = phoneNum; }
    public String getTmplCd() { return tmplCd; }
    public void setTmplCd(String tmplCd) { this.tmplCd = tmplCd; }
    public String getReqDtm() { return reqDtm; }
    public void setReqDtm(String reqDtm) { this.reqDtm = reqDtm; }
    public String getAttachment() { return attachment; }
    public void setAttachment(String attachment) { this.attachment = attachment; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getHeader() { return header; }
    public void setHeader(String header) { this.header = header; }
    public String getMsgType() { return msgType; }
    public void setMsgType(String msgType) { this.msgType = msgType; }
    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }
    public String getVariableType() { return variableType; }
    public void setVariableType(String variableType) { this.variableType = variableType; }
}
