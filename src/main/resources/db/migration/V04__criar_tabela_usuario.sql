CREATE TABLE user (
	id BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
	firstName VARCHAR(50) DEFAULT '' NOT NULL,
	lastName VARCHAR(50) DEFAULT '' NOT NULL,
	email VARCHAR(30),
	password VARCHAR(500),	
	enabled BOOLEAN NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO user (id,firstName, lastName, email, password, enabled) values (null,'João', 'Silva', 'joao.silva@gmail.com','123', true);
INSERT INTO user (id,firstName, lastName, email, password, enabled) values (null,'Ana', 'Maria', 'ana.maria@gmail.com','123', true);


