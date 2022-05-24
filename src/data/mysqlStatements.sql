CREATE TABLE IF NOT Exists dummyData3 (
	id integer NOT NULL PRIMARY KEY,
	deliktform VARCHAR(255) NOT NULL,
	datum VARCHAR(255) NOT NULL,
	uhrzeit VARCHAR(255) NOT NULL,
	lat VARCHAR(255) NOT NULL,
	lon VARCHAR(255) NOT NULL,
	tatort VARCHAR(255) NOT NULL,
	selbstbezeichnung VARCHAR(255) NOT NULL);
    
LOAD DATA INFILE '/var/lib/mysql-files/DummyDaten_Master_v01_se_test.csv'
INTO TABLE dummyData3
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n';

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
FIELDS TERMINATED BY ',';
-- ENCLOSED BY '"'
-- LINES TERMINATED BY '\n';

drop table dummyData2;

CREATE TABLE IF NOT Exists dummyData2 (
	id integer NOT NULL PRIMARY KEY,
	deliktform VARCHAR(150) NOT NULL,
	datum VARCHAR(150) NOT NULL,
	uhrzeit VARCHAR(150) NOT NULL,
	lat VARCHAR(150) NOT NULL,
	lon VARCHAR(150) NOT NULL,
	tatort VARCHAR(150) NOT NULL)
    ;
    
LOAD DATA INFILE '/var/lib/mysql-files/DummyDaten_Master_v02.csv'
INTO TABLE dummyData2
CHARACTER SET utf8
FIELDS TERMINATED BY ';' -- ENCLOSED BY '"'
IGNORE 1 LINES
;


