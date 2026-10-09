from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from backend.services.memory_service import memory_service

router = APIRouter(prefix="/api/memory", tags=["Memory"])

class CreateMemoryRequest(BaseModel):
    user_id: str = "default-user"
    category: str
    content: str
    source: Optional[str] = "user_explicit"
    importance: Optional[int] = 3

class UpdateMemoryRequest(BaseModel):
    user_id: str = "default-user"
    content: str

@router.get("")
async def get_memories(user_id: str = "default-user"):
    memories = memory_service.get_user_memories(user_id)
    return {"memories": memories}

@router.post("")
async def create_memory(req: CreateMemoryRequest):
    mem = memory_service.add_memory(
        user_id=req.user_id,
        category=req.category,
        content=req.content,
        source=req.source or "user_explicit",
        importance=req.importance or 3
    )
    return {"memory": mem}

@router.put("/{memory_id}")
async def update_memory(memory_id: str, req: UpdateMemoryRequest):
    updated = memory_service.update_memory(req.user_id, memory_id, req.content)
    if not updated:
        raise HTTPException(status_code=404, detail="Memory not found")
    return {"memory": updated}

@router.delete("/{memory_id}")
async def delete_memory(memory_id: str, user_id: str = "default-user"):
    success = memory_service.delete_memory(user_id, memory_id)
    if not success:
        raise HTTPException(status_code=404, detail="Memory not found")
    return {"message": "Memory forgotten successfully", "id": memory_id}

@router.delete("")
async def clear_all(user_id: str = "default-user"):
    memory_service.clear_all_memories(user_id)
    return {"message": "All memories cleared successfully"}
