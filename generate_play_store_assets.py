import os
import sys
from PIL import Image, ImageDraw, ImageFont, ImageOps
import textwrap
import random

# Create output directory if it doesn't exist
output_dir = "play_store_assets"
os.makedirs(output_dir, exist_ok=True)

# Colors
PRIMARY_COLOR = (66, 133, 244)  # Google Blue
SECONDARY_COLOR = (234, 67, 53)  # Google Red
TERTIARY_COLOR = (251, 188, 5)  # Google Yellow
BACKGROUND_COLOR = (250, 250, 250)  # Light gray
TEXT_COLOR = (32, 33, 36)  # Almost black

# App details
APP_NAME = "StudyFlow"
APP_TAGLINE = "Organize. Focus. Succeed."
APP_DESCRIPTION = "\n".join([
    "The ultimate study companion for students",
    "• Track assignments and deadlines",
    "• Create study plans and schedules",
    "• Stay focused with Pomodoro timer",
    "• Sync across all your devices"
])

def create_app_icon():
    """Create app icon (512x512px)"""
    size = 512
    icon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(icon)
    
    # Draw background circle
    circle_margin = size * 0.1
    draw.ellipse(
        [(circle_margin, circle_margin), 
         (size - circle_margin, size - circle_margin)],
        fill=PRIMARY_COLOR
    )
    
    # Add 'SF' text
    try:
        font_size = int(size * 0.5)
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        # Fallback to default font
        font = ImageFont.load_default()
    
    text = "SF"
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    position = ((size - text_width) // 2, (size - text_height) // 2 - size * 0.05)
    draw.text(position, text, fill="white", font=font, align="center")
    
    # Save
    icon_path = os.path.join(output_dir, "app_icon.png")
    icon.save(icon_path, "PNG", quality=100)
    print(f"Created: {icon_path}")
    return icon_path

def create_feature_graphic():
    """Create feature graphic (1024x500px)"""
    width, height = 1024, 500
    feature = Image.new('RGB', (width, height), BACKGROUND_COLOR)
    draw = ImageDraw.Draw(feature)
    
    # Add gradient background
    for y in range(height):
        r = int(PRIMARY_COLOR[0] * (1 - y/height) + 255 * (y/height))
        g = int(PRIMARY_COLOR[1] * (1 - y/height) + 255 * (y/height))
        b = int(PRIMARY_COLOR[2] * (1 - y/height) + 255 * (y/height))
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    # Add app icon (top left)
    icon_size = 100
    icon = Image.new('RGBA', (icon_size, icon_size), (0, 0, 0, 0))
    icon_draw = ImageDraw.Draw(icon)
    icon_draw.ellipse([(0, 0), (icon_size, icon_size)], fill=PRIMARY_COLOR)
    
    try:
        font = ImageFont.truetype("arial.ttf", int(icon_size * 0.5))
    except:
        font = ImageFont.load_default()
    
    text = "SF"
    text_bbox = icon_draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    position = ((icon_size - text_width) // 2, (icon_size - text_height) // 2 - icon_size * 0.05)
    icon_draw.text(position, text, fill="white", font=font)
    
    # Paste icon
    feature.paste(icon, (50, 50), icon)
    
    # Add app name
    try:
        font = ImageFont.truetype("arialbd.ttf", 72)
    except:
        font = ImageFont.load_default()
    
    draw.text((180, 60), APP_NAME, fill=TEXT_COLOR, font=font)
    
    # Add tagline
    try:
        font = ImageFont.truetype("arial.ttf", 36)
    except:
        font = ImageFont.load_default()
    
    draw.text((180, 140), APP_TAGLINE, fill=SECONDARY_COLOR, font=font)
    
    # Add phone mockup
    phone_mockup = Image.new('RGB', (300, 600), (255, 255, 255))
    phone_draw = ImageDraw.Draw(phone_mockup)
    
    # Phone frame
    phone_draw.rounded_rectangle([(0, 0), (300, 600)], 40, outline="#CCCCCC", width=5)
    
    # Screen content
    screen_margin = 20
    screen = Image.new('RGB', (300 - 2*screen_margin, 500), (245, 245, 245))
    screen_draw = ImageDraw.Draw(screen)
    
    # Sample app interface
    # Header
    screen_draw.rectangle([(0, 0), (260, 80)], fill=PRIMARY_COLOR)
    screen_draw.text((20, 30), "My Tasks", fill="white", font=font)
    
    # Task items
    colors = [PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR, (52, 168, 83)]
    for i in range(4):
        y = 100 + i * 90
        screen_draw.rounded_rectangle([20, y, 240, y + 70], 10, fill=colors[i % len(colors)] + (100,), outline=colors[i % len(colors)])
        screen_draw.text((40, y + 20), f"Task {i+1}", fill=TEXT_COLOR, font=font)
    
    # Paste screen onto phone
    phone_mockup.paste(screen, (screen_margin, 40))
    
    # Paste phone onto feature graphic
    feature.paste(phone_mockup, (width - 350, height // 2 - 300), phone_mockup)
    
    # Save
    feature_path = os.path.join(output_dir, "feature_graphic.png")
    feature.save(feature_path, "PNG", quality=100)
    print(f"Created: {feature_path}")
    return feature_path

def create_screenshots():
    """Create sample screenshots in various sizes"""
    # Common phone screenshot sizes (width, height, name_suffix)
    phone_sizes = [
        (1080, 1920, "phone"),  # Common phone size (e.g., Pixel, Samsung)
        (1080, 2280, "tall_phone"),  # Tall phone (e.g., OnePlus, Pixel 6/7)
        (1170, 2532, "iphone"),  # iPhone 13/14 Pro
        (1242, 2208, "iphone_plus"),  # iPhone 8 Plus
        (1440, 3120, "pixel_xl"),  # Pixel 6/7 Pro
    ]
    
    # Tablet screenshot sizes
    tablet_sizes = [
        (1600, 2560, "tablet"),  # Common tablet size (e.g., Pixel C)
        (1536, 2048, "ipad"),  # iPad
        (2048, 2732, "ipad_pro"),  # iPad Pro 12.9"
    ]
    
    # Generate all phone screenshots
    for width, height, suffix in phone_sizes:
        create_screenshot(width, height, f"screenshot_phone_{suffix}.png")
    
    # Generate all tablet screenshots
    for width, height, suffix in tablet_sizes:
        create_screenshot(width, height, f"screenshot_tablet_{suffix}.png")

def create_screenshot(width, height, filename):
    """Helper function to create a single screenshot"""
    # Create a new image with a white background
    screenshot = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(screenshot)
    
    # Add a header
    header_height = height // 8
    draw.rectangle([(0, 0), (width, header_height)], fill=PRIMARY_COLOR)
    
    # Add app name in header
    try:
        font_size = header_height // 3
        font = ImageFont.truetype("arialbd.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    text_bbox = draw.textbbox((0, 0), APP_NAME, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    x = (width - text_width) // 2
    y = (header_height - text_height) // 2
    draw.text((x, y), APP_NAME, fill="white", font=font)
    
    # Add content area
    content_margin = width // 20
    content_top = header_height + content_margin
    
    # Add some sample content (tasks, calendar, etc.)
    colors = [PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR, (52, 168, 83)]
    
    # Determine how many items fit based on screen size
    item_count = min(6, max(3, height // 200))
    item_height = (height - content_top - content_margin * 2) // item_count
    
    for i in range(item_count):
        y = content_top + i * (item_height + content_margin // 2)
        
        # Alternate between task and calendar items
        if i % 2 == 0:
            # Task item
            draw.rounded_rectangle(
                [content_margin, y, 
                 width - content_margin, y + item_height - 10],
                15, fill=colors[i % len(colors)] + (30,), 
                outline=colors[i % len(colors)], width=2
            )
            
            # Task title
            draw.text(
                (content_margin * 2, y + 15), 
                f"Complete {['math', 'history', 'science', 'literature', 'coding', 'research'][i]}",
                fill=TEXT_COLOR, font=font
            )
            
            # Due date
            draw.text(
                (content_margin * 2, y + 50), 
                f"Due: {i+1}/0{i+1}/2025",
                fill=(100, 100, 100), font=font
            )
        else:
            # Calendar item
            draw.rounded_rectangle(
                [content_margin, y, 
                 width - content_margin, y + item_height - 10],
                15, fill=SECONDARY_COLOR + (20,), 
                outline=SECONDARY_COLOR, width=2
            )
            
            # Calendar event
            draw.text(
                (content_margin * 2, y + 15), 
                f"{['Lecture', 'Study Group', 'Exam', 'Project Due', 'Tutoring'][i % 5]}",
                fill=TEXT_COLOR, font=font
            )
            
            # Time
            draw.text(
                (content_margin * 2, y + 50), 
                f"{9 + i}:00 AM - {10 + i}:00 AM",
                fill=(100, 100, 100), font=font
            )
    
    # Save screenshot
    screenshot_path = os.path.join(output_dir, filename)
    screenshot.save(screenshot_path, "PNG", quality=90)
    print(f"Created: {screenshot_path}")
    return screenshot_path

def create_promo_graphic():
    """Create promo graphic (180x120px)"""
    width, height = 180, 120
    promo = Image.new('RGB', (width, height), PRIMARY_COLOR)
    draw = ImageDraw.Draw(promo)
    
    # Add app name
    try:
        font = ImageFont.truetype("arialbd.ttf", 24)
    except:
        font = ImageFont.load_default()
    
    text = APP_NAME
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    draw.text((x, y), text, fill="white", font=font)
    
    # Save
    promo_path = os.path.join(output_dir, "promo_graphic.png")
    promo.save(promo_path, "PNG", quality=100)
    print(f"Created: {promo_path}")
    return promo_path

def create_tv_banner():
    """Create TV banner (1280x720px)"""
    width, height = 1280, 720
    banner = Image.new('RGB', (width, height), (0, 0, 0))
    draw = ImageDraw.Draw(banner)
    
    # Add gradient background
    for x in range(width):
        r = int(PRIMARY_COLOR[0] * (1 - x/width) + 0 * (x/width))
        g = int(PRIMARY_COLOR[1] * (1 - x/width) + 0 * (x/width))
        b = int(PRIMARY_COLOR[2] * (1 - x/width) + 0 * (x/width))
        draw.line([(x, 0), (x, height)], fill=(r, g, b))
    
    # Add app icon (left side)
    icon_size = 300
    icon = Image.new('RGBA', (icon_size, icon_size), (0, 0, 0, 0))
    icon_draw = ImageDraw.Draw(icon)
    icon_draw.ellipse([(0, 0), (icon_size, icon_size)], fill=PRIMARY_COLOR)
    
    try:
        font = ImageFont.truetype("arialbd.ttf", icon_size // 2)
    except:
        font = ImageFont.load_default()
    
    text = "SF"
    text_bbox = icon_draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    position = ((icon_size - text_width) // 2, (icon_size - text_height) // 2 - icon_size * 0.05)
    icon_draw.text(position, text, fill="white", font=font)
    
    # Paste icon
    banner.paste(icon, (100, (height - icon_size) // 2), icon)
    
    # Add app name and tagline
    try:
        title_font = ImageFont.truetype("arialbd.ttf", 72)
        tagline_font = ImageFont.truetype("arial.ttf", 36)
    except:
        title_font = ImageFont.load_default()
        tagline_font = ImageFont.load_default()
    
    # App name
    draw.text((500, height // 3), APP_NAME, fill="white", font=title_font)
    
    # Tagline
    draw.text((500, height // 2), APP_TAGLINE, fill=SECONDARY_COLOR, font=tagline_font)
    
    # Description
    desc_lines = textwrap.wrap(APP_DESCRIPTION, width=40)
    for i, line in enumerate(desc_lines):
        draw.text(
            (500, height // 1.7 + i * 40),
            line,
            fill="white",
            font=tagline_font
        )
    
    # Save
    banner_path = os.path.join(output_dir, "tv_banner.png")
    banner.save(banner_path, "PNG", quality=100)
    print(f"Created: {banner_path}")
    return banner_path

def main():
    print("Generating Play Store assets...\n")
    
    # Create all assets
    create_app_icon()
    create_feature_graphic()
    create_screenshots()
    create_promo_graphic()
    create_tv_banner()
    
    print("\nAll assets have been generated in the 'play_store_assets' directory.")

if __name__ == "__main__":
    main()
