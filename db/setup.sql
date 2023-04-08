CREATE DATABASE uhta;
GO
USE uhta;
GO
CREATE SCHEMA uhta;
GO

CREATE TABLE uhta.device
(
    device_id int IDENTITY (1, 1),
    csss      int NOT NULL,
    nr_3      int NOT NULL,
    unit_of_measurement varchar(3) NOT NULL check ( unit_of_measurement in('ШТ', 'КМП', 'М', 'УПК', 'КГ', 'Т', 'М2') ),
    deleted BIT NOT NULL DEFAULT (0),
    device_count_in_stock     int DEFAULT (0),
    device_count_in_operation     int DEFAULT (0),
    CONSTRAINT pk_device PRIMARY KEY (device_id)
)

CREATE TABLE uhta.report
(
    report_id   int IDENTITY (1, 1),
    file_name   varchar(100) NOT NULL,
    date_from   date         NOT NULL,
    date_before date         NOT NULL,
    CONSTRAINT pk_report PRIMARY KEY (report_id)
)

CREATE TABLE uhta.application
(
    application_id     int IDENTITY (1, 1),
    application_date               date NOT NULL,
    application_period varchar(50),
    CONSTRAINT pk_application PRIMARY KEY (application_id)
)

CREATE TABLE uhta.consumable
(
    consumable_id int IDENTITY (1, 1),
    device_id     int NOT NULL,
    csss          int NOT NULL,
    nr_3          int NOT NULL,
    unit_of_measurement varchar(3) NOT NULL check ( unit_of_measurement in('ШТ', 'КМП', 'М', 'УПК', 'КГ', 'Т', 'М2') ),
    deleted BIT NOT NULL DEFAULT (0),
    consumable_count_in_stock         int DEFAULT (0),
    consumable_count_in_operation         int DEFAULT (0),
    CONSTRAINT pk_consumable PRIMARY KEY (consumable_id),
    CONSTRAINT fk_consumables_device FOREIGN KEY (device_id) REFERENCES uhta.device (device_id) ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE TABLE uhta.device_application
(
    device_id             int NOT NULL,
    application_id        int NOT NULL,
    device_count int NOT NULL,
    CONSTRAINT fk_device_application_device FOREIGN KEY (device_id) REFERENCES uhta.device (device_id),
    CONSTRAINT fk_device_application_application FOREIGN KEY (application_id) REFERENCES uhta.application (application_id)
)

CREATE TABLE uhta.consumable_application
(
    consumable_id             int NOT NULL,
    application_id            int NOT NULL,
    consumable_count int NOT NULL,
    CONSTRAINT fk_consumable_application_consumable FOREIGN KEY (consumable_id) REFERENCES uhta.consumable (consumable_id),
    CONSTRAINT fk_consumable_application_application FOREIGN KEY (application_id) REFERENCES uhta.application (application_id)
)

CREATE TABLE uhta.user
(
    id int identity(1,1),
    user_login varchar(20) not null,
    user_password varchar(20) not null,
    user_role varchar(10) not null check (user_role in('ADMIN', 'GUEST', 'WORKER')),
    CONSTRAINT pk_user PRIMARY KEY (id)
)