CREATE TABLE uhta.logs
(
    log_id             int            IDENTITY (1, 1),
    user_login         nvarchar(100)  NOT NULL,
    action             nvarchar(100)  NOT NULL,
    log_status         nvarchar(20)   NOT NULL CHECK (log_status IN (N'ОК', N'ОШИБКА')),
    result             nvarchar(100)  NOT NULL,
    element_number     int,
    log_date           date           NOT NULL,
    CONSTRAINT pk_log PRIMARY KEY (log_id)
);