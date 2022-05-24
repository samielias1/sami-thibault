CREATE TABLE IF NOT Exists dummyData (
	srid integer NOT NULL,
	deliktform VARCHAR(255) NOT NULL,
	datum DATE NOT NULL,
	uhrzeit time,
	lat VARCHAR(255) NOT NULL,
	lon VARCHAR(255) NOT NULL,
	tatort VARCHAR(255) NOT NULL,
	selbstbezeichnung VARCHAR(255) NOT NULL);
    
LOAD DATA INFILE 'D:\Projekt\sami-thibault\src\data\DummyDaten_Master_v01_se_test.csv'
INTO TABLE dummyData
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n';dummyData

-- drop table wochenmaerkte;

CREATE TABLE IF NOT Exists wochenmaerkte (
	-- srid integer NOT NULL,
	y DECIMAL(8,6) NOT NULL,
	x DECIMAL(8,6) NOT NULL,
	title VARCHAR(255) NOT NULL,
	href VARCHAR(255) NOT NULL,
	descriptio VARCHAR(255) NOT NULL,
	id VARCHAR(255) NOT NULL,
	data VARCHAR(255) NOT NULL);


LOAD DATA INFILE '/var/lib/mysql-files/wochenmaerkte.csv'
INTO TABLE wochenmaerkte
CHARACTER SET utf8
FIELDS TERMINATED BY ','
-- ENCLOSED BY '"'
-- LINES TERMINATED BY '\n';


CREATE TABLE IF NOT Exists dummyData6 (
	id integer NOT NULL,
	deliktform VARCHAR(500) NOT NULL,
	datum DATE NOT NULL,
	uhrzeit time,
	lat VARCHAR(500) NOT NULL,
	lon VARCHAR(500) NOT NULL,
	tatort VARCHAR(500) NOT NULL,
	selbstbezeichnung VARCHAR(500) NOT NULL);
    
LOAD DATA INFILE '/var/lib/mysql-files/DummyDaten_Master_v01_se_test.csv'
INTO TABLE dummyData6
CHARACTER SET utf8
FIELDS TERMINATED BY ','
