# 🎨 Logo Setup Instructions

## Quick Setup (Recommended)

1. **Go to your app**: Visit `http://localhost:8082/`
2. **Scroll down** to the "Upload Your Logo" section
3. **Click "Choose Logo Image"** and select your image file
4. **Preview** your logo in the preview area
5. **Click "Upload Logo"** to set it as your brand logo
6. **Done!** Your logo will now appear throughout the entire app

## Alternative: Add Image to Public Folder

If you prefer to add the image directly to the project:

1. **Copy your image file** to the `public` folder
2. **Rename it** to one of these names:
   - `yulii-logo.svg` ⭐ (recommended)
   - `logo.svg` ⭐ (recommended)
   - `yulii.svg` ⭐ (recommended)
   - `brand.svg` ⭐ (recommended)
   - `yulii-logo.png`
   - `logo.png`
   - `yulii.png`
   - `brand.png`
   - `logo.jpg`
   - `yulii.jpg`

3. **Restart your development server** (`npm run dev`)
4. **Your logo will automatically load** when you visit the app

## Supported Image Formats

- **SVG** ⭐ (highly recommended for logos - scalable, crisp at any size)
- **PNG** (good for logos with transparency)
- **JPG/JPEG** (good for photos)
- **GIF** (for animated logos)

## Recommended Specifications

- **Aspect Ratio**: Square (1:1) works best
- **Size**: 200x200 pixels minimum, 512x512 pixels recommended (or use SVG for perfect scaling)
- **File Size**: Under 5MB
- **Background**: Transparent PNG or SVG preferred for best results

## SVG Advantages

- **Perfect Scaling**: Looks crisp at any size (from 16px to 1000px+)
- **Small File Size**: Usually much smaller than PNG/JPG
- **Crisp on All Screens**: Perfect on retina displays and high-DPI screens
- **Editable**: Can be modified with code if needed
- **Future-Proof**: Vector format that never gets pixelated

## Troubleshooting

- **Logo not showing?** Make sure the file is in the `public` folder and named correctly
- **Logo too small/large?** The logo will automatically scale, but square images work best
- **Want to change the logo?** Use the upload section on the main page or go to Admin → Logo Manager

## Features

- ✅ **Automatic Detection**: App automatically finds your logo
- ✅ **Persistent Storage**: Logo stays even after browser refresh
- ✅ **Global Updates**: Changes appear everywhere instantly
- ✅ **Multiple Formats**: Supports PNG, JPG, GIF, SVG
- ✅ **Responsive**: Scales properly on all devices
- ✅ **Easy Management**: Upload, preview, and change anytime
