from fastapi import FastAPI, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import Annotated
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

class UserBase(BaseModel):
    email: str = Field(min_length=1, max_length=255)
    name: str = Field(min_length=1 , max_length=255)
    sub: str = Field()

class ItemBase(BaseModel):
    email: str = Field(min_length=1, max_length=255)
    address: str = Field(min_length=1, max_length=512)
    title: str = Field(min_length=1, max_length=512)
    complaint: str = Field(min_length=1, max_length=1024)
    latitude: float = Field()
    longitude: float = Field()

def get_db():  
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

# CRUD for users
# CREATE
@app.post("/users/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserBase, db: db_dependency):
    db_user = models.User(email=user.email, name=user.name, sub=user.sub)
    db.add(db_user)
    db.commit()

# READ
@app.get("/users/", status_code=status.HTTP_200_OK)
async def read_all_users(db: db_dependency):
    users = db.query(models.User).all()
    if users == []: 
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No users found")
    return users

# READ by email
@app.get("/users/{email}/", status_code=status.HTTP_200_OK)
async def read_user(email, db: db_dependency):
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None: 
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with email: {email} not found")
    return user

# UPDATE by email
@app.put("/users/{email}/", status_code=status.HTTP_200_OK)
async def update_user_name(email, user: UserBase, db: db_dependency):
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if db_user is None: 
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with email: {email} not found")
    
    # Only the field below can be updated
    db_user.name = user.name

    db.commit()

# DELETE by email
@app.delete("/users/{email}/", status_code=status.HTTP_200_OK)
async def delete_user(email, db: db_dependency):
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None: 
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with email: {email} not found")
    db.delete(user)
    db.commit()



# CRUD for items
# CREATE   
@app.post("/items/", status_code=status.HTTP_201_CREATED)
async def create_item(item: ItemBase, db: db_dependency):
    db_user = db.query(models.User).filter(models.User.email == item.email).first()

    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with email: {item.email} not found")
    
    db_item = models.Item(email=item.email, address=item.address, title=item.title, complaint=item.complaint, latitude=item.latitude, longitude=item.longitude)
    db.add(db_item)
    db.commit()

# READ
@app.get("/items/", status_code=status.HTTP_200_OK)
async def read_all_items(db: db_dependency):
    items = db.query(models.Item).all()
    if items == []: 
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No items found")
    return items

# READ by email
@app.get("/items/{email}/", status_code=status.HTTP_200_OK)
async def read_user_items(email, db: db_dependency):
    items = db.query(models.Item).filter(models.Item.email == email).all()
    if items == []: 
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No items from email: {email} not found")
    return items

# READ by id
@app.get("/item/{item_id}/", status_code=status.HTTP_200_OK)
async def read_item(item_id: int, db: db_dependency):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if item is None: 
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Item with id: {item_id} not found")
    return item

# UPDATE by id
@app.put("/item/{item_id}/", status_code=status.HTTP_200_OK)
async def update_item(item_id: int, item: ItemBase, db: db_dependency):
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if db_item is None: 
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Item with id: {item_id} not found")
    
    # Only the fields below can be updated
    db_item.title = item.title
    db_item.complaint = item.complaint

    db.commit()

# DELETE by id 
@app.delete("/item/{item_id}/", status_code=status.HTTP_200_OK)
async def delete_item(item_id: int, db: db_dependency):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if item is None: 
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Item with id: {item_id} not found")
    db.delete(item)
    db.commit()