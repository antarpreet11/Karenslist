from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Annotated
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI()
origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
)

models.Base.metadata.create_all(bind=engine)

class UserBase(BaseModel):
    email: str = Field(min_length=1, max_length=255)
    name: str = Field(min_length=1 , max_length=255)
    sub: str = Field()

class ReviewBase(BaseModel):
    email: str = Field(min_length=1, max_length=255)
    sub: str = Field(min_length=1, max_length=255)
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

#Root path
@app.get("/")
async def read_root():
    return {"message": "Hello, welcome to Karenlist!"}

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



# CRUD for reviews
# CREATE   
@app.post("/reviews/", status_code=status.HTTP_201_CREATED)
async def create_review(review: ReviewBase, db: db_dependency):
    db_user = db.query(models.User).filter(models.User.email == review.email).first()

    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with email: {review.email} not found")
    
    db_review = models.Review(email=review.email, address=review.address, title=review.title, complaint=review.complaint, latitude=review.latitude, longitude=review.longitude)
    db.add(db_review)
    db.commit()

# READ
@app.get("/reviews/", status_code=status.HTTP_200_OK)
async def read_all_reviews(db: db_dependency):
    reviews = db.query(models.Review).all()
    if reviews == []: 
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No reviews found")
    return reviews

# READ by email
@app.get("/reviews/{email}/", status_code=status.HTTP_200_OK)
async def read_user_reviews(email, db: db_dependency):
    reviews = db.query(models.Review).filter(models.Review.email == email).all()
    if reviews == []: 
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No reviews from email: {email} not found")
    return reviews

# READ by id
@app.get("/review/{review_id}/", status_code=status.HTTP_200_OK)
async def read_review(review_id: int, db: db_dependency):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if review is None: 
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Review with id: {review_id} not found")
    return review

# UPDATE by id
@app.put("/review/{review_id}/", status_code=status.HTTP_200_OK)
async def update_review(review_id: int, review: ReviewBase, db: db_dependency):
    db_review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if db_review is None: 
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Review with id: {review_id} not found")
    
    db_user = db.query(models.User).filter(models.User.email == review.email).first()
    if db_user is None or db_user.sub != review.sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"User with email: {review.email} not authorized to update review")
    
    # Only the fields below can be updated
    db_review.title = review.title
    db_review.complaint = review.complaint

    db.commit()

# DELETE by id 
@app.delete("/review/{review_id}/", status_code=status.HTTP_200_OK)
async def delete_review(review_id: int, db: db_dependency):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if review is None: 
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Review with id: {review_id} not found")
    
    db_user = db.query(models.User).filter(models.User.email == review.email).first()
    if db_user is None or db_user.sub != review.sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"User with email: {review.email} not authorized to delete review")

    db.delete(review)
    db.commit()