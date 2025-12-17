-- create the DB if needed (run in postgres or your DB client):
-- CREATE DATABASE "ROJ_db";

-- connect to ROJ_db first: \c ROJ_db

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150),
  company VARCHAR(150),
  start_date VARCHAR(50),
  end_date VARCHAR(50),
  description TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150),
  description TEXT,
  github_link TEXT,
  live_link TEXT
);

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- sample data
INSERT INTO skills (name) VALUES
('Python'), ('JavaScript'), ('SQL & MySQL'), ('React.js'), ('Node.js'), ('Flask'), ('Bootstrap'), ('AWS Cloud')
ON CONFLICT DO NOTHING;

INSERT INTO experience (title, company, start_date, end_date, description) VALUES
('Data Recovery Technician', 'Ogago Computer Technology, Oghara', 'Jun 2023', 'Feb 2024', 'Recovered and restored critical data across multiple systems while ensuring privacy and compliance.'),
('Light Duty Truck Driver', 'Chinedum Truck Ltd, Edo', 'Feb 2022', 'Mar 2023', 'Managed logistics and delivery operations with high efficiency.')
ON CONFLICT DO NOTHING;

INSERT INTO projects (title, description, github_link, live_link) VALUES
('Portfolio Website', 'A stylish personal portfolio with HTML, CSS & JS.', 'https://github.com/Ojenima150/portfolio', '#'),
('Full-Stack Web App', 'React + Node.js + PostgreSQL application with AWS deployment.', 'https://github.com/Ojenima150/fullstack-app', '#'),
('Web3/DApp Project', 'Blockchain integrated decentralized application.', 'https://github.com/Ojenima150/web3-dapp', '#')
ON CONFLICT DO NOTHING;