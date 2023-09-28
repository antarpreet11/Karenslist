from sqlalchemy import Column, Integer, String, DECIMAL
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True)
    name = Column(String(255))
    sub = Column(String(255), unique=True)

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255))  
    address = Column(String(512))
    title = Column(String(512))
    complaint = Column(String(1024))
    latitude = Column(DECIMAL(precision=18, scale=15))
    longitude = Column(DECIMAL(precision=18, scale=15))