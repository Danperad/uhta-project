alter table uhta.devices_application
    add received_quantity int NOT NULL DEFAULT 0,
    receipt_date int NULL;

alter table uhta.consumables_application
    add received_quantity int NOT NULL DEFAULT 0,
    receipt_date int NULL;

alter table uhta.devices
    add minimal_amount int NOT NULL DEFAULT (0),
    replacement_frequency int NOT NULL DEFAULT (0);

alter table uhta.consumables
    add minimal_amount int NOT NULL DEFAULT (0),
    replacement_frequency int NOT NULL DEFAULT (0);

