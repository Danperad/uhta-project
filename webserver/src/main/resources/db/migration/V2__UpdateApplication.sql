-- noinspection SqlResolveForFile

EXEC sp_rename 'uhta.pf_materials_application', pf_devices_application, 'OBJECT'
GO

EXEC sp_rename 'uhta.materials_application', devices_application, 'OBJECT'
GO

CREATE TABLE uhta.consumables_application
(
    consumables_id  int NOT NULL,
    application_id int NOT NULL,
    material_count int NOT NULL,
    CONSTRAINT pf_consumables_application PRIMARY KEY (consumables_id, application_id),
    CONSTRAINT fk_consumable_application_consumable FOREIGN KEY (consumables_id) REFERENCES uhta.consumables (consumables_id),
    CONSTRAINT fk_consumable_application_application FOREIGN KEY (application_id) REFERENCES uhta.applications (application_id)
);