# config.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Création de l'engine de la base de données (modifie les paramètres selon ta configuration)
DB_URL = "postgresql://postgres:admin@localhost:5432/DBGoRun"
engine = create_engine(DB_URL)

# Création d'une session pour interagir avec la base de données
Session = sessionmaker(bind=engine)
session = Session()

# Exportation de l'engine et de la session
sequelize = engine  # Si tu veux l'utiliser directement
