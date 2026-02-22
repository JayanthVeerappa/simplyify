#!/usr/bin/env python3
from PIL import Image, ImageDraw
import os

# Create icons in the icons directory
icon_dir = 'icons'
os.makedirs(icon_dir, exist_ok=True)

sizes = [16, 48, 128]

for size in sizes:
    # Create new image with indigo background
    img = Image.new('RGBA', (size, size), (79, 70, 229, 255))
    draw = ImageDraw.Draw(img)
    
    # Draw smiley face
    center = size // 2
    head_radius = int(size * 0.35)
    
    # Head (white circle)
    draw.ellipse([
        center - head_radius, 
        int(size * 0.3) - head_radius,
        center + head_radius, 
        int(size * 0.3) + head_radius
    ], fill='white')
    
    # Eyes
    eye_size = max(1, size // 16)
    left_eye_x = int(size * 0.4)
    right_eye_x = int(size * 0.6)
    eye_y = int(size * 0.28)
    
    draw.ellipse([
        left_eye_x - eye_size, eye_y - eye_size,
        left_eye_x + eye_size, eye_y + eye_size
    ], fill='#4f46e5')
    
    draw.ellipse([
        right_eye_x - eye_size, eye_y - eye_size,
        right_eye_x + eye_size, eye_y + eye_size
    ], fill='#4f46e5')
    
    # Save
    filename = os.path.join(icon_dir, f'icon{size}.png')
    img.save(filename, 'PNG')
    print(f'✓ Created {filename}')

print('\n✅ All icons created successfully!')
