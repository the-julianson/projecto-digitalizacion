from io import BytesIO

from django.db.models.fields.files import ImageFieldFile
from PIL import Image


def merge_images(etiqueta_ids_str_paths: list[str | ImageFieldFile]) -> Image:
    """
    Merge multiple images into a single image.

    Args:
        etiqueta_ids_str_paths (list[str]): A list of paths to images.

    Returns:
        Image: A PIL Image object containing the merged image.
    """
    # open all images
    images = [Image.open(f"media/{path}") for path in etiqueta_ids_str_paths]
    # determine combined image size

    images = [image.convert("RGB") for image in images]

    widths, heights = zip(*(i.size for i in images))

    if not len(set(widths)) and not len(set(heights)) == 1:
        #  Let's correct the raise ValueError and put some DefaultViewException
        raise ValueError("Images must have the same width and height.")
    max_width = max(widths)
    max_height = sum(heights)

    # create new image object for the composite
    new_image: Image = Image.new("RGB", (max_width, max_height))

    # paste each image into the composite
    y_offset = 0
    for image in images:
        new_image.paste(image, (0, y_offset))
        y_offset += image.height

    return new_image


def get_image_response(image: Image) -> BytesIO:
    """
    Convert a PIL Image object to a Django FileResponse object.

    :param image: A PIL Image object.
    :return: An in-memory ByteIO.

    The image is converted to PNG format and stored in memory as a BytesIO object.
    """

    byte_arr = BytesIO()
    image.save(byte_arr, format="PNG")
    byte_arr.seek(0)
    return byte_arr
