CREATE DATABASE uhta;
GO
USE uhta;
GO
CREATE SCHEMA uhta;
GO

CREATE TABLE uhta.devices
(
    device_id                 int IDENTITY (1, 1),
    csss                      int         NOT NULL,
    nr_3                      int         NOT NULL,
    unit_of_measurement       nvarchar(3) NOT NULL CHECK ( unit_of_measurement IN (N'ШТ', N'КМП', N'М', N'УПК', N'КГ', N'Т', N'М2') ),
    is_deleted                bit         NOT NULL DEFAULT (0),
    device_count_in_stock     int         NOT NULL DEFAULT (0),
    device_count_in_operation int         NOT NULL DEFAULT (0),
    CONSTRAINT pk_device PRIMARY KEY (device_id)
)

CREATE TABLE uhta.reports
(
    report_id   int IDENTITY (1, 1),
    file_name   nvarchar(100) NOT NULL,
    date_from   date          NOT NULL,
    date_before date          NOT NULL,
    CONSTRAINT pk_report PRIMARY KEY (report_id)
)

CREATE TABLE uhta.applications
(
    application_id     int IDENTITY (1, 1),
    application_date   date NOT NULL,
    application_period nvarchar(50), /* TODO: fix period type*/
    CONSTRAINT pk_application PRIMARY KEY (application_id)
)

CREATE TABLE uhta.consumables
(
    consumable_id                 int IDENTITY (1, 1),
    device_id                     int         NOT NULL,
    csss                          int         NOT NULL,
    nr_3                          int         NOT NULL,
    unit_of_measurement           nvarchar(3) NOT NULL CHECK ( unit_of_measurement IN (N'ШТ', N'КМП', N'М', N'УПК', N'КГ', N'Т', N'М2') ),
    is_deleted                    bit         NOT NULL DEFAULT (0),
    consumable_count_in_stock     int         NOT NULL DEFAULT (0),
    consumable_count_in_operation int         NOT NULL DEFAULT (0),
    CONSTRAINT pk_consumable PRIMARY KEY (consumable_id),
    CONSTRAINT fk_consumables_device FOREIGN KEY (device_id) REFERENCES uhta.devices (device_id) ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE TABLE uhta.device_application
(
    device_id      int NOT NULL,
    application_id int NOT NULL,
    device_count   int NOT NULL,
    CONSTRAINT fk_device_application_device FOREIGN KEY (device_id) REFERENCES uhta.devices (device_id),
    CONSTRAINT fk_device_application_application FOREIGN KEY (application_id) REFERENCES uhta.applications (application_id)
)

CREATE TABLE uhta.consumable_application
(
    consumable_id    int NOT NULL,
    application_id   int NOT NULL,
    consumable_count int NOT NULL,
    CONSTRAINT fk_consumable_application_consumable FOREIGN KEY (consumable_id) REFERENCES uhta.consumables (consumable_id),
    CONSTRAINT fk_consumable_application_application FOREIGN KEY (application_id) REFERENCES uhta.applications (application_id)
)

CREATE TABLE uhta.users
(
    user_id       int IDENTITY (1,1),
    user_login    nvarchar(20) NOT NULL,
    user_password nvarchar(64) NOT NULL,
    user_role     nvarchar(10) NOT NULL CHECK (user_role IN (N'ADMIN', N'WORKER', N'GUEST')),
    CONSTRAINT pk_user PRIMARY KEY (user_id)
)