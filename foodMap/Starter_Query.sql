-- alter data type
-- Store_Fix
ALTER TABLE dbo.Store_Fix
ALTER COLUMN ID int;

-- Store_FLex

ALTER TABLE dbo.Store_Fix
ALTER COLUMN ID INT NOT NULL;

ALTER TABLE dbo.Store_Fix
ADD PRIMARY KEY(ID);