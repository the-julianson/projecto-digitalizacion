import os


def delete_file(path):
    """Utility function to delete a file"""
    if os.path.isfile(path):
        os.remove(path)
