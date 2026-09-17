def extract_storage_path(image_url: str, bucket: str) -> str:
    marker = f"/{bucket}/"
    index = image_url.find(marker)
    if index == -1:
        raise ValueError(f"Could not extract storage path from URL: {image_url}")
    
    return image_url[index + len(marker):]