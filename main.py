from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


disciplines = {
    "f1": {"name": "Formula 1", "votes": 0}, 
    "wrc": {"name": "WRC", "votes": 0},
    "endurance": {"name": "Endurance", "votes": 0}
}

@app.get("/poll")
def get_poll_data():
    return disciplines

@app.post("/poll/{discipline_id}/vote")
def cast_vote(discipline_id: str):
    # 1. Check if the sport they clicked actually exists in our dictionary
    if discipline_id in disciplines:
        # 2. Increase the vote count by 1
        disciplines[discipline_id]["votes"] += 1
        # 3. Return the fully updated data back to React
        return disciplines
    else:
        return {"error": "Discipline not found"}
    
