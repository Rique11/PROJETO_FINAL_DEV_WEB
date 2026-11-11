from app.repositories.memory_repo import MemoryRepository


_memory_repository = MemoryRepository()


def get_memory_repository() -> MemoryRepository:
    return _memory_repository