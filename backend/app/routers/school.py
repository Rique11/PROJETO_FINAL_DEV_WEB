from fastapi import APIRouter

from app.core.dependencies import MemoryRepositoryDependency
from app.schemas.school import ClassroomResponse, SchoolResponse

router = APIRouter(tags=["Escola"])


@router.get("/school", response_model=SchoolResponse)
def get_school(repository: MemoryRepositoryDependency):
    return repository.get_school()


@router.get("/classrooms", response_model=list[ClassroomResponse])
def list_classrooms(repository: MemoryRepositoryDependency):
    return repository.list_classrooms()


@router.get("/classrooms/{classroom_id}", response_model=ClassroomResponse)
def get_classroom(classroom_id: str, repository: MemoryRepositoryDependency):
    return repository.get_classroom(classroom_id)
