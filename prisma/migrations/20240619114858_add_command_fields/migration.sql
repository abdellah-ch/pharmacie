-- CreateTable
CREATE TABLE `Produit` (
    `produit_id` INTEGER NOT NULL AUTO_INCREMENT,
    `code_produit` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `designation` VARCHAR(191) NOT NULL,
    `prix_Achat` INTEGER NOT NULL,
    `prix_Vente` INTEGER NOT NULL,
    `date_expiration` DATE NULL,
    `quantite` INTEGER NOT NULL,
    `photo` VARCHAR(191) NULL,
    `categorie_id` INTEGER NOT NULL,
    `Seuil_reapprovisionnement` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Produit_produit_id_key`(`produit_id`),
    UNIQUE INDEX `Produit_code_produit_key`(`code_produit`),
    PRIMARY KEY (`produit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categorie` (
    `categorie_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`categorie_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stock` (
    `stock_id` INTEGER NOT NULL AUTO_INCREMENT,
    `produit_id` INTEGER NOT NULL,
    `stock_disponible` INTEGER NOT NULL,
    `stock_engage` INTEGER NOT NULL,
    `stock_total` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Stock_produit_id_key`(`produit_id`),
    PRIMARY KEY (`stock_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AjustementsDeStock` (
    `ajustement_id` INTEGER NOT NULL AUTO_INCREMENT,
    `produit_id` INTEGER NOT NULL,
    `quantite_ajustee` INTEGER NOT NULL,
    `raison` VARCHAR(191) NOT NULL,
    `utilisateur_id` INTEGER NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,

    PRIMARY KEY (`ajustement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `client_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nomSociete` VARCHAR(191) NULL,
    `telephone` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NULL,
    `codePostal` INTEGER NULL,
    `Region` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Client_email_key`(`email`),
    PRIMARY KEY (`client_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Commande` (
    `commande_id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_id` INTEGER NOT NULL,
    `status` ENUM('ENCOURS', 'LIVREE') NOT NULL DEFAULT 'ENCOURS',
    `total` DOUBLE NOT NULL,
    `facturee` BOOLEAN NOT NULL DEFAULT false,
    `payee` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`commande_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Facture` (
    `facture_id` INTEGER NOT NULL AUTO_INCREMENT,
    `command_id` INTEGER NOT NULL,
    `montant` DOUBLE NOT NULL,
    `date_emission` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`facture_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Paiement` (
    `paiement_id` INTEGER NOT NULL AUTO_INCREMENT,
    `command_id` INTEGER NOT NULL,
    `montant` DOUBLE NOT NULL,
    `date_paiment` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`paiement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Colis` (
    `colis_id` INTEGER NOT NULL AUTO_INCREMENT,
    `commande_id` INTEGER NOT NULL,
    `status` ENUM('EMBALLE', 'EXPEDIE', 'LIVREE') NOT NULL DEFAULT 'EMBALLE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`colis_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommandeItem` (
    `commandeItem_id` INTEGER NOT NULL AUTO_INCREMENT,
    `commande_id` INTEGER NOT NULL,
    `produit_id` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL,

    PRIMARY KEY (`commandeItem_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fournisseur` (
    `fournisseur_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `nomSociete` VARCHAR(191) NULL,
    `telephone` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NULL,
    `codePostal` INTEGER NULL,
    `Region` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Fournisseur_email_key`(`email`),
    PRIMARY KEY (`fournisseur_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BonCommande` (
    `bonCommande_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fournisseur_id` INTEGER NOT NULL,
    `status` ENUM('EMIS', 'RECU') NOT NULL DEFAULT 'EMIS',
    `total` DOUBLE NOT NULL,
    `createdAt` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`bonCommande_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BonCommandeItem` (
    `bonCommandeItem_id` INTEGER NOT NULL AUTO_INCREMENT,
    `bonCommande_id` INTEGER NOT NULL,
    `produit_id` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL,
    `prixUnitaire` DOUBLE NOT NULL,

    PRIMARY KEY (`bonCommandeItem_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Produit` ADD CONSTRAINT `Produit_categorie_id_fkey` FOREIGN KEY (`categorie_id`) REFERENCES `Categorie`(`categorie_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_produit_id_fkey` FOREIGN KEY (`produit_id`) REFERENCES `Produit`(`produit_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AjustementsDeStock` ADD CONSTRAINT `AjustementsDeStock_produit_id_fkey` FOREIGN KEY (`produit_id`) REFERENCES `Produit`(`produit_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commande` ADD CONSTRAINT `Commande_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`client_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Facture` ADD CONSTRAINT `Facture_command_id_fkey` FOREIGN KEY (`command_id`) REFERENCES `Commande`(`commande_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_command_id_fkey` FOREIGN KEY (`command_id`) REFERENCES `Commande`(`commande_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Colis` ADD CONSTRAINT `Colis_commande_id_fkey` FOREIGN KEY (`commande_id`) REFERENCES `Commande`(`commande_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommandeItem` ADD CONSTRAINT `CommandeItem_commande_id_fkey` FOREIGN KEY (`commande_id`) REFERENCES `Commande`(`commande_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommandeItem` ADD CONSTRAINT `CommandeItem_produit_id_fkey` FOREIGN KEY (`produit_id`) REFERENCES `Produit`(`produit_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BonCommande` ADD CONSTRAINT `BonCommande_fournisseur_id_fkey` FOREIGN KEY (`fournisseur_id`) REFERENCES `Fournisseur`(`fournisseur_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BonCommandeItem` ADD CONSTRAINT `BonCommandeItem_bonCommande_id_fkey` FOREIGN KEY (`bonCommande_id`) REFERENCES `BonCommande`(`bonCommande_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BonCommandeItem` ADD CONSTRAINT `BonCommandeItem_produit_id_fkey` FOREIGN KEY (`produit_id`) REFERENCES `Produit`(`produit_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
