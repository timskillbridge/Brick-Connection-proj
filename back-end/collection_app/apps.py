from django.apps import AppConfig
from PIL import Image
from rembg import remove
import io

def warm_up_rembg():
    dummy_image = Image.new("RGBA", (10, 10), (255, 0, 0, 255))
    output = remove(dummy_image)

class CollectionAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'collection_app'
