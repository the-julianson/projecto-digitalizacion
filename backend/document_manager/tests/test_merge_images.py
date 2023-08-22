from unittest.mock import patch

from PIL import Image

from document_manager.utilities import merge_images


def mock_open_image(path, size: tuple = (10, 10), *args, **kwargs) -> Image:
    """
    Mock the open function from PIL.Image.

    :param path: The path to the image.
    :param size: The size of the image as a Tuple.
    :param args: Additional arguments.
    :param kwargs: Additional keyword arguments.
    :return: A PIL Image object.
    """
    color = (0, 0, 0)
    if "1" in path:
        color = (255, 0, 0)  # Red for image 1
    elif "2" in path:
        color = (0, 255, 0)  # Green for image 2
    elif "3" in path:
        color = (0, 0, 255)  # Blue for image 3
    img = Image.new("RGB", size=size, color=color)
    return img


@patch("PIL.Image.open", new=mock_open_image)
def test_merge_images_logic() -> None:
    dummy_paths = ["dummy_1.png", "dummy_2.png", "dummy_3.png"]
    result: Image.Image = merge_images(dummy_paths)

    result.save("test_merge_images_logic.png")

    assert result.size == (10, 30)

    representative_pixels = [(0, 0), (9, 0), (0, 9), (9, 9)]
    for i, color in enumerate([(255, 0, 0), (0, 255, 0), (0, 0, 255)]):
        for x, y in representative_pixels:
            r, g, b = result.getpixel((x, y + i * 10))
            assert (r, g, b) == color
