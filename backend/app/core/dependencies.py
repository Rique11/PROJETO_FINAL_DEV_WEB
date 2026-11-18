from typing import Annotated

from fastapi import Depends

from app.core.config import settings
from app.repositories.memory_repo import MemoryRepository
from app.repositories.seed import load_demo_data


def build_repository(seed: bool) -> MemoryRepository:
    repository = MemoryRepository()
    return load_demo_data(repository) if seed else repository


_memory_repository = build_repository(settings.SEED_DEMO_DATA)


def get_memory_repository() -> MemoryRepository:
    return _memory_repository


MemoryRepositoryDependency = Annotated[
    MemoryRepository,
    Depends(get_memory_repository),
]
