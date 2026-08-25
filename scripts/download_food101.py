import kagglehub
import os
import json
import shutil
from pathlib import Path

print("Downloading Kaggle dataset ranitsarkar01/the-food-101-data-set...")
path = kagglehub.dataset_download("ranitsarkar01/the-food-101-data-set")
print("Path to dataset files:", path)

# Output directory for images inside Next.js public folder
public_food_dir = Path(__file__).parent.parent / "public" / "food101"
public_food_dir.mkdir(parents=True, exist_ok=True)

# Find images directory in downloaded dataset
images_root = None
for root, dirs, files in os.walk(path):
    if "images" in dirs:
        images_root = Path(root) / "images"
        break
    elif any(d in ["apple_pie", "pizza", "samosa", "hamburger"] for d in dirs):
        images_root = Path(root)
        break

if not images_root or not images_root.exists():
    # Search for food class folders directly
    images_root = Path(path)

print(f"Dataset images root: {images_root}")

# Veg classes list in Food-101
veg_classes = {
    "apple_pie", "baklava", "beet_salad", "beignets", "bread_pudding", "caesar_salad",
    "caprese_salad", "carrot_cake", "cheese_plate", "cheesecake", "chocolate_cake",
    "chocolate_mousse", "churros", "cup_cakes", "deviled_eggs", "donuts", "edamame",
    "falafel", "french_fries", "garlic_bread", "greek_salad", "grilled_cheese_sandwich",
    "hummus", "ice_cream", "macaroni_and_cheese", "macaroons", "nachos", "onion_rings",
    "pancakes", "panna_cotta", "pizza", "samosa", "strawberry_shortcake", "tiramisu", "waffles"
}

# Category mappings for restaurant UI
category_map = {
    "starters": [
        "edamame", "falafel", "french_fries", "garlic_bread", "hummus", "nachos",
        "onion_rings", "samosa", "spring_rolls", "deviled_eggs", "bruschetta",
        "caprese_salad", "caesar_salad", "greek_salad", "fried_calamari", "gyoza"
    ],
    "mains": [
        "pizza", "hamburger", "lasagna", "macaroni_and_cheese", "pad_thai", "paella",
        "ramen", "fried_rice", "grilled_cheese_sandwich", "club_sandwich", "bibimbap",
        "spaghetti_bolognese", "spaghetti_carbonara", "steak", "tacos", "risotto",
        "pho", "dumplings", "gnocchi", "ravioli"
    ],
    "desserts": [
        "apple_pie", "baklava", "beignets", "bread_pudding", "carrot_cake", "cheesecake",
        "chocolate_cake", "chocolate_mousse", "churros", "cup_cakes", "donuts",
        "ice_cream", "macaroons", "pancakes", "panna_cotta", "strawberry_shortcake",
        "tiramisu", "waffles"
    ]
}

# Dish prices in Indian Rupees (₹)
price_map = {
    "pizza": 490, "hamburger": 380, "lasagna": 450, "pad_thai": 420, "ramen": 390,
    "fried_rice": 290, "french_fries": 240, "garlic_bread": 220, "samosa": 180,
    "falafel": 260, "nachos": 280, "gyoza": 340, "ice_cream": 210, "tiramisu": 320,
    "cheesecake": 310, "chocolate_cake": 290, "waffles": 260, "pancakes": 250,
    "donuts": 190, "churros": 230, "baklava": 280, "apple_pie": 270, "tacos": 360,
    "steak": 790, "risotto": 480, "spaghetti_bolognese": 440, "pho": 380
}

dishes_data = []

if images_root.exists():
    class_folders = [d for d in images_root.iterdir() if d.is_dir()]
    print(f"Found {len(class_folders)} food categories in dataset.")

    for class_folder in class_folders:
        class_name = class_folder.name
        # Find first image in category
        images = list(class_folder.glob("*.jpg")) + list(class_folder.glob("*.png")) + list(class_folder.glob("*.jpeg"))
        
        if images:
            sample_img = images[0]
            target_filename = f"{class_name}.jpg"
            target_path = public_food_dir / target_filename
            shutil.copy(sample_img, target_path)

            formatted_name = class_name.replace("_", " ").title()
            is_veg = class_name in veg_classes
            
            # Determine category
            cat_type = "Chef Mains"
            for key, val in category_map.items():
                if class_name in val:
                    if key == "starters":
                        cat_type = "Starters & Appetizers"
                    elif key == "desserts":
                        cat_type = "Desserts & Sweets"
                    break

            price = price_map.get(class_name, 350)

            dishes_data.append({
                "className": class_name,
                "name": formatted_name,
                "description": f"Authentic {formatted_name} prepared fresh with traditional spices and premium ingredients.",
                "price": float(price),
                "isVeg": is_veg,
                "spicyLevel": 2 if "spicy" in class_name or class_name in ["samosa", "tacos", "ramen", "curry"] else 0,
                "image": f"/food101/{target_filename}",
                "categoryName": cat_type
            })

# Save JSON metadata file
json_output_path = Path(__file__).parent.parent / "food101_dishes.json"
with open(json_output_path, "w", encoding="utf-8") as f:
    json.dump(dishes_data, f, indent=2)

print(f"Successfully processed {len(dishes_data)} Food-101 items with images saved to public/food101/")
