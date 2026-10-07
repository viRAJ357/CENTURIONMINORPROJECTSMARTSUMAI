from fastapi import APIRouter, HTTPException
import base64
from io import BytesIO
from apps.calculator.utils import analyze_image
from schema import ImageData
from PIL import Image
import traceback

router = APIRouter()

@router.post('')
async def run(data: ImageData):
    try:
        print("=== Calculate endpoint called ===")
        print(f"Received image data length: {len(data.image) if data.image else 0}")
        print(f"Received variables: {data.dict_of_vars}")
        
        # Validate image data format
        if not data.image or ',' not in data.image:
            print("Error: Invalid image format")
            raise HTTPException(status_code=400, detail="Invalid image format. Expected base64 data URL")
        
        # Decode image
        try:
            image_data = base64.b64decode(data.image.split(',')[1])
            print(f"Decoded image data length: {len(image_data)} bytes")
        except Exception as e:
            print(f"Error decoding base64: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Error decoding image: {str(e)}")
        
        # Open image
        try:
            image_bytes = BytesIO(image_data)
            image = Image.open(image_bytes)
            print(f"Image opened successfully: {image.size}, {image.mode}")
        except Exception as e:
            print(f"Error opening image: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Error opening image: {str(e)}")
        
        # Analyze image
        try:
            print("Calling analyze_image...")
            responses = analyze_image(image, dict_of_vars=data.dict_of_vars)
            print(f"Analysis complete. Got {len(responses)} responses")
        except Exception as e:
            print(f"Error in analyze_image: {str(e)}")
            print(f"Traceback: {traceback.format_exc()}")
            raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")
        
        # Format response - FIXED: renamed 'data' to 'response_data' to avoid conflict
        response_data = []
        for response in responses:
            response_data.append(response)
            print(f'Response item: {response}')
        
        result = {
            "message": "Image Processed",
            "type": "success",
            "data": response_data  # Using response_data instead of data
        }
        print(f"Returning result with {len(response_data)} items")
        return result
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        print(f"Unexpected error in calculate endpoint: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")