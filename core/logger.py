import sys
from loguru import logger
import os

os.makedirs("outputs", exist_ok=True)

logger.remove()
logger.add(sys.stdout, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>")
logger.add("outputs/scraper.log", rotation="10 MB", retention="10 days", level="DEBUG")

def get_logger(name: str):
    return logger.bind(name=name)
