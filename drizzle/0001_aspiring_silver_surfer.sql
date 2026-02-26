CREATE TABLE `artigos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`codigo` varchar(50) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`precoVista` decimal(10,2) DEFAULT '0',
	`precoPrazo` decimal(10,2) DEFAULT '0',
	`unidPreco` varchar(20) DEFAULT 'KG',
	`largura` varchar(100) DEFAULT '',
	`rendimento` varchar(100) DEFAULT '',
	`categoria` varchar(100) DEFAULT 'Outros',
	`ativo` boolean NOT NULL DEFAULT true,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artigos_id` PRIMARY KEY(`id`),
	CONSTRAINT `artigos_codigo_unique` UNIQUE(`codigo`)
);
--> statement-breakpoint
CREATE TABLE `entradas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subgrupoId` int NOT NULL,
	`fornecedor` varchar(255) NOT NULL,
	`notaFiscal` varchar(100) DEFAULT '',
	`quantidade` decimal(10,2) NOT NULL,
	`valorUnitario` decimal(10,2) DEFAULT '0',
	`valorTotal` decimal(10,2) DEFAULT '0',
	`data` timestamp NOT NULL DEFAULT (now()),
	`usuarioId` int NOT NULL,
	`observacoes` text,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `entradas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `historico` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subgrupoId` int NOT NULL,
	`tipo` enum('entrada','saida') NOT NULL,
	`referenciaId` int NOT NULL,
	`quantidade` decimal(10,2) NOT NULL,
	`saldoAnterior` decimal(10,2) DEFAULT '0',
	`saldoAtual` decimal(10,2) DEFAULT '0',
	`data` timestamp NOT NULL DEFAULT (now()),
	`usuarioId` int NOT NULL,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `historico_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saidas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subgrupoId` int NOT NULL,
	`cliente` varchar(255) NOT NULL,
	`romaneio` varchar(100) DEFAULT '',
	`quantidade` decimal(10,2) NOT NULL,
	`valorUnitario` decimal(10,2) DEFAULT '0',
	`valorTotal` decimal(10,2) DEFAULT '0',
	`frete` decimal(10,2) DEFAULT '0',
	`transportadora` varchar(255) DEFAULT '',
	`data` timestamp NOT NULL DEFAULT (now()),
	`usuarioId` int NOT NULL,
	`observacoes` text,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saidas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subgrupos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artigoId` int NOT NULL,
	`cor` varchar(100) DEFAULT '',
	`lote` varchar(100) DEFAULT '',
	`metragem` decimal(10,2) DEFAULT '0',
	`localizacao` varchar(100) DEFAULT '',
	`quantidade` decimal(10,2) DEFAULT '0',
	`ativo` boolean NOT NULL DEFAULT true,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subgrupos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','funcionario') NOT NULL DEFAULT 'funcionario';--> statement-breakpoint
ALTER TABLE `users` ADD `ativo` boolean DEFAULT true NOT NULL;